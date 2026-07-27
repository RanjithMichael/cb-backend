import fetch from "node-fetch";
import Chat from "../models/Chat.js";

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Hugging Face error:", text);
      return res.status(500).json({ reply: "❌ Hugging Face request failed" });
    }

    const data = await response.json();
    console.log("Hugging Face raw response:", data);

    let aiReply = data.generated_text || "❌ No reply from Hugging Face";

    // Save to MongoDB
    const chat = new Chat({ userMessage: message, botReply: aiReply });
    await chat.save();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("❌ Error calling Hugging Face:", err);
    res.status(500).json({ reply: "❌ Failed to connect to Hugging Face" });
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
