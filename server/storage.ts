import { 
  type User, 
  type InsertUser, 
  type TutorProfile, 
  type InsertTutorProfile,
  type Message,
  type InsertMessage,
  type Conversation,
  type InsertConversation,
  type Booking,
  type InsertBooking,
  type Payment,
  type InsertPayment,
  type TutorEarnings,
  type InsertTutorEarnings,
  type MembershipPlan,
  type InsertMembershipPlan,
  type TutorWithProfile,
  type ConversationWithUsers,
  type BookingWithDetails,
  type PaymentWithBooking,
  users,
  tutorProfiles,
  messages,
  conversations,
  bookings,
  payments,
  tutorEarnings,
  membershipPlans
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or, gte, lte, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Tutor profile operations
  getTutorProfile(userId: string): Promise<TutorProfile | undefined>;
  createTutorProfile(profile: InsertTutorProfile): Promise<TutorProfile>;
  updateTutorProfile(userId: string, profile: Partial<TutorProfile>): Promise<TutorProfile | undefined>;
  getTutorsWithProfiles(filters?: {
    subject?: string;
    location?: string;
    minRate?: number;
    maxRate?: number;
  }): Promise<TutorWithProfile[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  getUserMessages(userId: string): Promise<Message[]>;
  markMessageAsRead(messageId: string): Promise<void>;
  
  // Conversation operations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(studentId: string, tutorId: string): Promise<Conversation | undefined>;
  getUserConversations(userId: string): Promise<ConversationWithUsers[]>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(bookingId: string): Promise<BookingWithDetails | undefined>;
  getUserBookings(userId: string): Promise<BookingWithDetails[]>;
  getTutorBookings(tutorId: string): Promise<BookingWithDetails[]>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(paymentId: string): Promise<Payment | undefined>;
  updatePaymentStatus(paymentId: string, status: string, processedAt?: string): Promise<Payment | undefined>;
  
  // Earnings operations
  createTutorEarnings(earnings: InsertTutorEarnings): Promise<TutorEarnings>;
  getTutorEarnings(tutorId: string): Promise<TutorEarnings[]>;
  updateEarningsStatus(earningsId: string, status: string): Promise<TutorEarnings | undefined>;

  // Membership operations
  getMembershipPlans(): Promise<MembershipPlan[]>;
  createMembershipPlan(plan: InsertMembershipPlan): Promise<MembershipPlan>;
  updateTutorMembership(tutorId: string, membershipTier: string, expiry?: string): Promise<TutorProfile | null>;
  upgradeTutorMembership(tutorId: string, planName: string): Promise<TutorProfile | null>;
  getTutorsWithPriority(): Promise<TutorWithProfile[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Tutor profile operations
  async getTutorProfile(userId: string): Promise<TutorProfile | undefined> {
    const [profile] = await db
      .select()
      .from(tutorProfiles)
      .where(eq(tutorProfiles.userId, userId));
    return profile || undefined;
  }

  async createTutorProfile(insertProfile: InsertTutorProfile): Promise<TutorProfile> {
    const [profile] = await db
      .insert(tutorProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateTutorProfile(userId: string, profileUpdate: Partial<TutorProfile>): Promise<TutorProfile | undefined> {
    const [profile] = await db
      .update(tutorProfiles)
      .set(profileUpdate)
      .where(eq(tutorProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async getTutorsWithProfiles(filters?: {
    subject?: string;
    location?: string;
    minRate?: number;
    maxRate?: number;
  }): Promise<TutorWithProfile[]> {
    const conditions = [eq(users.userType, 'tutor')];
    
    if (filters) {
      if (filters.subject) {
        conditions.push(sql`${tutorProfiles.subjects} && ARRAY[${filters.subject}]`);
      }
      
      if (filters.location && filters.location.trim() !== '') {
        conditions.push(ilike(tutorProfiles.location, `%${filters.location}%`));
      }
      
      if (filters.minRate !== undefined) {
        conditions.push(gte(sql`CAST(${tutorProfiles.hourlyRate} AS DECIMAL)`, filters.minRate));
      }
      
      if (filters.maxRate !== undefined) {
        conditions.push(lte(sql`CAST(${tutorProfiles.hourlyRate} AS DECIMAL)`, filters.maxRate));
      }
    }

    const results = await db
      .select({
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
          backgroundCheckStatus: tutorProfiles.backgroundCheckStatus,
        }
      })
      .from(users)
      .innerJoin(tutorProfiles, eq(users.id, tutorProfiles.userId))
      .where(and(...conditions))
      .orderBy(desc(tutorProfiles.priorityRanking), desc(tutorProfiles.rating));

    return results.map(result => ({
      ...result,
      tutorProfile: result.tutorProfile
    })) as TutorWithProfile[];
  }

  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    const conversation = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!conversation[0]) return [];

    const messageList = await db
      .select()
      .from(messages)
      .where(
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
      )
      .orderBy(messages.createdAt);

    return messageList;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    const messageList = await db
      .select()
      .from(messages)
      .where(or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId)))
      .orderBy(desc(messages.createdAt));

    return messageList;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, messageId));
  }

  // Conversation operations
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async getConversation(studentId: string, tutorId: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.studentId, studentId),
          eq(conversations.tutorId, tutorId)
        )
      );
    return conversation || undefined;
  }

  async getUserConversations(userId: string): Promise<ConversationWithUsers[]> {
    const conversationList = await db
      .select({
        conversation: conversations,
        student: {
          id: users.id,
          username: users.username,
          email: users.email,
          password: users.password,
          fullName: users.fullName,
          userType: users.userType,
          avatar: users.avatar,
          createdAt: users.createdAt,
        },
        tutor: {
          id: users.id,
          username: users.username,
          email: users.email,
          password: users.password,
          fullName: users.fullName,
          userType: users.userType,
          avatar: users.avatar,
          createdAt: users.createdAt,
        }
      })
      .from(conversations)
      .innerJoin(users, eq(conversations.studentId, users.id))
      .innerJoin(users, eq(conversations.tutorId, users.id))
      .where(or(eq(conversations.studentId, userId), eq(conversations.tutorId, userId)))
      .orderBy(desc(conversations.lastMessageAt));

    // Get last message for each conversation
    const results = [];
    for (const row of conversationList) {
      const lastMessages = await db
        .select()
        .from(messages)
        .where(
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
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

      results.push({
        ...row.conversation,
        student: row.student,
        tutor: row.tutor,
        lastMessage: lastMessages[0] || undefined
      });
    }

    return results as ConversationWithUsers[];
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getBooking(bookingId: string): Promise<BookingWithDetails | undefined> {
    const result = await db
      .select({
        booking: bookings,
        student: users,
        tutor: users,
        tutorProfile: tutorProfiles
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.studentId, users.id))
      .innerJoin(users, eq(bookings.tutorId, users.id))
      .innerJoin(tutorProfiles, eq(bookings.tutorId, tutorProfiles.userId))
      .where(eq(bookings.id, bookingId));

    if (!result[0]) return undefined;

    return {
      ...result[0].booking,
      student: result[0].student,
      tutor: result[0].tutor,
      tutorProfile: result[0].tutorProfile
    } as BookingWithDetails;
  }

  async getUserBookings(userId: string): Promise<BookingWithDetails[]> {
    const results = await db
      .select({
        booking: bookings,
        student: users,
        tutor: users,
        tutorProfile: tutorProfiles
      })
      .from(bookings)
      .innerJoin(users, eq(bookings.studentId, users.id))
      .innerJoin(users, eq(bookings.tutorId, users.id))
      .innerJoin(tutorProfiles, eq(bookings.tutorId, tutorProfiles.userId))
      .where(or(eq(bookings.studentId, userId), eq(bookings.tutorId, userId)))
      .orderBy(desc(bookings.createdAt));

    return results.map(result => ({
      ...result.booking,
      student: result.student,
      tutor: result.tutor,
      tutorProfile: result.tutorProfile
    })) as BookingWithDetails[];
  }

  async getTutorBookings(tutorId: string): Promise<BookingWithDetails[]> {
    return this.getUserBookings(tutorId);
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, bookingId))
      .returning();
    return booking || undefined;
  }

  // Payment operations
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values({
        ...insertPayment,
        processedAt: null
      })
      .returning();
    return payment;
  }

  async getPayment(paymentId: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId));
    return payment || undefined;
  }

  async updatePaymentStatus(paymentId: string, status: string, processedAt?: string): Promise<Payment | undefined> {
    const [payment] = await db
      .update(payments)
      .set({ 
        status, 
        processedAt: processedAt || new Date().toISOString()
      })
      .where(eq(payments.id, paymentId))
      .returning();
    return payment || undefined;
  }

  // Earnings operations
  async createTutorEarnings(insertEarnings: InsertTutorEarnings): Promise<TutorEarnings> {
    const [earnings] = await db
      .insert(tutorEarnings)
      .values({
        ...insertEarnings,
        paidOutAt: null
      })
      .returning();
    return earnings;
  }

  async getTutorEarnings(tutorId: string): Promise<TutorEarnings[]> {
    const earningsList = await db
      .select()
      .from(tutorEarnings)
      .where(eq(tutorEarnings.tutorId, tutorId))
      .orderBy(desc(tutorEarnings.createdAt));

    return earningsList;
  }

  async updateEarningsStatus(earningsId: string, status: string): Promise<TutorEarnings | undefined> {
    const updateData: any = { status };
    
    if (status === "available") {
      updateData.availableForWithdrawal = true;
    } else if (status === "paid_out") {
      updateData.paidOutAt = new Date().toISOString();
    }

    const [earnings] = await db
      .update(tutorEarnings)
      .set(updateData)
      .where(eq(tutorEarnings.id, earningsId))
      .returning();
    return earnings || undefined;
  }

  // Membership operations
  async getMembershipPlans(): Promise<MembershipPlan[]> {
    const plans = await db
      .select()
      .from(membershipPlans)
      .where(eq(membershipPlans.isActive, true))
      .orderBy(sql`CAST(${membershipPlans.price} AS DECIMAL)`);

    return plans;
  }

  async createMembershipPlan(insertPlan: InsertMembershipPlan): Promise<MembershipPlan> {
    const [plan] = await db
      .insert(membershipPlans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async updateTutorMembership(tutorId: string, membershipTier: string, expiry?: string): Promise<TutorProfile | null> {
    const [profile] = await db
      .update(tutorProfiles)
      .set({ 
        membershipTier,
        membershipExpiry: expiry || null
      })
      .where(eq(tutorProfiles.userId, tutorId))
      .returning();
    return profile || null;
  }

  async upgradeTutorMembership(tutorId: string, planName: string): Promise<TutorProfile | null> {
    const plan = await db
      .select()
      .from(membershipPlans)
      .where(eq(membershipPlans.name, planName))
      .limit(1);

    if (!plan[0]) return null;

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    const [profile] = await db
      .update(tutorProfiles)
      .set({ 
        membershipTier: planName.toLowerCase(),
        membershipExpiry: expiry.toISOString(),
        priorityRanking: plan[0].priorityBoost,
        verifiedBadge: plan[0].verifiedBadge
      })
      .where(eq(tutorProfiles.userId, tutorId))
      .returning();
    
    return profile || null;
  }

  async getTutorsWithPriority(): Promise<TutorWithProfile[]> {
    return this.getTutorsWithProfiles();
  }
}

export const storage = new DatabaseStorage();