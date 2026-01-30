document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTS ---
    const launcher = document.getElementById('ai-launcher');
    const modal = document.getElementById('ai-modal');
    const closeBtn = document.getElementById('ai-close'); 
    const chatBox = document.getElementById('ai-chat-box');
    const userInput = document.getElementById('ai-user-input');
    const sendBtn = document.getElementById('ai-send-btn');

    // --- 1. MODAL OPEN/CLOSE ---
    launcher.addEventListener('click', () => modal.classList.add('active'));
    
    const closeModal = () => modal.classList.remove('active');
    
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- 2. CHAT UI FUNCTION ---
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('ai-msg', sender);
        
        // Formatting: **Bold** ko sahi dikhana
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        div.innerHTML = formattedText;
        
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- 3. ASLI AI LOGIC (POLLINATIONS - NO KEY) ---
    async function talkToAI() {
        const text = userInput.value.trim();
        if (!text) return;

        // User Message Show Kar
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
            // AI KA PERSONA SET KARNA (Taaki wo Arnav ka bot lage)
            const persona = "You are CORE_V1, a futuristic AI Assistant for Arnav Mishra's Portfolio. You are helpful, clever, and concise. You know everything about science, coding, and Arnav. If asked about Arnav, say he is a visionary 12th-grade developer.";
            
            // URL Banana (Ye Magic Link hai - Free AI)
            const prompt = `${persona} User says: ${text}`;
            const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;

            // Call Bhejna
            const response = await fetch(url);
            const aiReply = await response.text();
            
            // Remove Loading
            document.getElementById(loadingId).remove();

            // Show AI Reply
            if (aiReply) {
                addMessage(aiReply, 'bot');
            } else {
                addMessage("Signal lost in space. Try again.", 'bot');
            }

        } catch (error) {
            console.error(error);
            document.getElementById(loadingId).remove();
            addMessage("Neural Link Failed. Check Internet.", 'bot');
        }
    }

    // --- 4. LISTENERS ---
    sendBtn.addEventListener('click', talkToAI);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') talkToAI();
    });

    console.log("System Online: Connected to Open Grid 🌐");
});
