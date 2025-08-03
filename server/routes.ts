import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTutorProfileSchema, insertMessageSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

// Auth schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const searchSchema = z.object({
  subject: z.string().optional(),
  location: z.string().optional(),
  minRate: z.number().optional(),
  maxRate: z.number().optional()
});

const bookingCalculationSchema = z.object({
  duration: z.number().min(30), // minimum 30 minutes
  hourlyRate: z.number().min(1)
});

// Platform takes 15% fee
const PLATFORM_FEE_RATE = 0.15;

function calculateBookingAmount(duration: number, hourlyRate: number) {
  const totalAmount = (duration / 60) * hourlyRate;
  const platformFee = totalAmount * PLATFORM_FEE_RATE;
  const tutorEarnings = totalAmount - platformFee;
  
  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2)),
    tutorEarnings: parseFloat(tutorEarnings.toFixed(2))
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Tutor routes (with priority-based sorting)
  app.get("/api/tutors", async (req, res) => {
    try {
      const filters = searchSchema.parse({
        subject: req.query.subject as string,
        location: req.query.location as string,
        minRate: req.query.minRate ? Number(req.query.minRate) : undefined,
        maxRate: req.query.maxRate ? Number(req.query.maxRate) : undefined
      });
      
      // Get tutors with priority sorting
      let tutors = await storage.getTutorsWithPriority();
      
      // Apply filters
      if (filters.subject) {
        tutors = tutors.filter(tutor => 
          tutor.tutorProfile.subjects.some(s => 
            s.toLowerCase().includes(filters.subject!.toLowerCase())
          )
        );
      }
      
      if (filters.location) {
        tutors = tutors.filter(tutor => 
          tutor.tutorProfile.location?.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.minRate !== undefined) {
        tutors = tutors.filter(tutor => 
          parseFloat(tutor.tutorProfile.hourlyRate) >= filters.minRate!
        );
      }
      
      if (filters.maxRate !== undefined) {
        tutors = tutors.filter(tutor => 
          parseFloat(tutor.tutorProfile.hourlyRate) <= filters.maxRate!
        );
      }
      
      res.json(tutors.map(tutor => ({ ...tutor, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/tutors/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || user.userType !== 'tutor') {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
      const profile = await storage.getTutorProfile(user.id);
      if (!profile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }
      
      res.json({ ...user, password: undefined, tutorProfile: profile });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/tutors/profile", async (req, res) => {
    try {
      const profileData = insertTutorProfileSchema.parse(req.body);
      const profile = await storage.createTutorProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.put("/api/tutors/profile/:userId", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateTutorProfile(req.params.userId, updates);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Create or update conversation
      let conversation = await storage.getConversation(messageData.fromUserId, messageData.toUserId);
      if (!conversation) {
        // Determine student and tutor
        const fromUser = await storage.getUser(messageData.fromUserId);
        const toUser = await storage.getUser(messageData.toUserId);
        
        if (fromUser && toUser) {
          const studentId = fromUser.userType === 'student' ? fromUser.id : toUser.id;
          const tutorId = fromUser.userType === 'tutor' ? fromUser.id : toUser.id;
          
          conversation = await storage.createConversation({ studentId, tutorId });
        }
      }
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/users/:userId/messages", async (req, res) => {
    try {
      const messages = await storage.getUserMessages(req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/users/:userId/conversations", async (req, res) => {
    try {
      const conversations = await storage.getUserConversations(req.params.userId);
      res.json(conversations.map(conv => ({
        ...conv,
        student: { ...conv.student, password: undefined },
        tutor: { ...conv.tutor, password: undefined }
      })));
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/messages/:messageId/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.messageId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Subject categories
  app.get("/api/subjects", async (req, res) => {
    const subjects = [
      { name: "Mathematics", icon: "calculator", count: 245 },
      { name: "Science", icon: "flask", count: 189 },
      { name: "Programming", icon: "code", count: 156 },
      { name: "Languages", icon: "language", count: 312 },
      { name: "English", icon: "book", count: 203 },
      { name: "History", icon: "landmark", count: 127 }
    ];
    res.json(subjects);
  });

  // Booking calculation endpoint for quote
  app.post("/api/bookings/calculate", async (req, res) => {
    try {
      const { duration, hourlyRate } = bookingCalculationSchema.parse(req.body);
      const calculation = calculateBookingAmount(duration, hourlyRate);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation data" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Calculate amounts
      const calculation = calculateBookingAmount(bookingData.duration, parseFloat(bookingData.hourlyRate));
      
      const booking = await storage.createBooking({
        ...bookingData,
        totalAmount: calculation.totalAmount.toString(),
        platformFee: calculation.platformFee.toString(),
        tutorEarnings: calculation.tutorEarnings.toString()
      });
      
      res.json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  // Get user bookings
  app.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Get specific booking
  app.get("/api/bookings/:bookingId", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Update booking status
  app.put("/api/bookings/:bookingId/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(req.params.bookingId, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Simulate payment processing (in real app, integrate with Stripe)
  app.post("/api/bookings/:bookingId/pay", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Create payment record
      const payment = await storage.createPayment({
        bookingId: booking.id,
        studentId: booking.studentId,
        tutorId: booking.tutorId,
        amount: booking.totalAmount,
        platformFee: booking.platformFee,
        tutorEarnings: booking.tutorEarnings,
        stripePaymentIntentId: `pi_mock_${Date.now()}`
      });

      // Update payment status to succeeded (simulate successful payment)
      await storage.updatePaymentStatus(payment.id, "succeeded");
      
      // Update booking payment status
      await storage.updateBookingStatus(booking.id, "confirmed");

      // Create tutor earnings record
      await storage.createTutorEarnings({
        tutorId: booking.tutorId,
        bookingId: booking.id,
        amount: booking.tutorEarnings
      });

      res.json({ success: true, paymentId: payment.id });
    } catch (error) {
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  // Get tutor earnings
  app.get("/api/tutors/:tutorId/earnings", async (req, res) => {
    try {
      const earnings = await storage.getTutorEarnings(req.params.tutorId);
      const totalEarnings = earnings.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
      const availableEarnings = earnings
        .filter(e => e.availableForWithdrawal)
        .reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
      
      res.json({
        earnings,
        summary: {
          totalEarnings: totalEarnings.toFixed(2),
          availableEarnings: availableEarnings.toFixed(2),
          pendingEarnings: (totalEarnings - availableEarnings).toFixed(2)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Membership Plan routes
  app.get("/api/membership-plans", async (req, res) => {
    try {
      const plans = await storage.getMembershipPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Upgrade tutor membership
  app.post("/api/tutors/:tutorId/upgrade", async (req, res) => {
    try {
      const { planName } = req.body;
      const updatedProfile = await storage.upgradeTutorMembership(req.params.tutorId, planName);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Tutor not found or invalid plan" });
      }
      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
