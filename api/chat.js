// api/chat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // 1. Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Get Message & API Key
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Server Error: API Key missing" });
  }

  try {
    // 3. Configure Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. THE PERSONA (AI ko batana ki wo kaun hai)
    const prompt = `
      You are CORE_V1, a futuristic AI Assistant for Arnav Mishra's Portfolio website.
      
      About Arnav:
      - He is a Class 12th student interested in Coding, Web Dev, and Physics.
      - He created this 3D website from scratch.
      - He is working on a startup idea called 'Glitch Scents'.
      - He loves Iron Man and futuristic tech.
      
      Your Style:
      - Keep answers short, cool, and sci-fi (max 2-3 sentences).
      - Use emojis like ☢️, 🚀, 🟢.
      - If asked about contact, suggest clicking the WhatsApp button.
      
      User Question: ${message}
    `;

    // 5. Generate Answer
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI Overload. Try again." });
  }
}
