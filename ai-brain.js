document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const launcher = document.getElementById('ai-launcher');
    const modal = document.getElementById('ai-modal');
    const closeBtn = document.getElementById('ai-close');
    const chatBox = document.getElementById('ai-chat-box');
    const userInput = document.getElementById('ai-user-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const statusText = document.querySelector('.ai-status-text');

    // --- MODAL LOGIC ---
    launcher.addEventListener('click', () => modal.classList.add('active'));
    const closeModal = () => modal.classList.remove('active');
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- CHAT LOGIC ---
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('ai-msg', sender);
        // Convert **bold** to <b>bold</b> for AI formatting
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function processInput() {
        const text = userInput.value.trim();
        if (!text) return;

        // 1. User Message
        addMessage(text, 'user');
        userInput.value = '';
        
        // 2. Loading State
        statusText.innerText = "Processing Data Stream... 📡";
        statusText.style.color = "#ff00ff";
        
        // Add a temporary thinking bubble
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('ai-msg', 'bot');
        loadingDiv.innerHTML = "<i>Thinking...</i>";
        loadingDiv.id = "ai-loading";
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            // 3. CALL VERCEL BACKEND (Real AI)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            // Remove loading
            document.getElementById('ai-loading').remove();
            
            // 4. Show AI Reply
            if (data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage("Connection weak. Try again.", 'bot');
            }

        } catch (error) {
            document.getElementById('ai-loading').remove();
            addMessage("Systems Offline. Check internet.", 'bot');
        }

        // Reset Status
        statusText.innerText = "Online & Listening...";
        statusText.style.color = "#00d4ff";
    }

    // Listeners
    sendBtn.addEventListener('click', processInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processInput();
    });

    console.log("CORE_V1: Connected to Neural Cloud ☁️");
});
