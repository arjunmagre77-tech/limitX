import { db } from "./db";
import { users, teams, players, posts } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  if (!db) {
    console.error("DATABASE_URL is not set. Cannot seed database.");
    process.exit(1);
  }

  console.log("Seeding database...");

  // Seed demo org/user
  const hashedPassword = await bcrypt.hash("limitless123", 10);
  const [orgUser] = await db
    .insert(users)
    .values({
      username: "limitless_esports",
      displayName: "Limitless Esports Hub",
      password: hashedPassword,
      bio: "Official Limitless Esports Hub organization account.",
      avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80",
      role: "Organization",
      verificationType: "org",
      points: 2500,
      levelTitle: "Legend",
    })
    .onConflictDoNothing()
    .returning();

  const [viperUser] = await db
    .insert(users)
    .values({
      username: "viper_ff",
      displayName: "Viper (Alex Chen)",
      password: hashedPassword,
      bio: "Main IGL for Limitless Free Fire roster. 3x FFCS Champion.",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80",
      role: "Player",
      verificationType: "player",
      points: 1850,
      levelTitle: "Master Fragger",
    })
    .onConflictDoNothing()
    .returning();

  // Seed team
  await db
    .insert(teams)
    .values({
      name: "Limitless Esports",
      slug: "limitless",
      game: "Free Fire",
      region: "South Asia",
      followersCount: 14200,
      championships: 5,
    })
    .onConflictDoNothing();

  const authorId = orgUser?.id || viperUser?.id || "demo-author";

  // Seed sample post
  await db
    .insert(posts)
    .values({
      authorId,
      content: "🔥 GRAND FINALS ANNOUNCEMENT! Limitless Free Fire roster is taking the stage tonight at 8 PM IST. Drop a 🏆 to show your support! #LimitlessWin #FreeFire",
      isOfficial: true,
      mediaUrls: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"],
      likesCount: 142,
      commentsCount: 18,
      repostsCount: 35,
    })
    .onConflictDoNothing();

  console.log("Seeding complete! Demo data inserted into database.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
