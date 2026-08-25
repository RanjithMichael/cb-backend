import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"; 
import chatRoutes from "./routes/chatRoutes.js";  

dotenv.config();

// Connect to MongoDB (handled in config/db.js)
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("✅ Chatbot backend is running");
});

//Mount routes
app.use("/api/auth", authRoutes);   // register & login
app.use("/api/chat", chatRoutes);   // protected chat routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Chatbot backend running on port ${PORT}`));

