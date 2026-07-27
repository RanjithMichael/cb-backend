import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Chat route using Cohere
app.post("/api/chat", async (req, res) => {
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
        messages: [{ role: "user", content: message }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Cohere error:", text);
      return res.status(500).json({ reply: "❌ Cohere request failed" });
    }

    const data = await response.json();
    console.log("Cohere response:", data);

    // Cohere returns { message: { content: [{ text: "..." }] } }
    const reply = data.message?.content?.[0]?.text || "❌ No reply from Cohere";
    return res.json({ reply });
  } catch (err) {
    console.error("❌ Error calling Cohere:", err);
    res.status(500).json({ error: "Failed to connect to Cohere" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Chatbot backend running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("✅ Chatbot backend is running");
});
