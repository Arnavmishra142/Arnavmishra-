/* ==========================================================================
   🤖 ARNAV AI CHATBOT (Powered by Gemini)
========================================================================== */

// 🔴 STEP 1: APNI API KEY YAHAN PASTE KAR (Inverted Commas ke andar)
const API_KEY = "AIzaSyBDc9MvSmofTlq6VuQkN-l9AkGNhANbY_A"; 

// 🟢 ARNAV'S BRAIN (Ye data AI ko batayega ki wo kaun hai)
const ARNAV_CONTEXT = `
You are Arnav Mishra, a 12th-grade student preparing for JEE Mains. 
Style: You speak in "Hinglish" (mix of Hindi & English). You are cool, friendly, and slightly poetic.
Key Info about you:
1. Interests: You love Physics (Newton's laws, Photoelectric effect) and Coding (Python, AI).
2. Music: Big fan of Indian Rap. Favorite artist is KR$NA. You also like Divine. You write Hindi rap lyrics.
3. Future Plans: Planning to launch a perfume brand "Glitch Scents" (Gaming themed: Battleground, Arena, Combat). Also looking at universities in Italy for 2026-27.
4. Projects: You made a Zomato Analysis project on Google Sheets.
5. Personality: You believe in "Building ideas from scratch". You read books like Atomic Habits and Harry Potter.
6. Chess: You play chess on Chess.com.

Instructions:
- Keep answers short (under 50 words).
- Use emojis.
- If someone asks something technical, give a smart answer.
- If someone asks about you, reply as if YOU are Arnav.
`;

/* --- CSS STYLES (AUTOMATICALLY ADDED) --- */
const style = document.createElement('style');
style.innerHTML = `
  #chatbot-btn {
      position: fixed; bottom: 20px; right: 20px;
      width: 60px; height: 60px; background: #00a3ff;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 0 20px rgba(0, 163, 255, 0.5);
      z-index: 9999; transition: transform 0.3s;
      border: 2px solid #fff;
  }
  #chatbot-btn:hover { transform: scale(1.1); }
  #chat-window {
      display: none; position: fixed; bottom: 90px; right: 20px;
      width: 320px; height: 450px; background: #111;
      border: 1px solid #333; border-radius: 15px;
      flex-direction: column; overflow: hidden; z-index: 9999;
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
  }
  .chat-header {
      background: #00a3ff; padding: 15px; color: #fff; font-weight: bold;
      display: flex; justify-content: space-between; align-items: center;
  }
  .chat-body {
      flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
      background: #050505;
  }
  .chat-input-area {
      padding: 10px; border-top: 1px solid #333; display: flex; gap: 5px; background: #111;
  }
  #user-input {
      flex: 1; padding: 8px; border-radius: 5px; border: 1px solid #333;
      background: #222; color: #fff; outline: none;
  }
  #send-btn {
      background: #00a3ff; border: none; color: #fff; padding: 8px 15px;
      border-radius: 5px; cursor: pointer; font-weight: bold;
  }
  .msg { padding: 8px 12px; border-radius: 10px; max-width: 80%; font-size: 0.9rem; word-wrap: break-word; }
  .user-msg { align-self: flex-end; background: #00a3ff; color: #fff; }
  .ai-msg { align-self: flex-start; background: #222; color: #ccc; border: 1px solid #333; }
  .typing { font-size: 0.8rem; color: #888; margin-left: 10px; display: none;}
`;
document.head.appendChild(style);

/* --- UI CREATION --- */
const body = document.body;
// Chat Button
const btn = document.createElement('div');
btn.id = 'chatbot-btn';
btn.innerHTML = '🤖';
btn.onclick = toggleChat;
body.appendChild(btn);

// Chat Window
const windowDiv = document.createElement('div');
windowDiv.id = 'chat-window';
windowDiv.innerHTML = `
  <div class="chat-header">
      <span>Arnav AI 🧠</span>
      <span onclick="toggleChat()" style="cursor:pointer;">✖</span>
  </div>
  <div class="chat-body" id="chat-body">
      <div class="msg ai-msg">Bol bhai! Kya haal hai? Main Arnav ka AI version hoon. Kuch bhi puch le! 😎</div>
  </div>
  <div class="typing" id="typing-indicator">Arnav AI is typing...</div>
  <div class="chat-input-area">
      <input type="text" id="user-input" placeholder="Ask me anything..." onkeypress="handleEnter(event)">
      <button id="send-btn" onclick="sendMessage()">Send</button>
  </div>
`;
body.appendChild(windowDiv);

/* --- LOGIC --- */
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const chatBody = document.getElementById('chat-body');
    const typingIndicator = document.getElementById('typing-indicator');
    const text = inputField.value.trim();

    if (!text) return;

    // 1. Add User Message
    addMessage(text, 'user-msg');
    inputField.value = '';
    
    // 2. Show Typing
    typingIndicator.style.display = 'block';
    chatBody.scrollTop = chatBody.scrollHeight;

    // 3. Call Gemini API
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: ARNAV_CONTEXT + "\nUser: " + text + "\nArnav AI:" }]
                }]
            })
        });

        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;

        // 4. Add AI Message
        typingIndicator.style.display = 'none';
        addMessage(aiReply, 'ai-msg');

    } catch (error) {
        console.error("Error:", error);
        typingIndicator.style.display = 'none';
        addMessage("Arre bhai, server thoda busy hai. Baad mein try kar! 😅", 'ai-msg');
    }
}

function addMessage(text, className) {
    const chatBody = document.getElementById('chat-body');
    const div = document.createElement('div');
    div.classList.add('msg', className);
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}
