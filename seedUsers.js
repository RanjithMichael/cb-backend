import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing users if you want a fresh start
    await User.deleteMany();

    // Demo users
    const users = [
      {
        username: "demoUser",
        email: "demo@example.com",
        password: "password123", // will be hashed
        role: "user",
      },
      {
        username: "adminUser",
        email: "admin@example.com",
        password: "admin123", // will be hashed
        role: "admin",
      },
    ];

    // Hash passwords before saving
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        u.password = await bcrypt.hash(u.password, salt);
        return u;
      })
    );

    await User.insertMany(hashedUsers);
    console.log("✅ Demo users seeded");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();
