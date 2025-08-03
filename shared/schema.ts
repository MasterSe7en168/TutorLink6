import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // 'student' or 'tutor'
  avatar: text("avatar"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const tutorProfiles = pgTable("tutor_profiles", {
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
  membershipTier: text("membership_tier").notNull().default("basic"), // basic, premium, elite
  membershipExpiry: text("membership_expiry"),
  featuredUntil: text("featured_until"),
  priorityRanking: integer("priority_ranking").default(0), // Higher numbers = higher priority
  verifiedBadge: boolean("verified_badge").default(false),
  profileViews: integer("profile_views").default(0),
  responseRate: integer("response_rate").default(100), // percentage
  backgroundCheckStatus: text("background_check_status").default("not_verified"), // not_verified, pending, verified
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  isRead: boolean("is_read").default(false),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  lastMessageAt: text("last_message_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => users.id),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  tutorEarnings: decimal("tutor_earnings", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, refunded
  paymentIntentId: text("payment_intent_id"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  tutorEarnings: decimal("tutor_earnings", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull().default("pending"), // pending, succeeded, failed, refunded
  processedAt: text("processed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const membershipPlans = pgTable("membership_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Basic, Premium, Elite
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Monthly price
  features: text("features").array().notNull(), // List of features
  priorityBoost: integer("priority_boost").notNull().default(0), // Priority ranking boost
  featuredListings: boolean("featured_listings").default(false),
  verifiedBadge: boolean("verified_badge").default(false),
  profileCustomization: boolean("profile_customization").default(false),
  advancedAnalytics: boolean("advanced_analytics").default(false),
  prioritySupport: boolean("priority_support").default(false),
  backgroundCheck: boolean("background_check").default(false),
  maxSubjects: integer("max_subjects").default(5),
  isActive: boolean("is_active").default(true),
});

export const tutorEarnings = pgTable("tutor_earnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tutorId: varchar("tutor_id").notNull().references(() => users.id),
  bookingId: varchar("booking_id").notNull().references(() => bookings.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, available, paid_out
  availableForWithdrawal: boolean("available_for_withdrawal").default(false),
  paidOutAt: text("paid_out_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTutorProfileSchema = createInsertSchema(tutorProfiles).omit({
  id: true,
  rating: true,
  reviewCount: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
  paymentStatus: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  status: true,
  processedAt: true,
});

export const insertTutorEarningsSchema = createInsertSchema(tutorEarnings).omit({
  id: true,
  createdAt: true,
  status: true,
  availableForWithdrawal: true,
  paidOutAt: true,
});

export const insertMembershipPlanSchema = createInsertSchema(membershipPlans).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TutorProfile = typeof tutorProfiles.$inferSelect;
export type InsertTutorProfile = z.infer<typeof insertTutorProfileSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type TutorEarnings = typeof tutorEarnings.$inferSelect;
export type InsertTutorEarnings = z.infer<typeof insertTutorEarningsSchema>;
export type MembershipPlan = typeof membershipPlans.$inferSelect;
export type InsertMembershipPlan = z.infer<typeof insertMembershipPlanSchema>;

// Extended types for API responses
export type TutorWithProfile = User & {
  tutorProfile: TutorProfile;
};

export type ConversationWithUsers = Conversation & {
  student: User;
  tutor: User;
  lastMessage?: Message;
};

export type BookingWithDetails = Booking & {
  student: User;
  tutor: User;
  tutorProfile: TutorProfile;
};

export type PaymentWithBooking = Payment & {
  booking: BookingWithDetails;
};

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tutorProfile: many(tutorProfiles),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
  studentConversations: many(conversations, { relationName: "studentConversations" }),
  tutorConversations: many(conversations, { relationName: "tutorConversations" }),
  studentBookings: many(bookings, { relationName: "studentBookings" }),
  tutorBookings: many(bookings, { relationName: "tutorBookings" }),
  studentPayments: many(payments, { relationName: "studentPayments" }),
  tutorPayments: many(payments, { relationName: "tutorPayments" }),
  tutorEarnings: many(tutorEarnings),
}));

export const tutorProfilesRelations = relations(tutorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [tutorProfiles.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  fromUser: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  toUser: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));

export const conversationsRelations = relations(conversations, ({ one }) => ({
  student: one(users, {
    fields: [conversations.studentId],
    references: [users.id],
    relationName: "studentConversations",
  }),
  tutor: one(users, {
    fields: [conversations.tutorId],
    references: [users.id],
    relationName: "tutorConversations",
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  student: one(users, {
    fields: [bookings.studentId],
    references: [users.id],
    relationName: "studentBookings",
  }),
  tutor: one(users, {
    fields: [bookings.tutorId],
    references: [users.id],
    relationName: "tutorBookings",
  }),
  payments: many(payments),
  tutorEarnings: many(tutorEarnings),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
  student: one(users, {
    fields: [payments.studentId],
    references: [users.id],
    relationName: "studentPayments",
  }),
  tutor: one(users, {
    fields: [payments.tutorId],
    references: [users.id],
    relationName: "tutorPayments",
  }),
}));

export const tutorEarningsRelations = relations(tutorEarnings, ({ one }) => ({
  tutor: one(users, {
    fields: [tutorEarnings.tutorId],
    references: [users.id],
  }),
  booking: one(bookings, {
    fields: [tutorEarnings.bookingId],
    references: [bookings.id],
  }),
}));
