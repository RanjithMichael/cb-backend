import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Chat route using Hugging Face
app.post("/api/chat", async (req, res) => {
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
    console.log("Hugging Face response:", data);

    // Hugging Face returns { generated_text: "..." }
    return res.json({ reply: data.generated_text || "❌ No reply from Hugging Face" });
  } catch (err) {
    console.error("❌ Error calling Hugging Face:", err);
    res.status(500).json({ error: "Failed to connect to Hugging Face" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Chatbot backend running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("✅ Chatbot backend is running");
});
