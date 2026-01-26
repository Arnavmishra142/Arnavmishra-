/* 🎙️ JARVIS 3.0: AI BRAIN + INDIAN VOICE
   File Name: jarvis.js
   Features: Voice Control, AI Chat, Indian Accent, Moveable UI
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #jarvis-wrapper {
            position: fixed; top: 90px; right: 25px;
            z-index: 99999;
            display: flex; flex-direction: column; align-items: flex-end;
            opacity: 0; pointer-events: none; transition: opacity 1s ease;
        }
        #jarvis-btn {
            background: rgba(0, 0, 0, 0.7); 
            border: 1px solid #00a3ff;
            color: #00a3ff; width: 45px; height: 45px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: grab; font-size: 1.1rem;
            backdrop-filter: blur(5px); 
            box-shadow: 0 0 15px rgba(0, 163, 255, 0.3);
            transition: transform 0.2s, background 0.3s;
        }
        #jarvis-btn:active { cursor: grabbing; transform: scale(0.95); }
        
        /* Listening State (Red) */
        #jarvis-btn.listening {
            background: rgba(255, 0, 0, 0.2); border-color: #ff4b4b; color: #ff4b4b;
            animation: pulse-red 1.5s infinite;
        }
        /* Thinking State (Cyan) */
        #jarvis-btn.thinking {
            background: rgba(0, 163, 255, 0.2); border-color: #00ff88; color: #00ff88;
            animation: pulse-cyan 1s infinite;
        }
        
        #jarvis-hint {
            position: absolute; right: 55px; top: 10px;
            background: rgba(0, 0, 0, 0.8); color: #00a3ff;
            padding: 4px 8px; border-radius: 4px;
            font-size: 0.7rem; white-space: nowrap; border-right: 2px solid #00a3ff;
            pointer-events: none; opacity: 1; transition: opacity 0.5s;
        }

        @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(255, 75, 75, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0); } }
        @keyframes pulse-cyan { 0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(0, 255, 136, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); } }
    `;
    document.head.appendChild(style);

    // 2. Create Elements
    const wrapper = document.createElement('div'); wrapper.id = 'jarvis-wrapper';
    const hint = document.createElement('div'); hint.id = 'jarvis-hint'; hint.innerText = "Jarvis is online...";
    const btn = document.createElement('div'); btn.id = 'jarvis-btn'; btn.innerHTML = '<i class="fas fa-microphone"></i>';
    
    wrapper.appendChild(hint); wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

    // 3. Reveal Animation
    setTimeout(() => {
        wrapper.style.opacity = '1'; wrapper.style.pointerEvents = 'auto';
        setTimeout(() => hint.style.opacity = '0', 5000);
    }, 4000);

    // --- DRAG LOGIC (Shortened) ---
    let active = false, curX, curY, iniX, iniY, xOff = 0, yOff = 0;
    wrapper.addEventListener("mousedown", dragStart); wrapper.addEventListener("touchstart", dragStart, {passive: false});
    document.addEventListener("mouseup", dragEnd); document.addEventListener("touchend", dragEnd);
    document.addEventListener("mousemove", drag); document.addEventListener("touchmove", drag, {passive: false});

    function dragStart(e) {
        if(e.target.closest('#jarvis-btn')) {
            active = true;
            iniX = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - xOff;
            iniY = (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - yOff;
        }
    }
    function dragEnd(e) {
        if(!active) return; active = false; iniX = curX; iniY = curY;
        // Click Detection logic
        let endX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
        let startX = iniX + xOff; 
        // Simple approximation for click vs drag
        toggleJarvis(); 
    }
    function drag(e) {
        if (active) {
            e.preventDefault();
            curX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - iniX;
            curY = (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - iniY;
            xOff = curX; yOff = curY;
            wrapper.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;
        }
    }
});

// --- 🧠 JARVIS BRAIN & VOICE ---
let recognition;
let isListening = false;
let synth = window.speechSynthesis;
let jarvisVoice = null;

// 1. Setup Voice (Indian Male Priority)
function setVoice() {
    const voices = synth.getVoices();
    // Try to find Google Hindi (Best Indian sounding on Android/Windows)
    jarvisVoice = voices.find(v => v.name.includes("Google हिन्दी") || v.name.includes("Google Hindi"));
    
    // If not, try Microsoft Ravi or generic Indian
    if (!jarvisVoice) jarvisVoice = voices.find(v => v.name.includes("Ravi") || v.lang.includes("en-IN"));
    
    // If not, try any Male voice
    if (!jarvisVoice) jarvisVoice = voices.find(v => v.name.includes("Male"));
    
    console.log("Jarvis Voice Set:", jarvisVoice ? jarvisVoice.name : "Default");
}
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = setVoice;
}

// 2. Speech Recognition Setup
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; // Understands English
    // recognition.lang = 'hi-IN'; // Uncomment if you want Hindi understanding primarily

    recognition.onstart = () => {
        isListening = true;
        document.getElementById('jarvis-btn').className = 'listening';
        // speak("Ji boss?"); // Optional: Acknowledge
    };

    recognition.onend = () => {
        isListening = false;
        // Don't remove class immediately if thinking
        if(!document.getElementById('jarvis-btn').classList.contains('thinking')) {
            document.getElementById('jarvis-btn').className = '';
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Heard:", transcript);
        processInput(transcript);
    };
}

function toggleJarvis() {
    if (!recognition) { alert("Browser not supported."); return; }
    if (isListening) recognition.stop();
    else recognition.start();
}

// 3. Process Input (Command vs AI)
function processInput(text) {
    const btn = document.getElementById('jarvis-btn');
    
    // List of Hardcoded Commands
    const commands = ["home", "project", "work", "about", "music", "song", "play", "stop", "pause", "gravity", "zero", "reset", "reload"];
    
    // Check if it's a command
    const isCommand = commands.some(cmd => text.includes(cmd));

    if (isCommand) {
        executeSystemCommand(text);
        btn.className = '';
    } else {
        // Ask AI
        btn.className = 'thinking'; // Change color to Cyan
        askAI(text);
    }
}

function executeSystemCommand(command) {
    if (command.includes("home")) { speak("Going home, sir."); switchToHome(); }
    else if (command.includes("project") || command.includes("work")) { speak("Opening projects."); switchToAbout(); }
    else if (command.includes("music") || command.includes("play")) { speak("Dropping the beat."); toggleMusic(); }
    else if (command.includes("stop") || command.includes("pause")) { speak("Music paused."); toggleMusic(); }
    else if (command.includes("gravity")) { speak("Zero gravity activated."); if(typeof toggleGravity === 'function') toggleGravity(); }
    else if (command.includes("reset")) { speak("System reboot."); location.reload(); }
}

// 4. AI Integration (Pollinations)
async function askAI(query) {
    const btn = document.getElementById('jarvis-btn');
    
    // Prompt Engineering for Jarvis
    const prompt = `You are Jarvis, an AI assistant for Arnav. 
    User said: "${query}". 
    Reply in 1 or 2 short sentences. Be witty and smart.`;
    
    try {
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
        const reply = await response.text();
        
        speak(reply);
    } catch (error) {
        speak("Server connection lost.");
    } finally {
        btn.className = ''; // Reset UI
    }
}

// 5. Speak Function (With Accent Adjustment)
function speak(text) {
    if (synth.speaking) synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (jarvisVoice) {
        utterance.voice = jarvisVoice;
    }
    
    // Tweak properties to sound more like Jarvis (Slightly deeper/faster)
    utterance.pitch = 0.9; 
    utterance.rate = 1.0;
    
    synth.speak(utterance);
}
