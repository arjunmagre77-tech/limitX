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
  type PollData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & Partial<User>): Promise<User>;
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

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private posts: Map<string, Post> = new Map();
  private comments: Map<string, Comment> = new Map();
  private likes: Set<string> = new Set(); // userId:postId
  private reposts: Set<string> = new Set(); // userId:postId
  private bookmarks: Set<string> = new Set(); // userId:postId
  private follows: Set<string> = new Set(); // followerId:followingId
  private notifications: Map<string, Notification> = new Map();
  private teams: Map<string, Team> = new Map();
  private players: Map<string, Player> = new Map();
  private messages: Map<string, Message> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    // 1. Teams
    const teamLimitless: Team = {
      id: "team-1",
      slug: "limitless-esports",
      name: "Limitless Esports",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=limitless",
      cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: "Professional Free Fire Esports Organization. 24 Championships. Dominating the lobby since 2024.",
      game: "Free Fire",
      region: "South Asia / Global",
      followersCount: 12400,
      championships: 24,
      createdAt: new Date().toISOString(),
    };
    this.teams.set(teamLimitless.id, teamLimitless);

    // 2. Users & Roster
    const userLimitlessOrg: User = {
      id: "user-org",
      username: "limitlessesports",
      password: "password123",
      displayName: "Limitless Esports",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=limitless",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: "Official Limitless Esports Social Handle. 🏆 24 Championship Titles. Forging the future of mobile esports.",
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
      password: "password123",
      displayName: "Alex 'Viper' Chen",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      bio: "IGL for @limitlessesports | Free Fire World Series Finalist 🎯 | Snipe first, ask questions never.",
      role: "Player",
      verificationType: "player",
      teamId: teamLimitless.id,
      points: 3450,
      streakDays: 22,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Pro Legend",
      createdAt: "2024-02-15T00:00:00Z",
    };

    const userNova: User = {
      id: "user-nova",
      username: "nova",
      password: "password123",
      displayName: "Sarah 'Nova' Jones",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      coverImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
      bio: "Lead Fragger @limitlessesports ⚡ | 5.8 K/D Ratio | Always pushing zone line.",
      role: "Player",
      verificationType: "player",
      teamId: teamLimitless.id,
      points: 2980,
      streakDays: 14,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Elite Fragger",
      createdAt: "2024-03-01T00:00:00Z",
    };

    const userPulse: User = {
      id: "user-pulse",
      username: "pulse",
      password: "password123",
      displayName: "Marcus 'Pulse' Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      bio: "Support / Utility @limitlessesports 🛡️ | Clutch revive specialist | 35% Win Rate.",
      role: "Player",
      verificationType: "player",
      teamId: teamLimitless.id,
      points: 1890,
      streakDays: 9,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Pro Competitor",
      createdAt: "2024-03-10T00:00:00Z",
    };

    const userGhostCreator: User = {
      id: "user-ghost",
      username: "ghost_creator",
      password: "password123",
      displayName: "Ghost Gaming TV",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: "Official Limitless Content Creator 🎥 | Daily Free Fire Streamer & Meta Analyst.",
      role: "Creator",
      verificationType: "creator",
      teamId: teamLimitless.id,
      points: 4120,
      streakDays: 31,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Legend Streamer",
      createdAt: "2024-01-20T00:00:00Z",
    };

    const userGuest: User = {
      id: "user-guest",
      username: "guest_player",
      password: "password123",
      displayName: "Challenger Gamer",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=challenger",
      coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
      bio: "Competitive Free Fire mobile grinder. Grinding tournament lobbies and building squad.",
      role: "User",
      verificationType: null,
      teamId: null,
      points: 1240,
      streakDays: 14,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Challenger Level 12",
      createdAt: "2026-01-01T00:00:00Z",
    };

    [userLimitlessOrg, userViper, userNova, userPulse, userGhostCreator, userGuest].forEach(u => this.users.set(u.id, u));

    // 3. Players
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

    const playerNova: Player = {
      id: "p-nova",
      username: "nova",
      displayName: "Sarah 'Nova' Jones",
      role: "Fragger",
      teamId: teamLimitless.id,
      teamName: "Limitless Esports",
      mains: "Assault / Rush",
      kd: "5.8",
      winRate: "30%",
      matches: 210,
      kills: 1940,
      avatar: userNova.avatar!,
      cover: userNova.coverImage!,
    };

    const playerPulse: Player = {
      id: "p-pulse",
      username: "pulse",
      displayName: "Marcus 'Pulse' Smith",
      role: "Support",
      teamId: teamLimitless.id,
      teamName: "Limitless Esports",
      mains: "Medic / Utility",
      kd: "2.1",
      winRate: "35%",
      matches: 195,
      kills: 890,
      avatar: userPulse.avatar!,
      cover: userPulse.coverImage!,
    };

    [playerViper, playerNova, playerPulse].forEach(p => this.players.set(p.username, p));

    // 4. Initial Seed Posts
    const post1: Post = {
      id: "post-1",
      authorId: userLimitlessOrg.id,
      content: "WE DID IT! 🏆🔥 Dominated today's Limitless Free Fire Skirmish #45 with 4 Booyahs in 6 matches. Shoutout to @viper and @nova for absolute clutch squad plays! #FreeFire #Esports #Limitless",
      mediaUrls: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"],
      matchResult: {
        tournamentName: "Limitless Community Skirmish #45",
        rank: "1st Place 🏆",
        kills: 47,
        booyahs: 4,
        prize: "$1,500"
      },
      poll: null,
      hashtags: ["FreeFire", "Esports", "Limitless"],
      mentions: ["viper", "nova"],
      isOfficial: true,
      tournamentId: null,
      likesCount: 142,
      commentsCount: 31,
      repostsCount: 18,
      bookmarksCount: 12,
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    };

    const post2: Post = {
      id: "post-2",
      authorId: userViper.id,
      content: "Zone rotation in Bermuda map OB41 patch requires early high ground control near Peak. Here is our setup routine for competitive scrims. What's your squad's drop location strategy? 🎯🔥 #FreeFireMeta #Esports",
      mediaUrls: null,
      matchResult: null,
      poll: {
        question: "Which drop zone gives best rotations in Bermuda?",
        options: [
          { id: 0, text: "Peak / Bimasakti Strip", votes: 84 },
          { id: 1, text: "Clock Tower", votes: 46 },
          { id: 2, text: "Factory & Hangar", votes: 29 },
          { id: 3, text: "Mars Electric Outer", votes: 12 }
        ],
        totalVotes: 171
      },
      hashtags: ["FreeFireMeta", "Esports"],
      mentions: [],
      isOfficial: false,
      tournamentId: null,
      likesCount: 98,
      commentsCount: 19,
      repostsCount: 9,
      bookmarksCount: 8,
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    };

    const post3: Post = {
      id: "post-3",
      authorId: userNova.id,
      content: "5.8 K/D ratio hit today in Pro Qualifiers! ⚡ Quadra kill clutch in Kalahari final zone. Registration for Limitless FF Clash #48 is officially live now, don't miss your slots! #FFWS #Limitless",
      mediaUrls: ["https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80"],
      matchResult: null,
      poll: null,
      hashtags: ["FFWS", "Limitless"],
      mentions: [],
      isOfficial: false,
      tournamentId: null,
      likesCount: 215,
      commentsCount: 44,
      repostsCount: 28,
      bookmarksCount: 19,
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    };

    const post4: Post = {
      id: "post-4",
      authorId: userGhostCreator.id,
      content: "Live streaming the official Limitless Pro Scrims right now! Drop in to watch top fraggers break down weapon recoil & grenade bounces. 🎮📹 Link in bio! #FreeFireStream",
      mediaUrls: null,
      matchResult: null,
      poll: null,
      hashtags: ["FreeFireStream"],
      mentions: [],
      isOfficial: false,
      tournamentId: null,
      likesCount: 76,
      commentsCount: 11,
      repostsCount: 5,
      bookmarksCount: 4,
      createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    };

    [post1, post2, post3, post4].forEach(p => this.posts.set(p.id, p));

    // Seed Likes & Follows
    this.likes.add(`${userGuest.id}:${post1.id}`);
    this.likes.add(`${userGuest.id}:${post3.id}`);
    this.bookmarks.add(`${userGuest.id}:${post1.id}`);
    this.follows.add(`${userGuest.id}:${userLimitlessOrg.id}`);
    this.follows.add(`${userGuest.id}:${userViper.id}`);

    // Seed Initial Comments
    const comment1: Comment = {
      id: "comment-1",
      postId: post1.id,
      authorId: userViper.id,
      content: "GGs team! That zone 5 rush was unstoppable. 🎯",
      createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    };
    const comment2: Comment = {
      id: "comment-2",
      postId: post1.id,
      authorId: userGuest.id,
      content: "Insane plays! Can't wait for next week's tournament.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    };
    this.comments.set(comment1.id, comment1);
    this.comments.set(comment2.id, comment2);

    // Seed Initial Notifications for Guest
    const notif1: Notification = {
      id: "notif-1",
      recipientId: userGuest.id,
      senderId: userViper.id,
      type: "follow",
      postId: null,
      read: false,
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    };
    const notif2: Notification = {
      id: "notif-2",
      recipientId: userGuest.id,
      senderId: userLimitlessOrg.id,
      type: "tournament",
      postId: post1.id,
      read: false,
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    };
    this.notifications.set(notif1.id, notif1);
    this.notifications.set(notif2.id, notif2);
  }

  // User Methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      u => u.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser & Partial<User>): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      displayName: insertUser.displayName || insertUser.username,
      avatar: insertUser.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${insertUser.username}`,
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
      bio: insertUser.bio || "Esports competitor on Limitless Social.",
      role: insertUser.role || "User",
      verificationType: insertUser.verificationType || null,
      teamId: insertUser.teamId || null,
      points: 50, // Initial bonus
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      levelTitle: "Rookie Competitor",
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: string, pointsDelta: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    const newPoints = user.points + pointsDelta;
    let levelTitle = user.levelTitle;
    if (newPoints >= 5000) levelTitle = "Legend Competitor";
    else if (newPoints >= 2500) levelTitle = "Pro Elite";
    else if (newPoints >= 1000) levelTitle = "Challenger Level 12";
    else if (newPoints >= 300) levelTitle = "Contender";

    const updatedUser: User = {
      ...user,
      points: newPoints,
      levelTitle,
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Posts Methods
  async createPost(authorId: string, postData: {
    content: string;
    mediaUrls?: string[];
    matchResult?: MatchResultData;
    poll?: PollData;
    tournamentId?: string;
  }): Promise<PostWithAuthor> {
    const author = await this.getUser(authorId);
    if (!author) throw new Error("Author not found");

    // Extract hashtags & mentions
    const hashtagMatches = postData.content.match(/#[\w]+/g) || [];
    const hashtags = hashtagMatches.map(h => h.substring(1));
    const mentionMatches = postData.content.match(/@[\w]+/g) || [];
    const mentions = mentionMatches.map(m => m.substring(1));

    const post: Post = {
      id: randomUUID(),
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
      createdAt: new Date().toISOString(),
    };

    this.posts.set(post.id, post);
    await this.updateUserPoints(authorId, 5); // +5 LP for post creation

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
    let allPosts = Array.from(this.posts.values());

    if (tab === "following" && currentUserId) {
      const followingIds = new Set(
        Array.from(this.follows.values())
          .filter(f => f.startsWith(`${currentUserId}:`))
          .map(f => f.split(":")[1])
      );
      followingIds.add(currentUserId);
      allPosts = allPosts.filter(p => followingIds.has(p.authorId));
    } else if (tab === "trending") {
      allPosts = allPosts.sort((a, b) => (b.likesCount! + b.commentsCount! * 2) - (a.likesCount! + a.commentsCount! * 2));
    } else {
      allPosts = allPosts.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }

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
    const userPosts = Array.from(this.posts.values())
      .filter(p => p.authorId === user.id)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    return Promise.all(userPosts.map(p => this.enrichPost(p, currentUserId)));
  }

  async deletePost(postId: string, userId: string): Promise<boolean> {
    const post = this.posts.get(postId);
    if (!post || post.authorId !== userId) return false;
    this.posts.delete(postId);
    return true;
  }

  private async enrichPost(post: Post, currentUserId?: string): Promise<PostWithAuthor> {
    const author = (await this.getUser(post.authorId))!;
    const authorPlayer = Array.from(this.players.values()).find(p => p.username === author.username);
    const authorTeam = author.teamId ? this.teams.get(author.teamId) : undefined;

    return {
      ...post,
      matchResult: post.matchResult as MatchResultData | null,
      poll: post.poll as PollData | null,
      author,
      authorPlayer,
      authorTeam,
      isLiked: currentUserId ? this.likes.has(`${currentUserId}:${post.id}`) : false,
      isReposted: currentUserId ? this.reposts.has(`${currentUserId}:${post.id}`) : false,
      isBookmarked: currentUserId ? this.bookmarks.has(`${currentUserId}:${post.id}`) : false,
    };
  }

  // Engagements
  async toggleLike(userId: string, postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const post = this.posts.get(postId);
    if (!post) throw new Error("Post not found");

    const key = `${userId}:${postId}`;
    let isLiked = false;
    if (this.likes.has(key)) {
      this.likes.delete(key);
      post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
    } else {
      this.likes.add(key);
      post.likesCount = (post.likesCount || 0) + 1;
      isLiked = true;

      // Notification
      if (post.authorId !== userId) {
        const notifId = randomUUID();
        this.notifications.set(notifId, {
          id: notifId,
          recipientId: post.authorId,
          senderId: userId,
          type: "like",
          postId,
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.posts.set(postId, post);
    return { isLiked, likesCount: post.likesCount };
  }

  async toggleRepost(userId: string, postId: string): Promise<{ isReposted: boolean; repostsCount: number }> {
    const post = this.posts.get(postId);
    if (!post) throw new Error("Post not found");

    const key = `${userId}:${postId}`;
    let isReposted = false;
    if (this.reposts.has(key)) {
      this.reposts.delete(key);
      post.repostsCount = Math.max(0, (post.repostsCount || 1) - 1);
    } else {
      this.reposts.add(key);
      post.repostsCount = (post.repostsCount || 0) + 1;
      isReposted = true;
    }

    this.posts.set(postId, post);
    return { isReposted, repostsCount: post.repostsCount };
  }

  async toggleBookmark(userId: string, postId: string): Promise<{ isBookmarked: boolean }> {
    const key = `${userId}:${postId}`;
    let isBookmarked = false;
    if (this.bookmarks.has(key)) {
      this.bookmarks.delete(key);
    } else {
      this.bookmarks.add(key);
      isBookmarked = true;
    }
    return { isBookmarked };
  }

  // Comments
  async addComment(authorId: string, postId: string, content: string): Promise<Comment> {
    const post = this.posts.get(postId);
    if (!post) throw new Error("Post not found");

    const comment: Comment = {
      id: randomUUID(),
      postId,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };

    this.comments.set(comment.id, comment);
    post.commentsCount = (post.commentsCount || 0) + 1;
    this.posts.set(postId, post);

    await this.updateUserPoints(authorId, 2); // +2 LP for comment

    // Notification
    if (post.authorId !== authorId) {
      const notifId = randomUUID();
      this.notifications.set(notifId, {
        id: notifId,
        recipientId: post.authorId,
        senderId: authorId,
        type: "comment",
        postId,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return comment;
  }

  async getPostComments(postId: string): Promise<(Comment & { author: User })[]> {
    const commentsList = Array.from(this.comments.values())
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

    return commentsList.map(c => ({
      ...c,
      author: this.users.get(c.authorId)!,
    }));
  }

  // Social Graph
  async toggleFollow(followerId: string, followingId: string): Promise<{ isFollowing: boolean }> {
    const key = `${followerId}:${followingId}`;
    let isFollowing = false;

    if (this.follows.has(key)) {
      this.follows.delete(key);
    } else {
      this.follows.add(key);
      isFollowing = true;

      // Notification
      const notifId = randomUUID();
      this.notifications.set(notifId, {
        id: notifId,
        recipientId: followingId,
        senderId: followerId,
        type: "follow",
        postId: null,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return { isFollowing };
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.follows.has(`${followerId}:${followingId}`);
  }

  async getSuggestedUsers(currentUserId?: string): Promise<User[]> {
    return Array.from(this.users.values())
      .filter(u => u.id !== currentUserId)
      .slice(0, 5);
  }

  // Teams & Players
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeamBySlug(slug: string): Promise<Team | undefined> {
    return Array.from(this.teams.values()).find(t => t.slug === slug);
  }

  async getPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayerByUsername(username: string): Promise<Player | undefined> {
    return this.players.get(username);
  }

  // Discovery & Search
  async getTrendingHashtags(): Promise<{ tag: string; count: number }[]> {
    const counts: Record<string, number> = {};
    Array.from(this.posts.values()).forEach(p => {
      p.hashtags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getPostsByHashtag(tag: string, currentUserId?: string): Promise<PostWithAuthor[]> {
    const cleanTag = tag.replace(/^#/, "").toLowerCase();
    const matchingPosts = Array.from(this.posts.values()).filter(p =>
      p.hashtags?.some(h => h.toLowerCase() === cleanTag)
    );
    return Promise.all(matchingPosts.map(p => this.enrichPost(p, currentUserId)));
  }

  async search(query: string, currentUserId?: string): Promise<{
    users: User[];
    posts: PostWithAuthor[];
    teams: Team[];
    players: Player[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) return { users: [], posts: [], teams: [], players: [] };

    const matchingUsers = Array.from(this.users.values()).filter(u =>
      u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q)
    );

    const matchingTeams = Array.from(this.teams.values()).filter(t =>
      t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
    );

    const matchingPlayers = Array.from(this.players.values()).filter(p =>
      p.displayName.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
    );

    const matchingPosts = Array.from(this.posts.values()).filter(p =>
      p.content.toLowerCase().includes(q)
    );

    const enrichedPosts = await Promise.all(matchingPosts.map(p => this.enrichPost(p, currentUserId)));

    return {
      users: matchingUsers,
      posts: enrichedPosts,
      teams: matchingTeams,
      players: matchingPlayers,
    };
  }

  // Notifications
  async getNotifications(userId: string): Promise<(Notification & { sender: User; post?: Post })[]> {
    const notifs = Array.from(this.notifications.values())
      .filter(n => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    return notifs.map(n => ({
      ...n,
      sender: this.users.get(n.senderId)!,
      post: n.postId ? this.posts.get(n.postId) : undefined,
    }));
  }

  // Bookmarks
  async getBookmarks(userId: string): Promise<PostWithAuthor[]> {
    const bookmarkedPostIds = Array.from(this.bookmarks)
      .filter(b => b.startsWith(`${userId}:`))
      .map(b => b.split(":")[1]);

    const bookmarkedPosts = bookmarkedPostIds
      .map(id => this.posts.get(id))
      .filter((p): p is Post => p !== undefined);

    return Promise.all(bookmarkedPosts.map(p => this.enrichPost(p, userId)));
  }

  // Messages
  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => (m.senderId === userId && m.receiverId === otherUserId) || (m.senderId === otherUserId && m.receiverId === userId))
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const msg: Message = {
      id: randomUUID(),
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.messages.set(msg.id, msg);
    return msg;
  }
}

export const storage = new MemStorage();

