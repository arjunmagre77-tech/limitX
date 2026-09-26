import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertPostSchema, insertUserSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Helper to extract authenticated user ID from Passport session or header fallback
  const getCurrentUserId = (req: any): string | undefined => {
    if (req.user && req.user.id) {
      return req.user.id;
    }
    if (req.session && req.session.userId) {
      return req.session.userId;
    }
    // Fallback for dev / mock testing if explicit header sent
    if (req.headers["x-user-id"]) {
      return req.headers["x-user-id"] as string;
    }
    return undefined;
  };

  // Google OAuth Routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=auth_failed" }),
    (req, res) => {
      res.redirect("/feed");
    }
  );

  // Auth Routes
  app.get("/api/auth/me", async (req, res) => {
    const userId = getCurrentUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(user);
  });

  app.post("/api/auth/login", async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Support bcrypt hashedPassword comparison, fallback to direct compare for plain text seed users
    let isValid = false;
    if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
      isValid = await bcrypt.compare(password, user.password);
    } else {
      isValid = user.password === password;
    }

    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      if (req.session) {
        (req.session as any).userId = user.id;
      }
      return res.json(user);
    });
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(parsed.username);
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }

      if (!parsed.password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const hashedPassword = await bcrypt.hash(parsed.password, 10);
      const user = await storage.createUser({
        ...parsed,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        if (req.session) {
          (req.session as any).userId = user.id;
        }
        return res.status(201).json(user);
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid registration data" });
    }
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      if (req.session) {
        req.session.destroy(() => {
          res.json({ message: "Logged out successfully" });
        });
      } else {
        res.json({ message: "Logged out successfully" });
      }
    });
  });

  // Feed & Posts Routes
  app.get("/api/feed", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    const tab = (req.query.tab as string) || "for-you";
    const posts = await storage.getFeedPosts(currentUserId, tab);
    res.json(posts);
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const currentUserId = getCurrentUserId(req);
      if (!currentUserId) {
        return res.status(401).json({ message: "Authentication required to create a post" });
      }

      const parsed = insertPostSchema.parse(req.body);
      const pollData = parsed.poll ? {
        question: parsed.poll.question,
        options: parsed.poll.options.map((opt, idx) => ({ id: idx, text: opt, votes: 0 })),
        totalVotes: 0,
      } : undefined;

      const post = await storage.createPost(currentUserId, {
        content: parsed.content,
        mediaUrls: parsed.mediaUrls,
        matchResult: parsed.matchResult,
        poll: pollData,
        tournamentId: parsed.tournamentId,
      });
      res.status(201).json(post);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid post data" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    const post = await storage.getPostById(req.params.id, currentUserId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  app.delete("/api/posts/:id", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const success = await storage.deletePost(req.params.id, currentUserId);
    if (!success) {
      return res.status(403).json({ message: "Unable to delete post" });
    }
    res.json({ success: true });
  });

  // Engagements
  app.post("/api/posts/:id/like", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const result = await storage.toggleLike(currentUserId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  });

  app.post("/api/posts/:id/repost", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const result = await storage.toggleRepost(currentUserId, req.params.id);
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  });

  app.post("/api/posts/:id/bookmark", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const result = await storage.toggleBookmark(currentUserId, req.params.id);
    res.json(result);
  });

  // Comments
  app.get("/api/posts/:id/comments", async (req, res) => {
    const comments = await storage.getPostComments(req.params.id);
    res.json(comments);
  });

  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      const currentUserId = getCurrentUserId(req);
      if (!currentUserId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const parsed = insertCommentSchema.parse(req.body);
      const comment = await storage.addComment(currentUserId, req.params.id, parsed.content);
      res.status(201).json(comment);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Failed to add comment" });
    }
  });

  // Social Graph
  app.get("/api/users/:username", async (req, res) => {
    const user = await storage.getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentUserId = getCurrentUserId(req);
    const isFollowing = currentUserId ? await storage.isFollowing(currentUserId, user.id) : false;
    res.json({ ...user, isFollowing });
  });

  app.get("/api/users/:username/posts", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    const posts = await storage.getUserPosts(req.params.username, currentUserId);
    res.json(posts);
  });

  app.post("/api/users/:id/follow", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const result = await storage.toggleFollow(currentUserId, req.params.id);
    res.json(result);
  });

  // Teams & Players
  app.get("/api/teams", async (_req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });

  app.get("/api/teams/:slug", async (req, res) => {
    const team = await storage.getTeamBySlug(req.params.slug);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  });

  app.get("/api/players", async (_req, res) => {
    const players = await storage.getPlayers();
    res.json(players);
  });

  app.get("/api/players/:username", async (req, res) => {
    const player = await storage.getPlayerByUsername(req.params.username);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  });

  // Discovery & Search
  app.get("/api/trending", async (_req, res) => {
    const tags = await storage.getTrendingHashtags();
    res.json(tags);
  });

  app.get("/api/hashtags/:tag", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    const posts = await storage.getPostsByHashtag(req.params.tag, currentUserId);
    res.json(posts);
  });

  app.get("/api/explore", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    const tags = await storage.getTrendingHashtags();
    const suggestedUsers = await storage.getSuggestedUsers(currentUserId);
    const teams = await storage.getTeams();
    const players = await storage.getPlayers();
    res.json({ tags, suggestedUsers, teams, players });
  });

  app.get("/api/search", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    const query = (req.query.q as string) || "";
    const results = await storage.search(query, currentUserId);
    res.json(results);
  });

  // Notifications & Bookmarks
  app.get("/api/notifications", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.json([]);
    }
    const notifications = await storage.getNotifications(currentUserId);
    res.json(notifications);
  });

  app.get("/api/bookmarks", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.json([]);
    }
    const bookmarks = await storage.getBookmarks(currentUserId);
    res.json(bookmarks);
  });

  // Messages
  app.get("/api/messages", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.json([]);
    }
    const otherUserId = req.query.with as string;
    if (!otherUserId) return res.json([]);
    const msgs = await storage.getMessages(currentUserId, otherUserId);
    res.json(msgs);
  });

  app.post("/api/messages", async (req, res) => {
    const currentUserId = getCurrentUserId(req);
    if (!currentUserId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { receiverId, content } = req.body;
    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content required" });
    }
    const msg = await storage.sendMessage(currentUserId, receiverId, content);
    res.status(201).json(msg);
  });

  // Moderation / Reports
  app.post("/api/reports", (req, res) => {
    const { postId, reason } = req.body;
    res.status(201).json({ success: true, message: "Report received by moderation" });
  });

  return httpServer;
}
