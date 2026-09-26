import session from "express-session";
import connectPg from "connect-pg-simple";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import { storage } from "./storage";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      displayName: string;
      email?: string | null;
      avatar?: string | null;
    }
  }
}

export function setupAuth(app: Express) {
  const isProd = process.env.NODE_ENV === "production";
  const PgSession = connectPg(session);

  const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "limitx-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "lax",
    },
  };

  if (process.env.DATABASE_URL) {
    sessionConfig.store = new PgSession({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    });
  }

  app.set("trust proxy", 1);
  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientID && clientSecret) {
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";
    passport.use(
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL,
          proxy: true,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            const googleId = profile.id;
            const displayName = profile.displayName || profile.username || "Google User";
            const avatar = profile.photos?.[0]?.value;

            const user = await storage.upsertGoogleUser({
              googleId,
              email,
              displayName,
              avatar,
            });
            return done(null, user as any);
          } catch (err: any) {
            return done(err);
          }
        }
      )
    );
  } else {
    console.warn("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth routes will fail unless configured.");
  }
}
