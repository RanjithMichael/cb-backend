import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const clearUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    console.log("✅ All users deleted");
    process.exit();
  } catch (err) {
    console.error("❌ Error deleting users:", err);
    process.exit(1);
  }
};

clearUsers();
