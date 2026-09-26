import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  googleId: text("google_id").unique(),
  password: text("password"),
  displayName: text("display_name").notNull(),
  avatar: text("avatar"),
  coverImage: text("cover_image"),
  bio: text("bio"),
  role: text("role").default("User"), // User, Player, Organization, Creator, Admin
  verificationType: text("verification_type"), // 'org' (blue), 'player' (purple), 'creator' (green), 'organizer' (yellow)
  teamId: text("team_id"),
  points: integer("points").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(1),
  lastActiveDate: text("last_active_date"),
  levelTitle: text("level_title").notNull().default("Rookie"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Teams Table
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  logo: text("logo"),
  cover: text("cover"),
  bio: text("bio"),
  game: text("game").default("Free Fire"),
  region: text("region").default("Global"),
  followersCount: integer("followers_count").default(0),
  championships: integer("championships").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Players Table
export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull(), // IGL, Fragger, Support, Flanker
  teamId: text("team_id"),
  teamName: text("team_name"),
  mains: text("mains"),
  kd: text("kd").default("0.0"),
  winRate: text("win_rate").default("0%"),
  matches: integer("matches").default(0),
  kills: integer("kills").default(0),
  avatar: text("avatar"),
  cover: text("cover"),
});

// Posts Table
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: text("author_id").notNull(),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(), // array of image URLs
  matchResult: jsonb("match_result"), // Optional score card { tournamentName, rank, kills, booyahs, prize }
  poll: jsonb("poll"), // Optional poll { question, options: [{id, text, votes}], totalVotes }
  hashtags: text("hashtags").array(),
  mentions: text("mentions").array(),
  isOfficial: boolean("is_official").default(false),
  tournamentId: text("tournament_id"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  repostsCount: integer("reposts_count").default(0),
  bookmarksCount: integer("bookmarks_count").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Comments Table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: text("post_id").notNull(),
  authorId: text("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Likes Table
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  postId: text("post_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Reposts Table
export const reposts = pgTable("reposts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  postId: text("post_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Bookmarks Table
export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  postId: text("post_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Follows Table
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: text("follower_id").notNull(),
  followingId: text("following_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientId: text("recipient_id").notNull(),
  senderId: text("sender_id").notNull(),
  type: text("type").notNull(), // 'like', 'comment', 'repost', 'follow', 'mention', 'tournament'
  postId: text("post_id"),
  read: boolean("read").default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Messages Table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Reports Table
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: text("reporter_id").notNull(),
  postId: text("post_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  bio: true,
  avatar: true,
});

export const insertPostSchema = z.object({
  content: z.string().min(1).max(280),
  mediaUrls: z.array(z.string()).optional(),
  matchResult: z.object({
    tournamentName: z.string(),
    rank: z.string(),
    kills: z.number(),
    booyahs: z.number(),
    prize: z.string().optional(),
  }).optional(),
  poll: z.object({
    question: z.string(),
    options: z.array(z.string()),
  }).optional(),
  tournamentId: z.string().optional(),
});

export const insertCommentSchema = z.object({
  content: z.string().min(1).max(280),
});

// TypeScript Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Player = typeof players.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Message = typeof messages.$inferSelect;

export interface MatchResultData {
  tournamentName: string;
  rank: string;
  kills: number;
  booyahs: number;
  prize?: string;
}

export interface PollData {
  question: string;
  options: { id: number; text: string; votes: number }[];
  totalVotes: number;
  userVotedIndex?: number;
}

export interface PostWithAuthor extends Omit<Post, 'matchResult' | 'poll'> {
  author: User;
  matchResult?: MatchResultData | null;
  poll?: PollData | null;
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  authorPlayer?: Player;
  authorTeam?: Team;
}

