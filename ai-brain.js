document.addEventListener('DOMContentLoaded', () => {
    
    // --- 🔑 APNI API KEY YAHAN PASTE KAR ---
    const API_KEY = "AIzaSyBCN5-tGZrfx_YkuO-lhyDQtl_qNvD3kkI"; 
    // Example: const API_KEY = "AIzaSyDxxxx...";
    // ----------------------------------------

    // Elements
    const launcher = document.getElementById('ai-launcher');
    const modal = document.getElementById('ai-modal');
    const closeBtn = document.getElementById('ai-close-btn'); // ID check kar lena
    const chatBox = document.getElementById('ai-chat-box');
    const userInput = document.getElementById('ai-user-input');
    const sendBtn = document.getElementById('ai-send-btn');

    // 1. MODAL OPEN/CLOSE
    launcher.addEventListener('click', () => modal.classList.add('active'));
    
    const closeModal = () => modal.classList.remove('active');
    
    // Close button fix (Check if element exists)
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Background click close
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });

    // 2. CHAT UI FUNCTION
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('ai-msg', sender);
        
        // Simple formatting: Bold stars ko <b> mein badalna
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        
        // Links ko clickable banana
        formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color:#00d4ff">$1</a>');

        div.innerHTML = formattedText;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 3. AI LOGIC (Direct Call to Google)
    async function talkToGemini() {
        const text = userInput.value.trim();
        if (!text) return;

        // User ka message dikha
        addMessage(text, 'user');
        userInput.value = '';

        // Thinking Indicator
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('ai-msg', 'bot');
        loadingDiv.id = loadingId;
        loadingDiv.innerText = "Thinking... 🧠";
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            // Direct API Call (No Backend)
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are CORE_V1, a futuristic AI Assistant for Arnav Mishra's Portfolio. 
                            Arnav is a web developer, student, and creator of Glitch Scents.
                            Be cool, concise, and futuristic. Use emojis.
                            User asking: ${text}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            // Remove Loading
            document.getElementById(loadingId).remove();

            // Answer nikalna
            if (data.candidates && data.candidates[0].content) {
                const aiReply = data.candidates[0].content.parts[0].text;
                addMessage(aiReply, 'bot');
            } else {
                addMessage("Signal weak. Try again.", 'bot');
            }

        } catch (error) {
            console.error(error);
            document.getElementById(loadingId).remove();
            addMessage("System Error. Check Console.", 'bot');
        }
    }

    // 4. EVENT LISTENERS
    sendBtn.addEventListener('click', talkToGemini);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') talkToGemini();
    });

    console.log("AI System: Direct Link Established 🔗");
});
