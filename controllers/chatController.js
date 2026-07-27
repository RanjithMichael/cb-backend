import fetch from "node-fetch";
import Chat from "../models/Chat.js";

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus", // Cohere’s latest chat model
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: message }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Cohere error:", text);
      return res.status(500).json({ reply: "❌ Cohere request failed" });
    }

    const data = await response.json();
    console.log("Cohere raw response:", data);

    // Cohere returns { message: { content: [{ text: "..." }] } }
    let aiReply = data.message?.content?.[0]?.text || "❌ No reply from Cohere";

    // Save to MongoDB
    const chat = new Chat({ userMessage: message, botReply: aiReply });
    await chat.save();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("❌ Error calling Cohere:", err);
    res.status(500).json({ reply: "❌ Failed to connect to Cohere" });
  }
};

// GET /api/chat/history
export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(20);
    res.json(chats);
  } catch (err) {
    console.error("❌ Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};


