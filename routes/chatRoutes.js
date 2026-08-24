import express from "express";
import { chatWithAI, getChatHistory } from "../controllers/chatController.js";
import auth from "../middleware/auth.js"; 

const router = express.Router();

// Only logged-in users (role: user or admin) can access these routes
router.post("/", auth(["user", "admin"]), chatWithAI);
router.get("/history", auth(["user", "admin"]), getChatHistory);

export default router;


