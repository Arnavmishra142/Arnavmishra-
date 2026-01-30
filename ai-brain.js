document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const launcher = document.getElementById('ai-launcher');
    const modal = document.getElementById('ai-modal');
    const closeBtn = document.getElementById('ai-close');
    const chatBox = document.getElementById('ai-chat-box');
    const userInput = document.getElementById('ai-user-input');
    const sendBtn = document.getElementById('ai-send-btn');

    // --- 1. MODAL OPEN/CLOSE LOGIC ---
    launcher.addEventListener('click', () => modal.classList.add('active'));
    const closeModal = () => modal.classList.remove('active');
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- 2. KNOWLEDGE BASE (AI ka Dimaag) ---
    // Yahan tu naye sawal-jawab add kar sakta hai
    const knowledge = {
        "hello": "Hello! I am ready to assist. Type 'projects' to see Arnav's work.",
        "hi": "Hey there! Welcome to the 3D Universe.",
        "who are you": "I am CORE_V1, a neural interface designed by Arnav.",
        "arnav": "Arnav Mishra is a futuristic developer building ideas from scratch.",
        "skills": "Arnav knows HTML, CSS, JavaScript, and is learning React & AI integration.",
        "projects": "Arnav has built this 3D Portfolio, a Solar System clone, and working on 'Glitch Scents'.",
        "contact": "You can connect with him on LinkedIn or WhatsApp. Should I open WhatsApp?",
        "whatsapp": "opening_whatsapp", // Special Command
        "bye": "Goodbye! Closing neural link...",
        "default": "I didn't quite catch that. Try asking about 'Skills', 'Projects', or 'Contact'."
    };

    // --- 3. CHAT LOGIC ---
    
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.classList.add('ai-msg', sender); // sender = 'user' or 'bot'
        div.innerHTML = text;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom
    }

    function processInput() {
        const text = userInput.value.trim().toLowerCase();
        if (!text) return;

        // 1. Show User Message
        addMessage(userInput.value, 'user');
        userInput.value = '';

        // 2. Simulate Thinking (Delay)
        setTimeout(() => {
            let response = knowledge["default"];
            
            // Keyword Matching (Simple AI)
            for (let key in knowledge) {
                if (text.includes(key)) {
                    response = knowledge[key];
                    break;
                }
            }

            // Special Actions
            if (response === "opening_whatsapp") {
                addMessage("Opening WhatsApp Secure Link... 🟢", 'bot');
                setTimeout(() => window.open('https://wa.me/916393349498', '_blank'), 1000);
            } else if (text.includes("bye")) {
                addMessage(response, 'bot');
                setTimeout(closeModal, 2000);
            } else {
                addMessage(response, 'bot');
            }

        }, 600); // 600ms delay for realism
    }

    // Event Listeners
    sendBtn.addEventListener('click', processInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processInput();
    });

    console.log("AI Neural Core: Online 🟢");
});
