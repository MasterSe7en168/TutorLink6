var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  bookingsRelations: () => bookingsRelations,
  conversations: () => conversations,
  conversationsRelations: () => conversationsRelations,
  insertBookingSchema: () => insertBookingSchema,
  insertConversationSchema: () => insertConversationSchema,
  insertMembershipPlanSchema: () => insertMembershipPlanSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertTutorEarningsSchema: () => insertTutorEarningsSchema,
  insertTutorProfileSchema: () => insertTutorProfileSchema,
  insertUserSchema: () => insertUserSchema,
  membershipPlans: () => membershipPlans,
  messages: () => messages,
  messagesRelations: () => messagesRelations,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  tutorEarnings: () => tutorEarnings,
  tutorEarningsRelations: () => tutorEarningsRelations,
  tutorProfiles: () => tutorProfiles,
  tutorProfilesRelations: () => tutorProfilesRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(),
  // 'student' or 'tutor'
  avatar: text("avatar"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});
var tutorProfiles = pgTable("tutor_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  subjects: text("subjects").array().notNull(),
  experience: text("experience").notNull(),
  education: text("education").notNull(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  location: text("location"),
  isOnline: boolean("is_online").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  availability: text("availability"),
  membershipTier: text("membership_tier").notNull().default("basic"),
  // basic, premium, elite
  membershipExpiry: text("membership_expiry"),
  featuredUntil: text("featured_until"),
  priorityRanking: integer("priority_ranking").default(0),
  // Higher numbers = higher priority
  verifiedBadge: boolean("verified_badge").default(false),
  profileViews: integer("profile_views").default(0),
  responseRate: integer("response_rate").default(100),
  // percentage
  backgroundCheckStatus: text("background_check_status").default("not_verified")
  // not_verified, pending, verified
});
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  isRead: boolean("is_read").default(false)
});
var conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  lastMessageAt: text("last_message_at").default(sql`CURRENT_TIMESTAMP`)
});
var bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  duration: integer("duration").notNull(),
  // in minutes
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  tutorEarnings: decimal("tutor_earnings", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, completed, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"),
  // pending, paid, refunded
  paymentIntentId: text("payment_intent_id"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});
var payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  tutorEarnings: decimal("tutor_earnings", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull().default("pending"),
  // pending, succeeded, failed, refunded
  processedAt: text("processed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});
var membershipPlans = pgTable("membership_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  // Basic, Premium, Elite
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  // Monthly price
  features: text("features").array().notNull(),
  // List of features
  priorityBoost: integer("priority_boost").notNull().default(0),
  // Priority ranking boost
  featuredListings: boolean("featured_listings").default(false),
  verifiedBadge: boolean("verified_badge").default(false),
  profileCustomization: boolean("profile_customization").default(false),
  advancedAnalytics: boolean("advanced_analytics").default(false),
  prioritySupport: boolean("priority_support").default(false),
  backgroundCheck: boolean("background_check").default(false),
  maxSubjects: integer("max_subjects").default(5),
  isActive: boolean("is_active").default(true)
});
var tutorEarnings = pgTable("tutor_earnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  // pending, available, paid_out
  availableForWithdrawal: boolean("available_for_withdrawal").default(false),
  paidOutAt: text("paid_out_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertTutorProfileSchema = createInsertSchema(tutorProfiles).omit({
  id: true,
  rating: true,
  reviewCount: true
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true
});
var insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true
});
var insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
  paymentStatus: true
});
var insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  status: true,
  processedAt: true
});
var insertTutorEarningsSchema = createInsertSchema(tutorEarnings).omit({
  id: true,
  createdAt: true,
  status: true,
  availableForWithdrawal: true,
  paidOutAt: true
});
var insertMembershipPlanSchema = createInsertSchema(membershipPlans).omit({
  id: true
});
var usersRelations = relations(users, ({ many }) => ({
  tutorProfile: many(tutorProfiles),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  studentConversations: many(conversations, { relationName: "studentConversations" }),
  tutorConversations: many(conversations, { relationName: "tutorConversations" }),
  studentBookings: many(bookings, { relationName: "studentBookings" }),
  tutorBookings: many(bookings, { relationName: "tutorBookings" }),
  studentPayments: many(payments, { relationName: "studentPayments" }),
  tutorPayments: many(payments, { relationName: "tutorPayments" }),
  tutorEarnings: many(tutorEarnings)
}));
var tutorProfilesRelations = relations(tutorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [tutorProfiles.userId],
    references: [users.id]
  })
}));
var messagesRelations = relations(messages, ({ one }) => ({
  fromUser: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
    relationName: "sentMessages"
  }),
  toUser: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
    relationName: "receivedMessages"
  })
}));
var conversationsRelations = relations(conversations, ({ one }) => ({
  student: one(users, {
    fields: [conversations.studentId],
    references: [users.id],
    relationName: "studentConversations"
  }),
  tutor: one(users, {
    fields: [conversations.tutorId],
    references: [users.id],
    relationName: "tutorConversations"
  })
}));
var bookingsRelations = relations(bookings, ({ one, many }) => ({
  student: one(users, {
    fields: [bookings.studentId],
    references: [users.id],
    relationName: "studentBookings"
  }),
  tutor: one(users, {
    fields: [bookings.tutorId],
    references: [users.id],
    relationName: "tutorBookings"
  }),
  payments: many(payments),
  tutorEarnings: many(tutorEarnings)
}));
var paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id]
  }),
  student: one(users, {
    fields: [payments.studentId],
    references: [users.id],
    relationName: "studentPayments"
  }),
  tutor: one(users, {
    fields: [payments.tutorId],
    references: [users.id],
    relationName: "tutorPayments"
  })
}));
var tutorEarningsRelations = relations(tutorEarnings, ({ one }) => ({
  tutor: one(users, {
    fields: [tutorEarnings.tutorId],
    references: [users.id]
  }),
  booking: one(bookings, {
    fields: [tutorEarnings.bookingId],
    references: [bookings.id]
  })
}));

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, desc, or, gte, lte, ilike, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, userUpdate) {
    const [user] = await db.update(users).set(userUpdate).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  // Tutor profile operations
  async getTutorProfile(userId) {
    const [profile] = await db.select().from(tutorProfiles).where(eq(tutorProfiles.userId, userId));
    return profile || void 0;
  }
  async createTutorProfile(insertProfile) {
    const [profile] = await db.insert(tutorProfiles).values(insertProfile).returning();
    return profile;
  }
  async updateTutorProfile(userId, profileUpdate) {
    const [profile] = await db.update(tutorProfiles).set(profileUpdate).where(eq(tutorProfiles.userId, userId)).returning();
    return profile || void 0;
  }
  async getTutorsWithProfiles(filters) {
    const conditions = [eq(users.userType, "tutor")];
    if (filters) {
      if (filters.subject) {
        conditions.push(sql2`${tutorProfiles.subjects} && ARRAY[${filters.subject}]`);
      }
      if (filters.location && filters.location.trim() !== "") {
        conditions.push(ilike(tutorProfiles.location, `%${filters.location}%`));
      }
      if (filters.minRate !== void 0) {
        conditions.push(gte(sql2`CAST(${tutorProfiles.hourlyRate} AS DECIMAL)`, filters.minRate));
      }
      if (filters.maxRate !== void 0) {
        conditions.push(lte(sql2`CAST(${tutorProfiles.hourlyRate} AS DECIMAL)`, filters.maxRate));
      }
    }
    const results = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      password: users.password,
      fullName: users.fullName,
      userType: users.userType,
      avatar: users.avatar,
      createdAt: users.createdAt,
      tutorProfile: {
        id: tutorProfiles.id,
        userId: tutorProfiles.userId,
        title: tutorProfiles.title,
        bio: tutorProfiles.bio,
        subjects: tutorProfiles.subjects,
        experience: tutorProfiles.experience,
        education: tutorProfiles.education,
        hourlyRate: tutorProfiles.hourlyRate,
        location: tutorProfiles.location,
        isOnline: tutorProfiles.isOnline,
        rating: tutorProfiles.rating,
        reviewCount: tutorProfiles.reviewCount,
        availability: tutorProfiles.availability,
        membershipTier: tutorProfiles.membershipTier,
        membershipExpiry: tutorProfiles.membershipExpiry,
        featuredUntil: tutorProfiles.featuredUntil,
        priorityRanking: tutorProfiles.priorityRanking,
        verifiedBadge: tutorProfiles.verifiedBadge,
        profileViews: tutorProfiles.profileViews,
        responseRate: tutorProfiles.responseRate,
        backgroundCheckStatus: tutorProfiles.backgroundCheckStatus
      }
    }).from(users).innerJoin(tutorProfiles, eq(users.id, tutorProfiles.userId)).where(and(...conditions)).orderBy(desc(tutorProfiles.priorityRanking), desc(tutorProfiles.rating));
    return results.map((result) => ({
      ...result,
      tutorProfile: result.tutorProfile
    }));
  }
  // Message operations
  async createMessage(insertMessage) {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
  async getMessagesByConversation(conversationId) {
    const conversation = await db.select().from(conversations).where(eq(conversations.id, conversationId));
    if (!conversation[0]) return [];
    const messageList = await db.select().from(messages).where(
      or(
        and(
          eq(messages.fromUserId, conversation[0].studentId),
          eq(messages.toUserId, conversation[0].tutorId)
        ),
        and(
          eq(messages.fromUserId, conversation[0].tutorId),
          eq(messages.toUserId, conversation[0].studentId)
        )
      )
    ).orderBy(messages.createdAt);
    return messageList;
  }
  async getUserMessages(userId) {
    const messageList = await db.select().from(messages).where(or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId))).orderBy(desc(messages.createdAt));
    return messageList;
  }
  async markMessageAsRead(messageId) {
    await db.update(messages).set({ isRead: true }).where(eq(messages.id, messageId));
  }
  // Conversation operations
  async createConversation(insertConversation) {
    const [conversation] = await db.insert(conversations).values(insertConversation).returning();
    return conversation;
  }
  async getConversation(studentId, tutorId) {
    const [conversation] = await db.select().from(conversations).where(
      and(
        eq(conversations.studentId, studentId),
        eq(conversations.tutorId, tutorId)
      )
    );
    return conversation || void 0;
  }
  async getUserConversations(userId) {
    const conversationList = await db.select({
      conversation: conversations,
      student: {
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        fullName: users.fullName,
        userType: users.userType,
        avatar: users.avatar,
        createdAt: users.createdAt
      },
      tutor: {
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        fullName: users.fullName,
        userType: users.userType,
        avatar: users.avatar,
        createdAt: users.createdAt
      }
    }).from(conversations).innerJoin(users, eq(conversations.studentId, users.id)).innerJoin(users, eq(conversations.tutorId, users.id)).where(or(eq(conversations.studentId, userId), eq(conversations.tutorId, userId))).orderBy(desc(conversations.lastMessageAt));
    const results = [];
    for (const row of conversationList) {
      const lastMessages = await db.select().from(messages).where(
        or(
          and(
            eq(messages.fromUserId, row.conversation.studentId),
            eq(messages.toUserId, row.conversation.tutorId)
          ),
          and(
            eq(messages.fromUserId, row.conversation.tutorId),
            eq(messages.toUserId, row.conversation.studentId)
          )
        )
      ).orderBy(desc(messages.createdAt)).limit(1);
      results.push({
        ...row.conversation,
        student: row.student,
        tutor: row.tutor,
        lastMessage: lastMessages[0] || void 0
      });
    }
    return results;
  }
  // Booking operations
  async createBooking(insertBooking) {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }
  async getBooking(bookingId) {
    const result = await db.select({
      booking: bookings,
      student: users,
      tutor: users,
      tutorProfile: tutorProfiles
    }).from(bookings).innerJoin(users, eq(bookings.studentId, users.id)).innerJoin(users, eq(bookings.tutorId, users.id)).innerJoin(tutorProfiles, eq(bookings.tutorId, tutorProfiles.userId)).where(eq(bookings.id, bookingId));
    if (!result[0]) return void 0;
    return {
      ...result[0].booking,
      student: result[0].student,
      tutor: result[0].tutor,
      tutorProfile: result[0].tutorProfile
    };
  }
  async getUserBookings(userId) {
    const results = await db.select({
      booking: bookings,
      student: users,
      tutor: users,
      tutorProfile: tutorProfiles
    }).from(bookings).innerJoin(users, eq(bookings.studentId, users.id)).innerJoin(users, eq(bookings.tutorId, users.id)).innerJoin(tutorProfiles, eq(bookings.tutorId, tutorProfiles.userId)).where(or(eq(bookings.studentId, userId), eq(bookings.tutorId, userId))).orderBy(desc(bookings.createdAt));
    return results.map((result) => ({
      ...result.booking,
      student: result.student,
      tutor: result.tutor,
      tutorProfile: result.tutorProfile
    }));
  }
  async getTutorBookings(tutorId) {
    return this.getUserBookings(tutorId);
  }
  async updateBookingStatus(bookingId, status) {
    const [booking] = await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId)).returning();
    return booking || void 0;
  }
  // Payment operations
  async createPayment(insertPayment) {
    const [payment] = await db.insert(payments).values({
      ...insertPayment,
      processedAt: null
    }).returning();
    return payment;
  }
  async getPayment(paymentId) {
    const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId));
    return payment || void 0;
  }
  async updatePaymentStatus(paymentId, status, processedAt) {
    const [payment] = await db.update(payments).set({
      status,
      processedAt: processedAt || (/* @__PURE__ */ new Date()).toISOString()
    }).where(eq(payments.id, paymentId)).returning();
    return payment || void 0;
  }
  // Earnings operations
  async createTutorEarnings(insertEarnings) {
    const [earnings] = await db.insert(tutorEarnings).values({
      ...insertEarnings,
      paidOutAt: null
    }).returning();
    return earnings;
  }
  async getTutorEarnings(tutorId) {
    const earningsList = await db.select().from(tutorEarnings).where(eq(tutorEarnings.tutorId, tutorId)).orderBy(desc(tutorEarnings.createdAt));
    return earningsList;
  }
  async updateEarningsStatus(earningsId, status) {
    const updateData = { status };
    if (status === "available") {
      updateData.availableForWithdrawal = true;
    } else if (status === "paid_out") {
      updateData.paidOutAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    const [earnings] = await db.update(tutorEarnings).set(updateData).where(eq(tutorEarnings.id, earningsId)).returning();
    return earnings || void 0;
  }
  // Membership operations
  async getMembershipPlans() {
    const plans = await db.select().from(membershipPlans).where(eq(membershipPlans.isActive, true)).orderBy(sql2`CAST(${membershipPlans.price} AS DECIMAL)`);
    return plans;
  }
  async createMembershipPlan(insertPlan) {
    const [plan] = await db.insert(membershipPlans).values(insertPlan).returning();
    return plan;
  }
  async updateTutorMembership(tutorId, membershipTier, expiry) {
    const [profile] = await db.update(tutorProfiles).set({
      membershipTier,
      membershipExpiry: expiry || null
    }).where(eq(tutorProfiles.userId, tutorId)).returning();
    return profile || null;
  }
  async upgradeTutorMembership(tutorId, planName) {
    const plan = await db.select().from(membershipPlans).where(eq(membershipPlans.name, planName)).limit(1);
    if (!plan[0]) return null;
    const expiry = /* @__PURE__ */ new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    const [profile] = await db.update(tutorProfiles).set({
      membershipTier: planName.toLowerCase(),
      membershipExpiry: expiry.toISOString(),
      priorityRanking: plan[0].priorityBoost,
      verifiedBadge: plan[0].verifiedBadge
    }).where(eq(tutorProfiles.userId, tutorId)).returning();
    return profile || null;
  }
  async getTutorsWithPriority() {
    return this.getTutorsWithProfiles();
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
var loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
var searchSchema = z.object({
  subject: z.string().optional(),
  location: z.string().optional(),
  minRate: z.number().optional(),
  maxRate: z.number().optional()
});
var bookingCalculationSchema = z.object({
  duration: z.number().min(30),
  // minimum 30 minutes
  hourlyRate: z.number().min(1)
});
var PLATFORM_FEE_RATE = 0.15;
function calculateBookingAmount(duration, hourlyRate) {
  const totalAmount = duration / 60 * hourlyRate;
  const platformFee = totalAmount * PLATFORM_FEE_RATE;
  const tutorEarnings2 = totalAmount - platformFee;
  return {
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2)),
    tutorEarnings: parseFloat(tutorEarnings2.toFixed(2))
  };
}
async function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: void 0 } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ user: { ...user, password: void 0 } });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: void 0 });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/tutors", async (req, res) => {
    try {
      const filters = searchSchema.parse({
        subject: req.query.subject,
        location: req.query.location,
        minRate: req.query.minRate ? Number(req.query.minRate) : void 0,
        maxRate: req.query.maxRate ? Number(req.query.maxRate) : void 0
      });
      let tutors = await storage.getTutorsWithPriority();
      if (filters.subject) {
        tutors = tutors.filter(
          (tutor) => tutor.tutorProfile.subjects.some(
            (s) => s.toLowerCase().includes(filters.subject.toLowerCase())
          )
        );
      }
      if (filters.location) {
        tutors = tutors.filter(
          (tutor) => tutor.tutorProfile.location?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.minRate !== void 0) {
        tutors = tutors.filter(
          (tutor) => parseFloat(tutor.tutorProfile.hourlyRate) >= filters.minRate
        );
      }
      if (filters.maxRate !== void 0) {
        tutors = tutors.filter(
          (tutor) => parseFloat(tutor.tutorProfile.hourlyRate) <= filters.maxRate
        );
      }
      res.json(tutors.map((tutor) => ({ ...tutor, password: void 0 })));
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/tutors/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || user.userType !== "tutor") {
        return res.status(404).json({ message: "Tutor not found" });
      }
      const profile = await storage.getTutorProfile(user.id);
      if (!profile) {
        return res.status(404).json({ message: "Tutor profile not found" });
      }
      res.json({ ...user, password: void 0, tutorProfile: profile });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/tutors/profile", async (req, res) => {
    try {
      const profileData = insertTutorProfileSchema.parse(req.body);
      const profile = await storage.createTutorProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });
  app2.put("/api/tutors/profile/:userId", async (req, res) => {
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
  app2.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      let conversation = await storage.getConversation(messageData.fromUserId, messageData.toUserId);
      if (!conversation) {
        const fromUser = await storage.getUser(messageData.fromUserId);
        const toUser = await storage.getUser(messageData.toUserId);
        if (fromUser && toUser) {
          const studentId = fromUser.userType === "student" ? fromUser.id : toUser.id;
          const tutorId = fromUser.userType === "tutor" ? fromUser.id : toUser.id;
          conversation = await storage.createConversation({ studentId, tutorId });
        }
      }
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });
  app2.get("/api/users/:userId/messages", async (req, res) => {
    try {
      const messages2 = await storage.getUserMessages(req.params.userId);
      res.json(messages2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/users/:userId/conversations", async (req, res) => {
    try {
      const conversations2 = await storage.getUserConversations(req.params.userId);
      res.json(conversations2.map((conv) => ({
        ...conv,
        student: { ...conv.student, password: void 0 },
        tutor: { ...conv.tutor, password: void 0 }
      })));
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.put("/api/messages/:messageId/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(req.params.messageId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/subjects", async (req, res) => {
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
  app2.post("/api/bookings/calculate", async (req, res) => {
    try {
      const { duration, hourlyRate } = bookingCalculationSchema.parse(req.body);
      const calculation = calculateBookingAmount(duration, hourlyRate);
      res.json(calculation);
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation data" });
    }
  });
  app2.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
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
  app2.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const bookings2 = await storage.getUserBookings(req.params.userId);
      res.json(bookings2);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.get("/api/bookings/:bookingId", async (req, res) => {
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
  app2.put("/api/bookings/:bookingId/status", async (req, res) => {
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
  app2.post("/api/bookings/:bookingId/pay", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      const payment = await storage.createPayment({
        bookingId: booking.id,
        studentId: booking.studentId,
        tutorId: booking.tutorId,
        amount: booking.totalAmount,
        platformFee: booking.platformFee,
        tutorEarnings: booking.tutorEarnings,
        stripePaymentIntentId: `pi_mock_${Date.now()}`
      });
      await storage.updatePaymentStatus(payment.id, "succeeded");
      await storage.updateBookingStatus(booking.id, "confirmed");
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
  app2.get("/api/tutors/:tutorId/earnings", async (req, res) => {
    try {
      const earnings = await storage.getTutorEarnings(req.params.tutorId);
      const totalEarnings = earnings.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
      const availableEarnings = earnings.filter((e) => e.availableForWithdrawal).reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
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
  app2.get("/api/membership-plans", async (req, res) => {
    try {
      const plans = await storage.getMembershipPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  app2.post("/api/tutors/:tutorId/upgrade", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
