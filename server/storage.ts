import {
  type User,
  type InsertUser,
  type Post,
  type Comment,
  type Team,
  type Player,
  type Notification,
  type Message,
  type PostWithAuthor,
  type MatchResultData,
  type PollData,
  users,
  posts,
  comments,
  likes,
  reposts,
  bookmarks,
  follows,
  notifications,
  messages,
  teams,
  players,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, and, desc, sql, ilike, or, inArray } from "drizzle-orm";

// ========================
// INTERFACE
// ========================

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & Partial<User>): Promise<User>;
  upsertGoogleUser(profile: {
    googleId: string;
    email?: string;
    displayName: string;
    avatar?: string;
  }): Promise<User>;
  updateUserPoints(userId: string, pointsDelta: number): Promise<User>;

  // Posts
  createPost(authorId: string, postData: {
    content: string;
    mediaUrls?: string[];
    matchResult?: MatchResultData;
    poll?: PollData;
    tournamentId?: string;
  }): Promise<PostWithAuthor>;
  getFeedPosts(currentUserId?: string, tab?: string): Promise<PostWithAuthor[]>;
  getPostById(postId: string, currentUserId?: string): Promise<PostWithAuthor | undefined>;
  getUserPosts(username: string, currentUserId?: string): Promise<PostWithAuthor[]>;
  deletePost(postId: string, userId: string): Promise<boolean>;

  // Engagements
  toggleLike(userId: string, postId: string): Promise<{ isLiked: boolean; likesCount: number }>;
  toggleRepost(userId: string, postId: string): Promise<{ isReposted: boolean; repostsCount: number }>;
  toggleBookmark(userId: string, postId: string): Promise<{ isBookmarked: boolean }>;

  // Comments
  addComment(authorId: string, postId: string, content: string): Promise<Comment>;
  getPostComments(postId: string): Promise<(Comment & { author: User })[]>;

  // Social Graph
  toggleFollow(followerId: string, followingId: string): Promise<{ isFollowing: boolean }>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getSuggestedUsers(currentUserId?: string): Promise<User[]>;

  // Esports Teams & Players
  getTeams(): Promise<Team[]>;
  getTeamBySlug(slug: string): Promise<Team | undefined>;
  getPlayers(): Promise<Player[]>;
  getPlayerByUsername(username: string): Promise<Player | undefined>;

  // Discovery & Hashtags
  getTrendingHashtags(): Promise<{ tag: string; count: number }[]>;
  getPostsByHashtag(tag: string, currentUserId?: string): Promise<PostWithAuthor[]>;
  search(query: string, currentUserId?: string): Promise<{
    users: User[];
    posts: PostWithAuthor[];
    teams: Team[];
    players: Player[];
  }>;

  // Notifications
  getNotifications(userId: string): Promise<(Notification & { sender: User; post?: Post })[]>;

  // Bookmarks
  getBookmarks(userId: string): Promise<PostWithAuthor[]>;

  // Messages
  getMessages(userId: string, otherUserId: string): Promise<Message[]>;
  sendMessage(senderId: string, receiverId: string, content: string): Promise<Message>;
}

// ========================
// DRIZZLE (PostgreSQL) STORAGE
// ========================

export class DrizzleStorage implements IStorage {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  // ---- USERS ----

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(ilike(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email as any, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser & Partial<User>): Promise<User> {
    const result = await this.db.insert(users).values({
      username: insertUser.username,
      password: insertUser.password || "",
      displayName: insertUser.displayName || insertUser.username,
      avatar: insertUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${insertUser.username}`,
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: insertUser.bio || "Esports competitor on Limitless Social.",
      role: insertUser.role || "User",
      verificationType: insertUser.verificationType || null,
      teamId: insertUser.teamId || null,
      points: 50,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Rookie Competitor",
    }).returning();
    return result[0];
  }

  async upsertGoogleUser(profile: {
    googleId: string;
    email?: string;
    displayName: string;
    avatar?: string;
  }): Promise<User> {
    // Try to find by email first
    let existing: User | undefined;
    if (profile.email) {
      existing = await this.getUserByEmail(profile.email);
    }
    if (!existing && profile.googleId) {
      const byGoogle = await this.db.select().from(users).where(eq(users.googleId, profile.googleId)).limit(1);
      existing = byGoogle[0];
    }

    if (existing) {
      // Update avatar if Google provides a newer one
      if (profile.avatar && existing.avatar !== profile.avatar) {
        const updated = await this.db.update(users)
          .set({ avatar: profile.avatar })
          .where(eq(users.id, existing.id))
          .returning();
        return updated[0];
      }
      return existing;
    }

    // Generate a unique username from Google display name
    const baseUsername = profile.displayName.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 20);
    let username = baseUsername;
    let attempt = 0;
    while (true) {
      const taken = await this.getUserByUsername(username);
      if (!taken) break;
      attempt++;
      username = `${baseUsername}_${attempt}`;
    }

    const result = await this.db.insert(users).values({
      username,
      password: "", // Google users don't have a password
      displayName: profile.displayName,
      avatar: profile.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: "Esports competitor on Limitless Social.",
      role: "User",
      verificationType: null,
      teamId: null,
      points: 50,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Rookie Competitor",
    }).returning();

    return result[0];
  }

  async updateUserPoints(userId: string, pointsDelta: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const newPoints = (user.points || 0) + pointsDelta;
    let levelTitle = user.levelTitle;
    if (newPoints >= 5000) levelTitle = "Legend Competitor";
    else if (newPoints >= 2500) levelTitle = "Pro Elite";
    else if (newPoints >= 1000) levelTitle = "Challenger Level 12";
    else if (newPoints >= 300) levelTitle = "Contender";

    const result = await this.db.update(users)
      .set({ points: newPoints, levelTitle })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // ---- POSTS ----

  async createPost(authorId: string, postData: {
    content: string;
    mediaUrls?: string[];
    matchResult?: MatchResultData;
    poll?: PollData;
    tournamentId?: string;
  }): Promise<PostWithAuthor> {
    const author = await this.getUser(authorId);
    if (!author) throw new Error("Author not found");

    const hashtagMatches = postData.content.match(/#[\w]+/g) || [];
    const hashtags = hashtagMatches.map(h => h.substring(1));
    const mentionMatches = postData.content.match(/@[\w]+/g) || [];
    const mentions = mentionMatches.map(m => m.substring(1));

    const result = await this.db.insert(posts).values({
      authorId,
      content: postData.content,
      mediaUrls: postData.mediaUrls || [],
      matchResult: postData.matchResult || null,
      poll: postData.poll || null,
      hashtags,
      mentions,
      isOfficial: author.role === "Organization" || author.role === "Admin",
      tournamentId: postData.tournamentId || null,
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      bookmarksCount: 0,
    }).returning();

    const post = result[0];
    await this.updateUserPoints(authorId, 5);

    return {
      ...post,
      matchResult: post.matchResult as MatchResultData | null,
      poll: post.poll as PollData | null,
      author,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
    };
  }

  async getFeedPosts(currentUserId?: string, tab: string = "for-you"): Promise<PostWithAuthor[]> {
    let allPosts: Post[];

    if (tab === "following" && currentUserId) {
      const followingRows = await this.db.select().from(follows).where(eq(follows.followerId, currentUserId));
      const followingIds = followingRows.map((f: any) => f.followingId);
      followingIds.push(currentUserId);

      if (followingIds.length === 0) {
        allPosts = [];
      } else {
        allPosts = await this.db.select().from(posts)
          .where(inArray(posts.authorId, followingIds))
          .orderBy(desc(posts.createdAt));
      }
    } else if (tab === "trending") {
      allPosts = await this.db.select().from(posts)
        .orderBy(desc(sql`${posts.likesCount} + ${posts.commentsCount} * 2`));
    } else {
      allPosts = await this.db.select().from(posts).orderBy(desc(posts.createdAt));
    }

    return Promise.all(allPosts.map((p: any) => this.enrichPost(p, currentUserId)));
  }

  async getPostById(postId: string, currentUserId?: string): Promise<PostWithAuthor | undefined> {
    const result = await this.db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    if (!result[0]) return undefined;
    return this.enrichPost(result[0], currentUserId);
  }

  async getUserPosts(username: string, currentUserId?: string): Promise<PostWithAuthor[]> {
    const user = await this.getUserByUsername(username);
    if (!user) return [];

    const userPosts = await this.db.select().from(posts)
      .where(eq(posts.authorId, user.id))
      .orderBy(desc(posts.createdAt));

    return Promise.all(userPosts.map((p: any) => this.enrichPost(p, currentUserId)));
  }

  async deletePost(postId: string, userId: string): Promise<boolean> {
    const post = await this.getPostById(postId);
    if (!post || post.authorId !== userId) return false;
    await this.db.delete(posts).where(eq(posts.id, postId));
    return true;
  }

  private async enrichPost(post: Post, currentUserId?: string): Promise<PostWithAuthor> {
    const author = await this.getUser(post.authorId);
    if (!author) throw new Error(`Author not found for post ${post.id}`);

    const authorPlayer = await this.getPlayerByUsername(author.username);
    const authorTeam = author.teamId ? (await this.getTeamBySlug(author.teamId)) : undefined;

    let isLiked = false;
    let isReposted = false;
    let isBookmarked = false;

    if (currentUserId) {
      const likeRow = await this.db.select().from(likes)
        .where(and(eq(likes.userId, currentUserId), eq(likes.postId, post.id)))
        .limit(1);
      isLiked = likeRow.length > 0;

      const repostRow = await this.db.select().from(reposts)
        .where(and(eq(reposts.userId, currentUserId), eq(reposts.postId, post.id)))
        .limit(1);
      isReposted = repostRow.length > 0;

      const bookmarkRow = await this.db.select().from(bookmarks)
        .where(and(eq(bookmarks.userId, currentUserId), eq(bookmarks.postId, post.id)))
        .limit(1);
      isBookmarked = bookmarkRow.length > 0;
    }

    return {
      ...post,
      matchResult: post.matchResult as MatchResultData | null,
      poll: post.poll as PollData | null,
      author,
      authorPlayer,
      authorTeam,
      isLiked,
      isReposted,
      isBookmarked,
    };
  }

  // ---- ENGAGEMENTS ----

  async toggleLike(userId: string, postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const existing = await this.db.select().from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
      .limit(1);

    const post = await this.db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    if (!post[0]) throw new Error("Post not found");

    let isLiked: boolean;
    let newCount: number;

    if (existing.length > 0) {
      await this.db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
      newCount = Math.max(0, (post[0].likesCount || 1) - 1);
      isLiked = false;
    } else {
      await this.db.insert(likes).values({ userId, postId });
      newCount = (post[0].likesCount || 0) + 1;
      isLiked = true;

      if (post[0].authorId !== userId) {
        await this.db.insert(notifications).values({
          recipientId: post[0].authorId,
          senderId: userId,
          type: "like",
          postId,
          read: false,
        });
      }
    }

    await this.db.update(posts).set({ likesCount: newCount }).where(eq(posts.id, postId));
    return { isLiked, likesCount: newCount };
  }

  async toggleRepost(userId: string, postId: string): Promise<{ isReposted: boolean; repostsCount: number }> {
    const existing = await this.db.select().from(reposts)
      .where(and(eq(reposts.userId, userId), eq(reposts.postId, postId)))
      .limit(1);

    const post = await this.db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    if (!post[0]) throw new Error("Post not found");

    let isReposted: boolean;
    let newCount: number;

    if (existing.length > 0) {
      await this.db.delete(reposts).where(and(eq(reposts.userId, userId), eq(reposts.postId, postId)));
      newCount = Math.max(0, (post[0].repostsCount || 1) - 1);
      isReposted = false;
    } else {
      await this.db.insert(reposts).values({ userId, postId });
      newCount = (post[0].repostsCount || 0) + 1;
      isReposted = true;
    }

    await this.db.update(posts).set({ repostsCount: newCount }).where(eq(posts.id, postId));
    return { isReposted, repostsCount: newCount };
  }

  async toggleBookmark(userId: string, postId: string): Promise<{ isBookmarked: boolean }> {
    const existing = await this.db.select().from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)))
      .limit(1);

    let isBookmarked: boolean;
    if (existing.length > 0) {
      await this.db.delete(bookmarks).where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
      isBookmarked = false;
    } else {
      await this.db.insert(bookmarks).values({ userId, postId });
      isBookmarked = true;
    }

    return { isBookmarked };
  }

  // ---- COMMENTS ----

  async addComment(authorId: string, postId: string, content: string): Promise<Comment> {
    const post = await this.db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    if (!post[0]) throw new Error("Post not found");

    const result = await this.db.insert(comments).values({ postId, authorId, content }).returning();
    const newCount = (post[0].commentsCount || 0) + 1;
    await this.db.update(posts).set({ commentsCount: newCount }).where(eq(posts.id, postId));
    await this.updateUserPoints(authorId, 2);

    if (post[0].authorId !== authorId) {
      await this.db.insert(notifications).values({
        recipientId: post[0].authorId,
        senderId: authorId,
        type: "comment",
        postId,
        read: false,
      });
    }

    return result[0];
  }

  async getPostComments(postId: string): Promise<(Comment & { author: User })[]> {
    const commentRows = await this.db.select().from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);

    const enriched: (Comment & { author: User })[] = [];
    for (const c of commentRows) {
      const author = await this.getUser(c.authorId);
      if (author) enriched.push({ ...c, author });
    }
    return enriched;
  }

  // ---- SOCIAL GRAPH ----

  async toggleFollow(followerId: string, followingId: string): Promise<{ isFollowing: boolean }> {
    const existing = await this.db.select().from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .limit(1);

    let isFollowing: boolean;
    if (existing.length > 0) {
      await this.db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
      isFollowing = false;
    } else {
      await this.db.insert(follows).values({ followerId, followingId });
      isFollowing = true;
      await this.db.insert(notifications).values({
        recipientId: followingId,
        senderId: followerId,
        type: "follow",
        postId: null,
        read: false,
      });
    }

    return { isFollowing };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const result = await this.db.select().from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .limit(1);
    return result.length > 0;
  }

  async getSuggestedUsers(currentUserId?: string): Promise<User[]> {
    const allUsers = await this.db.select().from(users).limit(10);
    return allUsers.filter((u: any) => u.id !== currentUserId).slice(0, 5);
  }

  // ---- TEAMS & PLAYERS ----

  async getTeams(): Promise<Team[]> {
    return this.db.select().from(teams);
  }

  async getTeamBySlug(slug: string): Promise<Team | undefined> {
    // Try by slug first, then by id
    const bySlug = await this.db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
    if (bySlug[0]) return bySlug[0];
    const byId = await this.db.select().from(teams).where(eq(teams.id, slug)).limit(1);
    return byId[0];
  }

  async getPlayers(): Promise<Player[]> {
    return this.db.select().from(players);
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    const result = await this.db.select().from(players).where(eq(players.username, username)).limit(1);
    return result[0];
  }

  // ---- DISCOVERY ----

  async getTrendingHashtags(): Promise<{ tag: string; count: number }[]> {
    const allPosts = await this.db.select().from(posts);
    const counts: Record<string, number> = {};
    for (const p of allPosts) {
      for (const tag of (p.hashtags || [])) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    return Object.entries(counts).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
  }

  async getPostsByHashtag(tag: string, currentUserId?: string): Promise<PostWithAuthor[]> {
    const cleanTag = tag.replace(/^#/, "").toLowerCase();
    const allPosts = await this.db.select().from(posts);
    const matching = allPosts.filter((p: any) => p.hashtags?.some((h: any) => h.toLowerCase() === cleanTag));
    return Promise.all(matching.map((p: any) => this.enrichPost(p, currentUserId)));
  }

  async search(query: string, currentUserId?: string): Promise<{
    users: User[];
    posts: PostWithAuthor[];
    teams: Team[];
    players: Player[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) return { users: [], posts: [], teams: [], players: [] };

    const matchingUsers = await this.db.select().from(users)
      .where(or(ilike(users.username, `%${q}%`), ilike(users.displayName, `%${q}%`)));

    const matchingTeams = await this.db.select().from(teams)
      .where(or(ilike(teams.name, `%${q}%`), ilike(teams.slug, `%${q}%`)));

    const matchingPlayers = await this.db.select().from(players)
      .where(or(ilike(players.displayName, `%${q}%`), ilike(players.username, `%${q}%`)));

    const allPosts = await this.db.select().from(posts);
    const matchingPosts = allPosts.filter((p: any) => p.content.toLowerCase().includes(q));
    const enrichedPosts = await Promise.all(matchingPosts.map((p: any) => this.enrichPost(p, currentUserId)));

    return { users: matchingUsers, posts: enrichedPosts, teams: matchingTeams, players: matchingPlayers };
  }

  // ---- NOTIFICATIONS ----

  async getNotifications(userId: string): Promise<(Notification & { sender: User; post?: Post })[]> {
    const notifs = await this.db.select().from(notifications)
      .where(eq(notifications.recipientId, userId))
      .orderBy(desc(notifications.createdAt));

    const enriched: (Notification & { sender: User; post?: Post })[] = [];
    for (const n of notifs) {
      const sender = await this.getUser(n.senderId);
      if (!sender) continue;
      let post: Post | undefined;
      if (n.postId) {
        const postRows = await this.db.select().from(posts).where(eq(posts.id, n.postId)).limit(1);
        post = postRows[0];
      }
      enriched.push({ ...n, sender, post });
    }
    return enriched;
  }

  // ---- BOOKMARKS ----

  async getBookmarks(userId: string): Promise<PostWithAuthor[]> {
    const bookmarkRows = await this.db.select().from(bookmarks).where(eq(bookmarks.userId, userId));
    const postIds = bookmarkRows.map((b: any) => b.postId);
    if (postIds.length === 0) return [];

    const postRows = await this.db.select().from(posts).where(inArray(posts.id, postIds));
    return Promise.all(postRows.map((p: any) => this.enrichPost(p, userId)));
  }

  // ---- MESSAGES ----

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    const allMessages = await this.db.select().from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
        )
      )
      .orderBy(messages.createdAt);
    return allMessages;
  }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const result = await this.db.insert(messages).values({ senderId, receiverId, content, read: false }).returning();
    return result[0];
  }
}

// ========================
// MEM STORAGE (kept as fallback for local dev without DB)
// ========================

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private posts: Map<string, Post> = new Map();
  private comments: Map<string, Comment> = new Map();
  private likesSet: Set<string> = new Set();
  private repostsSet: Set<string> = new Set();
  private bookmarksSet: Set<string> = new Set();
  private followsSet: Set<string> = new Set();
  private notificationsMap: Map<string, Notification> = new Map();
  private teamsMap: Map<string, Team> = new Map();
  private playersMap: Map<string, Player> = new Map();
  private messagesMap: Map<string, Message> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const teamLimitless: Team = {
      id: "team-1",
      slug: "limitless-esports",
      name: "Limitless Esports",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=limitless",
      cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: "Professional Free Fire Esports Organization. 24 Championships.",
      game: "Free Fire",
      region: "South Asia / Global",
      followersCount: 12400,
      championships: 24,
      createdAt: new Date().toISOString(),
    };
    this.teamsMap.set(teamLimitless.id, teamLimitless);

    const userGuest: User = {
      id: "user-guest",
      username: "guest_player",
      email: null,
      googleId: null,
      password: "",
      displayName: "Challenger Gamer",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=challenger",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      bio: "Competitive Free Fire mobile grinder.",
      role: "User",
      verificationType: null,
      teamId: null,
      points: 1240,
      streakDays: 14,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Challenger Level 12",
      createdAt: "2026-01-01T00:00:00Z",
    };

    const userLimitlessOrg: User = {
      id: "user-org",
      username: "limitlessesports",
      email: null,
      googleId: null,
      password: "",
      displayName: "Limitless Esports",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=limitless",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: "Official Limitless Esports Social Handle. 🏆 24 Championship Titles.",
      role: "Organization",
      verificationType: "org",
      teamId: teamLimitless.id,
      points: 15400,
      streakDays: 45,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Elite Org",
      createdAt: "2024-01-01T00:00:00Z",
    };

    const userViper: User = {
      id: "user-viper",
      username: "viper",
      email: null,
      googleId: null,
      password: "",
      displayName: "Alex 'Viper' Chen",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      bio: "IGL for @limitlessesports | Free Fire World Series Finalist 🎯",
      role: "Player",
      verificationType: "player",
      teamId: teamLimitless.id,
      points: 3450,
      streakDays: 22,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Pro Legend",
      createdAt: "2024-02-15T00:00:00Z",
    };

    [userGuest, userLimitlessOrg, userViper].forEach(u => this.users.set(u.id, u));

    const playerViper: Player = {
      id: "p-viper",
      username: "viper",
      displayName: "Alex 'Viper' Chen",
      role: "In-Game Leader (IGL)",
      teamId: teamLimitless.id,
      teamName: "Limitless Esports",
      mains: "Sniper / Support",
      kd: "4.2",
      winRate: "32%",
      matches: 184,
      kills: 1482,
      avatar: userViper.avatar!,
      cover: userViper.coverImage!,
    };
    this.playersMap.set(playerViper.username, playerViper);

    const post1: Post = {
      id: "post-1",
      authorId: userLimitlessOrg.id,
      content: "WE DID IT! 🏆🔥 Dominated today's Limitless Free Fire Skirmish #45. #FreeFire #Esports #Limitless",
      mediaUrls: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"],
      matchResult: { tournamentName: "Limitless Community Skirmish #45", rank: "1st Place 🏆", kills: 47, booyahs: 4, prize: "$1,500" },
      poll: null,
      hashtags: ["FreeFire", "Esports", "Limitless"],
      mentions: [],
      isOfficial: true,
      tournamentId: null,
      likesCount: 142,
      commentsCount: 31,
      repostsCount: 18,
      bookmarksCount: 12,
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    };
    this.posts.set(post1.id, post1);
  }

  async getUser(id: string): Promise<User | undefined> { return this.users.get(id); }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username.toLowerCase() === username.toLowerCase());
  }
  async getUserByEmail(_email: string): Promise<User | undefined> { return undefined; }

  async createUser(insertUser: InsertUser & Partial<User>): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email || null,
      googleId: insertUser.googleId || null,
      password: insertUser.password || "",
      displayName: insertUser.displayName || insertUser.username,
      avatar: insertUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${insertUser.username}`,
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: insertUser.bio || "Esports competitor on Limitless Social.",
      role: insertUser.role || "User",
      verificationType: insertUser.verificationType || null,
      teamId: insertUser.teamId || null,
      points: 50,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Rookie Competitor",
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async upsertGoogleUser(profile: { googleId: string; email?: string; displayName: string; avatar?: string }): Promise<User> {
    if (profile.email) {
      const existing = await this.getUserByEmail(profile.email);
      if (existing) return existing;
    }

    const baseUsername = profile.displayName.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 20);
    return this.createUser({
      username: `${baseUsername}_${randomUUID().slice(0, 6)}`,
      password: "",
      displayName: profile.displayName,
      avatar: profile.avatar,
    });
  }

  async updateUserPoints(userId: string, pointsDelta: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    const newPoints = user.points + pointsDelta;
    const updated = { ...user, points: newPoints };
    this.users.set(userId, updated);
    return updated;
  }

  async createPost(authorId: string, postData: { content: string; mediaUrls?: string[]; matchResult?: MatchResultData; poll?: PollData; tournamentId?: string }): Promise<PostWithAuthor> {
    const author = this.users.get(authorId);
    if (!author) throw new Error("Author not found");
    const hashtagMatches = postData.content.match(/#[\w]+/g) || [];
    const hashtags = hashtagMatches.map(h => h.substring(1));
    const mentionMatches = postData.content.match(/@[\w]+/g) || [];
    const mentions = mentionMatches.map(m => m.substring(1));
    const post: Post = {
      id: randomUUID(), authorId, content: postData.content,
      mediaUrls: postData.mediaUrls || [], matchResult: postData.matchResult || null,
      poll: postData.poll || null, hashtags, mentions,
      isOfficial: author.role === "Organization" || author.role === "Admin",
      tournamentId: postData.tournamentId || null,
      likesCount: 0, commentsCount: 0, repostsCount: 0, bookmarksCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.posts.set(post.id, post);
    return { ...post, matchResult: post.matchResult as MatchResultData | null, poll: post.poll as PollData | null, author, isLiked: false, isReposted: false, isBookmarked: false };
  }

  async getFeedPosts(currentUserId?: string, tab = "for-you"): Promise<PostWithAuthor[]> {
    let allPosts = Array.from(this.posts.values()).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return Promise.all(allPosts.map(p => this.enrichPost(p, currentUserId)));
  }

  async getPostById(postId: string, currentUserId?: string): Promise<PostWithAuthor | undefined> {
    const post = this.posts.get(postId);
    if (!post) return undefined;
    return this.enrichPost(post, currentUserId);
  }

  async getUserPosts(username: string, currentUserId?: string): Promise<PostWithAuthor[]> {
    const user = await this.getUserByUsername(username);
    if (!user) return [];
    const userPosts = Array.from(this.posts.values()).filter(p => p.authorId === user.id).sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return Promise.all(userPosts.map(p => this.enrichPost(p, currentUserId)));
  }

  async deletePost(postId: string, userId: string): Promise<boolean> {
    const post = this.posts.get(postId);
    if (!post || post.authorId !== userId) return false;
    this.posts.delete(postId);
    return true;
  }

  private async enrichPost(post: Post, currentUserId?: string): Promise<PostWithAuthor> {
    const author = this.users.get(post.authorId)!;
    return {
      ...post, matchResult: post.matchResult as MatchResultData | null, poll: post.poll as PollData | null,
      author,
      isLiked: currentUserId ? this.likesSet.has(`${currentUserId}:${post.id}`) : false,
      isReposted: currentUserId ? this.repostsSet.has(`${currentUserId}:${post.id}`) : false,
      isBookmarked: currentUserId ? this.bookmarksSet.has(`${currentUserId}:${post.id}`) : false,
    };
  }

  async toggleLike(userId: string, postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const post = this.posts.get(postId);
    if (!post) throw new Error("Post not found");
    const key = `${userId}:${postId}`;
    let isLiked = false;
    if (this.likesSet.has(key)) { this.likesSet.delete(key); post.likesCount = Math.max(0, (post.likesCount || 1) - 1); }
    else { this.likesSet.add(key); post.likesCount = (post.likesCount || 0) + 1; isLiked = true; }
    this.posts.set(postId, post);
    return { isLiked, likesCount: post.likesCount! };
  }

  async toggleRepost(userId: string, postId: string): Promise<{ isReposted: boolean; repostsCount: number }> {
    const post = this.posts.get(postId);
    if (!post) throw new Error("Post not found");
    const key = `${userId}:${postId}`;
    let isReposted = false;
    if (this.repostsSet.has(key)) { this.repostsSet.delete(key); post.repostsCount = Math.max(0, (post.repostsCount || 1) - 1); }
    else { this.repostsSet.add(key); post.repostsCount = (post.repostsCount || 0) + 1; isReposted = true; }
    this.posts.set(postId, post);
    return { isReposted, repostsCount: post.repostsCount! };
  }

  async toggleBookmark(userId: string, postId: string): Promise<{ isBookmarked: boolean }> {
    const key = `${userId}:${postId}`;
    let isBookmarked = false;
    if (this.bookmarksSet.has(key)) { this.bookmarksSet.delete(key); }
    else { this.bookmarksSet.add(key); isBookmarked = true; }
    return { isBookmarked };
  }

  async addComment(authorId: string, postId: string, content: string): Promise<Comment> {
    const post = this.posts.get(postId);
    if (!post) throw new Error("Post not found");
    const comment: Comment = { id: randomUUID(), postId, authorId, content, createdAt: new Date().toISOString() };
    this.comments.set(comment.id, comment);
    post.commentsCount = (post.commentsCount || 0) + 1;
    this.posts.set(postId, post);
    return comment;
  }

  async getPostComments(postId: string): Promise<(Comment & { author: User })[]> {
    return Array.from(this.comments.values()).filter(c => c.postId === postId).map(c => ({ ...c, author: this.users.get(c.authorId)! }));
  }

  async toggleFollow(followerId: string, followingId: string): Promise<{ isFollowing: boolean }> {
    const key = `${followerId}:${followingId}`;
    let isFollowing = false;
    if (this.followsSet.has(key)) { this.followsSet.delete(key); }
    else { this.followsSet.add(key); isFollowing = true; }
    return { isFollowing };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.followsSet.has(`${followerId}:${followingId}`);
  }

  async getSuggestedUsers(currentUserId?: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.id !== currentUserId).slice(0, 5);
  }

  async getTeams(): Promise<Team[]> { return Array.from(this.teamsMap.values()); }
  async getTeamBySlug(slug: string): Promise<Team | undefined> { return Array.from(this.teamsMap.values()).find(t => t.slug === slug || t.id === slug); }
  async getPlayers(): Promise<Player[]> { return Array.from(this.playersMap.values()); }
  async getPlayerByUsername(username: string): Promise<Player | undefined> { return this.playersMap.get(username); }

  async getTrendingHashtags(): Promise<{ tag: string; count: number }[]> {
    const counts: Record<string, number> = {};
    Array.from(this.posts.values()).forEach(p => p.hashtags?.forEach(tag => { counts[tag] = (counts[tag] || 0) + 1; }));
    return Object.entries(counts).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
  }

  async getPostsByHashtag(tag: string, currentUserId?: string): Promise<PostWithAuthor[]> {
    const cleanTag = tag.replace(/^#/, "").toLowerCase();
    const matching = Array.from(this.posts.values()).filter(p => p.hashtags?.some(h => h.toLowerCase() === cleanTag));
    return Promise.all(matching.map(p => this.enrichPost(p, currentUserId)));
  }

  async search(query: string, currentUserId?: string): Promise<{ users: User[]; posts: PostWithAuthor[]; teams: Team[]; players: Player[] }> {
    const q = query.toLowerCase().trim();
    if (!q) return { users: [], posts: [], teams: [], players: [] };
    const matchingUsers = Array.from(this.users.values()).filter(u => u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q));
    const matchingTeams = Array.from(this.teamsMap.values()).filter(t => t.name.toLowerCase().includes(q));
    const matchingPlayers = Array.from(this.playersMap.values()).filter(p => p.displayName.toLowerCase().includes(q));
    const matchingPosts = Array.from(this.posts.values()).filter(p => p.content.toLowerCase().includes(q));
    const enrichedPosts = await Promise.all(matchingPosts.map(p => this.enrichPost(p, currentUserId)));
    return { users: matchingUsers, posts: enrichedPosts, teams: matchingTeams, players: matchingPlayers };
  }

  async getNotifications(userId: string): Promise<(Notification & { sender: User; post?: Post })[]> {
    return Array.from(this.notificationsMap.values()).filter(n => n.recipientId === userId).map(n => ({ ...n, sender: this.users.get(n.senderId)!, post: n.postId ? this.posts.get(n.postId) : undefined }));
  }

  async getBookmarks(userId: string): Promise<PostWithAuthor[]> {
    const bookmarkedIds = Array.from(this.bookmarksSet).filter(b => b.startsWith(`${userId}:`)).map(b => b.split(":")[1]);
    const bookmarkedPosts = bookmarkedIds.map(id => this.posts.get(id)).filter((p): p is Post => p !== undefined);
    return Promise.all(bookmarkedPosts.map(p => this.enrichPost(p, userId)));
  }

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    return Array.from(this.messagesMap.values()).filter(m => (m.senderId === userId && m.receiverId === otherUserId) || (m.senderId === otherUserId && m.receiverId === userId));
  }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const msg: Message = { id: randomUUID(), senderId, receiverId, content, read: false, createdAt: new Date().toISOString() };
    this.messagesMap.set(msg.id, msg);
    return msg;
  }
}

// ========================
// FACTORY: pick storage based on env
// ========================

function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    try {
      // Dynamic import so that missing env doesn't crash MemStorage path
      const { db } = require("./db");
      console.log("[storage] Using DrizzleStorage (PostgreSQL)");
      return new DrizzleStorage(db);
    } catch (e) {
      console.error("[storage] Failed to initialize DrizzleStorage, falling back to MemStorage:", e);
      return new MemStorage();
    }
  }
  console.log("[storage] No DATABASE_URL set, using MemStorage (data will not persist)");
  return new MemStorage();
}

export const storage = createStorage();
