import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";   // ✅ correct path

dotenv.config();

const reseedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Wipe all users
    await User.deleteMany({});
    console.log("⚠️ Existing users deleted");

    // Fresh demo accounts
    const users = [
      { username: "demoUser", email: "demo@example.com", password: "password123", role: "user" },
      { username: "adminUser", email: "admin@example.com", password: "admin123", role: "admin" },
      { username: "ranjith", email: "ranjith@example.com", password: "Ranjith_5665", role: "user" }
    ];

    // Insert with User.create() so pre‑save hook hashes passwords
    for (const u of users) {
      await User.create(u);
      console.log(`✅ User ${u.email} added`);
    }

    console.log("🎉 Reseeding complete");
    process.exit();
  } catch (err) {
    console.error("❌ Error reseeding users:", err);
    process.exit(1);
  }
};

reseedUsers();
