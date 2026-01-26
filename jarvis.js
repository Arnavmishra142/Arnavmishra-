/* 🎙️ JARVIS 4.0: HYBRID FAST ENGINE
   File Name: jarvis.js
   Updates:
   - Instant Navigation (Bypasses AI for speed)
   - Human-like Voice Tuning (Pitch/Rate tweaks)
   - Context Aware (Understands "Enter", "Go to", "Show me")
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. UI Setup (Compact & Cool)
    const style = document.createElement('style');
    style.innerHTML = `
        #jarvis-wrapper {
            position: fixed; top: 90px; right: 25px;
            z-index: 99999; display: flex; flex-direction: column; align-items: flex-end;
            opacity: 0; pointer-events: none; transition: opacity 1s ease;
        }
        #jarvis-btn {
            background: rgba(0, 0, 0, 0.8); 
            border: 1px solid #00a3ff; color: #00a3ff; 
            width: 42px; height: 42px; border-radius: 50%; 
            display: flex; align-items: center; justify-content: center;
            cursor: grab; font-size: 1.1rem;
            backdrop-filter: blur(8px); 
            box-shadow: 0 0 15px rgba(0, 163, 255, 0.4);
            transition: transform 0.2s, background 0.3s;
        }
        #jarvis-btn:active { cursor: grabbing; transform: scale(0.95); }
        
        #jarvis-btn.listening {
            background: rgba(255, 0, 0, 0.2); border-color: #ff4b4b; color: #ff4b4b;
            box-shadow: 0 0 20px rgba(255, 75, 75, 0.6);
            animation: pulse-red 1s infinite;
        }
        #jarvis-btn.thinking {
            border-color: #00ff88; color: #00ff88;
            animation: pulse-green 0.8s infinite;
        }
        
        #jarvis-status {
            position: absolute; right: 55px; top: 10px;
            color: #fff; font-size: 0.7rem; font-family: 'Courier New', monospace;
            background: #000; padding: 2px 6px; border-radius: 4px;
            opacity: 0; transition: opacity 0.3s; pointer-events: none;
            white-space: nowrap; border-right: 2px solid #00a3ff;
        }

        @keyframes pulse-red { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes pulse-green { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement('div'); wrapper.id = 'jarvis-wrapper';
    const status = document.createElement('div'); status.id = 'jarvis-status'; status.innerText = "Listening...";
    const btn = document.createElement('div'); btn.id = 'jarvis-btn'; btn.innerHTML = '<i class="fas fa-microphone"></i>';
    
    wrapper.appendChild(status); wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

    setTimeout(() => { wrapper.style.opacity = '1'; wrapper.style.pointerEvents = 'auto'; }, 3000);

    // Drag Logic
    let active = false, curX, curY, iniX, iniY, xOff = 0, yOff = 0;
    wrapper.addEventListener("mousedown", dragStart); wrapper.addEventListener("touchstart", dragStart, {passive: false});
    document.addEventListener("mouseup", dragEnd); document.addEventListener("touchend", dragEnd);
    document.addEventListener("mousemove", drag); document.addEventListener("touchmove", drag, {passive: false});

    function dragStart(e) { if(e.target.closest('#jarvis-btn')) { active = true; iniX = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - xOff; iniY = (e.type === "touchstart" ? e.touches[0].clientY : e.clientY) - yOff; } }
    function dragEnd(e) { if(!active) return; active = false; iniX = curX; iniY = curY; toggleJarvis(); }
    function drag(e) { if (active) { e.preventDefault(); curX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - iniX; curY = (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - iniY; xOff = curX; yOff = curY; wrapper.style.transform = `translate3d(${curX}px, ${curY}px, 0)`; } }
});

// --- 🧠 FAST BRAIN & VOICE ---
let recognition;
let isListening = false;
let synth = window.speechSynthesis;
let preferredVoice = null;

// 1. Voice Optimization (Human-like settings)
function loadVoices() {
    const voices = synth.getVoices();
    // Priority: Google US English (Smoothest) -> Google Hindi (Accent) -> Any Male
    // User requested "Human voice + India accent". 'Google Hindi' speaks English with Indian accent.
    
    preferredVoice = voices.find(v => v.name.includes("Google Hindi")) || 
                     voices.find(v => v.lang === "en-IN") ||
                     voices.find(v => v.name.includes("Ravi")) ||
                     voices.find(v => v.name.includes("Google US English"));
}
if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = loadVoices;

// 2. Setup Recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; // Can change to 'hi-IN' for Hindi support
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isListening = true;
        document.getElementById('jarvis-btn').className = 'listening';
        showStatus("Listening...");
    };

    recognition.onend = () => {
        isListening = false;
        if(!document.getElementById('jarvis-btn').classList.contains('thinking')) {
            document.getElementById('jarvis-btn').className = '';
            showStatus("");
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Command:", transcript);
        processCommand(transcript);
    };
}

function toggleJarvis() {
    if (!recognition) { alert("Use Chrome/Edge for Voice"); return; }
    if (isListening) recognition.stop();
    else recognition.start();
}

function showStatus(text) {
    const el = document.getElementById('jarvis-status');
    el.innerText = text;
    el.style.opacity = text ? '1' : '0';
}

// 3. SMART PROCESSING (The Fast Lane)
function processCommand(text) {
    const btn = document.getElementById('jarvis-btn');
    
    // --- INSTANT NAVIGATIONS (No AI Delay) ---
    // Match variations: "enter about", "go to about", "show about", "open about"
    if (text.match(/home|main|start/)) {
        speakFast("Going home.");
        switchToHome();
        return;
    }
    if (text.match(/about|project|work|experience|enter about/)) {
        speakFast("Entering secure files.");
        switchToAbout();
        return;
    }
    if (text.match(/pick|book|recommend|intel/)) {
        speakFast("Opening recommendations.");
        switchToRecs();
        return;
    }
    if (text.match(/music|play|song|beat/)) {
        speakFast("Vibe check.");
        toggleMusic();
        return;
    }
    if (text.match(/stop|pause|quiet/)) {
        speakFast("Silence.");
        toggleMusic();
        return;
    }
    if (text.match(/gravity|float|zero/)) {
        speakFast("Disabling gravity.");
        if(typeof toggleGravity === 'function') toggleGravity();
        return;
    }
    if (text.match(/reset|reload|refresh/)) {
        speakFast("Rebooting system.");
        location.reload();
        return;
    }

    // --- FALLBACK TO AI (For Chat) ---
    btn.className = 'thinking';
    showStatus("Processing...");
    askAI(text);
}

// 4. AI CONNECTION
async function askAI(query) {
    // Prompt engineered for SPEED (Short answers)
    const prompt = `You are Jarvis. User: "${query}". Reply in 1 sentence. Be witty/sarcastic.`;
    
    try {
        const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
        const reply = await res.text();
        speakFast(reply);
    } catch (e) {
        speakFast("Connection error.");
    } finally {
        document.getElementById('jarvis-btn').className = '';
        showStatus("");
    }
}

// 5. HUMAN VOICE ENGINE
function speakFast(text) {
    if (synth.speaking) synth.cancel(); // Stop previous speech instantly

    const utter = new SpeechSynthesisUtterance(text);
    
    if (preferredVoice) utter.voice = preferredVoice;
    
    // TWEAKS FOR MORE "HUMAN" & "FAST" FEEL
    utter.rate = 1.1;  // Slightly faster (energetic)
    utter.pitch = 0.9; // Slightly deeper (male-like)
    
    synth.speak(utter);
}
