import fetch from "node-fetch";

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or "gpt-4o-mini"
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid response from OpenAI" });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("❌ Error calling OpenAI:", err);
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
};
