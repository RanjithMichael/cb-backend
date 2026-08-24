import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { chatWithAI, getChatHistory } from "./controllers/chatController.js";
import authRoutes from "./routes/authRoutes.js"; 
import chatRoutes from "./routes/chatRoutes.js";  

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("✅ Chatbot backend is running");
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);   // register & login
app.use("/api/chat", chatRoutes);
app.post("/api/chat", chatWithAI);  // protected route
app.get("/api/chat/history", getChatHistory); // protected route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Chatbot backend running on port ${PORT}`));

