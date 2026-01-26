/* 🎙️ JARVIS VOICE CONTROL MODULE (Moveable & Compact)
   File Name: jarvis.js
   Description: Voice Command with Drag & Drop feature.
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        /* Wrapper to hold Button + Hint */
        #jarvis-wrapper {
            position: fixed; top: 90px; right: 25px; /* Sound button ke neeche */
            z-index: 99999;
            display: flex; flex-direction: column; align-items: flex-end;
            opacity: 0; pointer-events: none; /* Initially Hidden */
            transition: opacity 1s ease;
        }

        /* The Button (Compact Size) */
        #jarvis-btn {
            background: rgba(0, 0, 0, 0.6); 
            border: 1px solid #00a3ff; /* Cyan Blue */
            color: #00a3ff; 
            width: 40px; height: 40px; /* Chota size */
            border-radius: 50%; 
            display: flex; align-items: center; justify-content: center;
            cursor: grab; font-size: 1rem;
            backdrop-filter: blur(5px); 
            box-shadow: 0 0 10px rgba(0, 163, 255, 0.3);
            transition: transform 0.2s, background 0.3s;
        }
        #jarvis-btn:active { cursor: grabbing; transform: scale(0.95); }
        #jarvis-btn.listening {
            background: #ff4b4b; border-color: #ff4b4b; color: #fff;
            animation: pulse-red 1.5s infinite;
        }

        /* The Hint Text */
        #jarvis-hint {
            position: absolute; right: 50px; top: 8px;
            background: rgba(0, 0, 0, 0.8); color: #fff;
            padding: 5px 10px; border-radius: 5px;
            font-size: 0.7rem; white-space: nowrap;
            border-right: 2px solid #00a3ff;
            opacity: 1; transition: opacity 0.5s;
            pointer-events: none;
        }
        
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 75, 75, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0); }
        }
    `;
    document.head.appendChild(style);

    // 2. Create Elements (Wrapper -> Button + Hint)
    const wrapper = document.createElement('div');
    wrapper.id = 'jarvis-wrapper';

    // Hint
    const hint = document.createElement('div');
    hint.id = 'jarvis-hint';
    hint.innerText = "It's Jarvis.. Give a command 🎙️";
    wrapper.appendChild(hint);

    // Button
    const btn = document.createElement('div');
    btn.id = 'jarvis-btn';
    btn.innerHTML = '<i class="fas fa-microphone"></i>';
    wrapper.appendChild(btn);

    document.body.appendChild(wrapper);

    // 3. Reveal after 4 seconds
    setTimeout(() => {
        wrapper.style.opacity = '1';
        wrapper.style.pointerEvents = 'auto';
        
        // Hide hint after 6 seconds
        setTimeout(() => {
            hint.style.opacity = '0';
        }, 6000);
    }, 4000);

    // --- DRAG LOGIC (Moveable) ---
    let active = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;
    let startX, startY; // To distinguish Click vs Drag

    // Touch & Mouse Events
    wrapper.addEventListener("mousedown", dragStart, false);
    wrapper.addEventListener("touchstart", dragStart, {passive: false});

    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("touchend", dragEnd, {passive: false});

    document.addEventListener("mousemove", drag, false);
    document.addEventListener("touchmove", drag, {passive: false});

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            startX = e.clientX;
            startY = e.clientY;
        }

        if (e.target === btn || e.target.closest('#jarvis-btn')) {
            active = true;
        }
    }

    function dragEnd(e) {
        if (!active) return;
        
        initialX = currentX;
        initialY = currentY;
        active = false;

        // Calculate Distance Moved
        let endX = (e.type === "touchend") ? e.changedTouches[0].clientX : e.clientX;
        let endY = (e.type === "touchend") ? e.changedTouches[0].clientY : e.clientY;
        
        let dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

        // Agar move bohot kam hua hai (less than 5px), toh usko CLICK maano
        if (dist < 5) {
            toggleJarvis();
        }
    }

    function drag(e) {
        if (active) {
            e.preventDefault();
        
            let clientX = (e.type === "touchmove") ? e.touches[0].clientX : e.clientX;
            let clientY = (e.type === "touchmove") ? e.touches[0].clientY : e.clientY;

            currentX = clientX - initialX;
            currentY = clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, wrapper);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
});

// --- JARVIS CORE LOGIC (Same as before) ---
let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        isListening = true;
        const btn = document.getElementById('jarvis-btn');
        btn.classList.add('listening');
        speak("I'm listening.");
    };

    recognition.onend = function() {
        isListening = false;
        const btn = document.getElementById('jarvis-btn');
        btn.classList.remove('listening');
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Jarvis heard:", transcript);
        executeCommand(transcript);
    };
}

function toggleJarvis() {
    if(!recognition) { alert("Voice not supported in this browser"); return; }
    if (isListening) recognition.stop();
    else recognition.start();
}

function executeCommand(command) {
    if (command.includes("home") || command.includes("main")) { speak("Going home."); switchToHome(); }
    else if (command.includes("project") || command.includes("about") || command.includes("work")) { speak("Showing work."); switchToAbout(); }
    else if (command.includes("pick") || command.includes("book")) { speak("Recommendations open."); switchToRecs(); }
    else if (command.includes("music") || command.includes("play")) { speak("Vibe mode on."); toggleMusic(); }
    else if (command.includes("stop") || command.includes("pause")) { speak("Music paused."); toggleMusic(); }
    else if (command.includes("gravity") || command.includes("zero")) { speak("Zero Gravity."); if(typeof toggleGravity === 'function') toggleGravity(); }
    else if (command.includes("reset") || command.includes("normal")) { speak("Resetting."); location.reload(); }
    else if (command.includes("hello")) { speak("Hello Arnav."); }
    else { speak("Didn't catch that."); }
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.8; utterance.rate = 1;
    synth.speak(utterance);
}
