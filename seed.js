import mongoose from "mongoose";
import dotenv from "dotenv";
import Chat from "./models/Chat.js";

dotenv.config();

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI); 

    console.log("✅ Connected to MongoDB Atlas");

    const seedChats = [
      { userMessage: "Hello bot!", botReply: "Hi there! How can I help you today?" },
      { userMessage: "Tell me a joke", botReply: "Why don’t programmers like nature? It has too many bugs." },
      { userMessage: "What is MERN stack?", botReply: "MERN stands for MongoDB, Express, React, and Node.js." },
      { userMessage: "Goodbye", botReply: "See you soon!" }
    ];

    await Chat.deleteMany(); // clear old data
    await Chat.insertMany(seedChats);

    console.log("✅ Database seeded with sample chats");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedDB();

