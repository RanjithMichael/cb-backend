import fetch from "node-fetch";
import Chat from "../models/Chat.js";  

export const chatWithAI = async (req, res) => {
  console.log("🔥 chatWithAI called with body:", req.body);
  const { message } = req.body;

  console.log("User message received:", message);

  // Validate input
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ reply: "❌ Message cannot be empty" });
  }

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-08-2024",
        message: message
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Cohere error:", text);
      return res.status(500).json({ reply: "❌ Cohere request failed" });
    }

    const data = await response.json();
    console.log("Cohere raw response:", data);

    const aiReply = data.text || "❌ No reply from Cohere";

    const chat = new Chat({ userMessage: message, botReply: aiReply });
    await chat.save();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("❌ Error calling Cohere:", err);
    res.status(500).json({ reply: "❌ Failed to connect to Cohere" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(20);
    res.json(chats);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};