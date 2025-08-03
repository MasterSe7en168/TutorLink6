import { storage } from "./storage";

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // First, create membership plans
    const membershipPlans = [
      {
        name: "Basic",
        price: "0.00",
        features: ["Basic profile", "Up to 5 subjects", "Standard search visibility"],
        priorityBoost: 0,
        featuredListings: false,
        verifiedBadge: false,
        profileCustomization: false,
        advancedAnalytics: false,
        prioritySupport: false,
        backgroundCheck: false,
        maxSubjects: 5,
        isActive: true
      },
      {
        name: "Premium",
        price: "29.99",
        features: ["Featured in search results", "Verified badge", "Up to 15 subjects", "Priority support", "Basic analytics"],
        priorityBoost: 50,
        featuredListings: true,
        verifiedBadge: true,
        profileCustomization: true,
        advancedAnalytics: false,
        prioritySupport: true,
        backgroundCheck: false,
        maxSubjects: 15,
        isActive: true
      },
      {
        name: "Elite",
        price: "59.99",
        features: ["Top priority in search", "Background check verification", "Unlimited subjects", "Advanced analytics", "Profile customization", "Premium support"],
        priorityBoost: 100,
        featuredListings: true,
        verifiedBadge: true,
        profileCustomization: true,
        advancedAnalytics: true,
        prioritySupport: true,
        backgroundCheck: true,
        maxSubjects: 50,
        isActive: true
      }
    ];

    console.log("Creating membership plans...");
    for (const planData of membershipPlans) {
      await storage.createMembershipPlan(planData);
    }

    // Create sample tutors
    const tutors = [
      {
        user: {
          username: "mrodriguez",
          email: "michael.rodriguez@email.com",
          password: "password123",
          fullName: "Dr. Michael Rodriguez",
          userType: "tutor" as const,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        profile: {
          title: "Mathematics Professor",
          bio: "Experienced mathematics professor with 8+ years of teaching calculus, statistics, and linear algebra.",
          subjects: ["Calculus", "Statistics", "Linear Algebra", "Mathematics"],
          experience: "8+ years experience",
          education: "PhD in Mathematics",
          hourlyRate: "45.00",
          location: "New York, NY",
          isOnline: true,
          rating: "4.9",
          reviewCount: 127,
          availability: "Mon-Fri 9AM-6PM",
          membershipTier: "elite",
          membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priorityRanking: 100,
          verifiedBadge: true,
          profileViews: 1247,
          responseRate: 98,
          backgroundCheckStatus: "verified"
        }
      },
      {
        user: {
          username: "sjohnson",
          email: "sarah.johnson@email.com",
          password: "password123",
          fullName: "Sarah Johnson",
          userType: "tutor" as const,
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        profile: {
          title: "English Literature Specialist",
          bio: "Passionate English literature teacher specializing in writing, literature analysis, and essay composition.",
          subjects: ["Writing", "Literature", "Essays", "English"],
          experience: "5+ years experience",
          education: "MA in English Literature",
          hourlyRate: "35.00",
          location: "Los Angeles, CA",
          isOnline: true,
          rating: "4.8",
          reviewCount: 89,
          availability: "Tue-Sat 10AM-8PM",
          membershipTier: "premium",
          membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          featuredUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          priorityRanking: 50,
          verifiedBadge: true,
          profileViews: 892,
          responseRate: 95,
          backgroundCheckStatus: "verified"
        }
      },
      {
        user: {
          username: "dkim",
          email: "david.kim@email.com",
          password: "password123",
          fullName: "David Kim",
          userType: "tutor" as const,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        profile: {
          title: "Computer Science Engineer",
          bio: "Software engineer with extensive experience in Python, JavaScript, and web development.",
          subjects: ["Python", "JavaScript", "Web Dev", "Computer Science"],
          experience: "6+ years experience",
          education: "BS Computer Science",
          hourlyRate: "50.00",
          location: "San Francisco, CA",
          isOnline: true,
          rating: "5.0",
          reviewCount: 156,
          availability: "Mon-Thu 2PM-10PM",
          membershipTier: "basic",
          membershipExpiry: null,
          featuredUntil: null,
          priorityRanking: 0,
          verifiedBadge: false,
          profileViews: 234,
          responseRate: 87,
          backgroundCheckStatus: "not_verified"
        }
      }
    ];

    console.log("Creating sample tutors...");
    for (const tutorData of tutors) {
      const user = await storage.createUser(tutorData.user);
      await storage.createTutorProfile({
        ...tutorData.profile,
        userId: user.id
      });
    }

    // Create a sample student
    console.log("Creating sample student...");
    await storage.createUser({
      username: "schen",
      email: "sarah.chen@email.com",
      password: "password123",
      fullName: "Sarah Chen",
      userType: "student",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    });

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Auto-run seeding when this module is loaded
seedDatabase()
  .then(() => {
    console.log("Seeding finished.");
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
  });

export { seedDatabase };