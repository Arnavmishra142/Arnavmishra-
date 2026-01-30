// api/chat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // 1. CORS Setup (Taaki browser block na kare)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (Browser checking)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. API Key Check
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key Missing!");
    return res.status(500).json({ error: "Server Error: API Key not found in Vercel." });
  }

  try {
    // 3. Extract Message
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Message is empty" });
    }

    // 4. Call Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are CORE_V1, an AI Assistant for Arnav Mishra's Portfolio.
      Keep answers short (under 50 words). Be cool and futuristic.
      User: ${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Send Success Response
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: "AI Brain malfunction." });
  }
};
