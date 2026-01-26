/* 🎙️ JARVIS VOICE CONTROL MODULE
   File Name: jarvis.js
   Description: Adds Voice Command capabilities to the portfolio.
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject CSS (Mic Button ke liye)
    const style = document.createElement('style');
    style.innerHTML = `
        #jarvis-btn {
            position: fixed; top: 20px; left: 80px; /* Menu ke paas */
            background: rgba(0, 0, 0, 0.6); 
            border: 1px solid #00a3ff; /* Cyan Blue */
            color: #00a3ff; padding: 10px; border-radius: 50%;
            cursor: pointer; font-size: 1.2rem;
            width: 45px; height: 45px;
            display: flex; align-items: center; justify-content: center;
            z-index: 99999; backdrop-filter: blur(5px); transition: 0.3s;
            opacity: 0; pointer-events: none; /* Initially Hidden */
            transition: opacity 1s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        #jarvis-btn:hover { 
            background: #00a3ff; color: #000; 
            box-shadow: 0 0 20px rgba(0, 163, 255, 0.6);
            transform: scale(1.1);
        }
        #jarvis-btn.listening {
            background: #ff4b4b; border-color: #ff4b4b; color: #fff;
            animation: pulse-red 1.5s infinite;
        }
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 75, 75, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 75, 75, 0); }
        }
    `;
    document.head.appendChild(style);

    // 2. Create Button
    const btn = document.createElement('div');
    btn.id = 'jarvis-btn';
    btn.innerHTML = '<i class="fas fa-microphone"></i>';
    btn.onclick = toggleJarvis;
    document.body.appendChild(btn);

    // 3. Reveal Button after Intro
    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }, 4000);
});

// --- JARVIS LOGIC ---
let recognition;
let isListening = false;

// Browser Support Check
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Ek command sunke ruk jayega
    recognition.lang = 'en-US'; // English samjhega

    recognition.onstart = function() {
        isListening = true;
        const btn = document.getElementById('jarvis-btn');
        btn.classList.add('listening');
        speak("Listening, boss.");
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
} else {
    console.log("Jarvis: Browser does not support Voice API.");
}

function toggleJarvis() {
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function executeCommand(command) {
    // --- COMMAND LIST ---
    
    // 1. Navigation
    if (command.includes("home") || command.includes("main")) {
        speak("Going home.");
        switchToHome();
    }
    else if (command.includes("project") || command.includes("about") || command.includes("work")) {
        speak("Showing your work.");
        switchToAbout();
    }
    else if (command.includes("pick") || command.includes("book") || command.includes("recommend")) {
        speak("Opening recommendations.");
        switchToRecs();
    }
    
    // 2. Music Control
    else if (command.includes("music") || command.includes("song") || command.includes("play")) {
        speak("Vibe check.");
        toggleMusic();
    }
    else if (command.includes("stop") || command.includes("pause")) {
        speak("Music paused.");
        toggleMusic();
    }

    // 3. Zero Gravity (Connects with gravity.js)
    else if (command.includes("gravity") || command.includes("float") || command.includes("zero")) {
        speak("Activating Zero Gravity.");
        if(typeof toggleGravity === 'function') {
            toggleGravity();
        } else {
            speak("Gravity module not found.");
        }
    }
    
    // 4. Reset
    else if (command.includes("reset") || command.includes("normal")) {
        speak("Restoring system.");
        location.reload();
    }

    // 5. Fun / Chat
    else if (command.includes("hello") || command.includes("hey")) {
        speak("Hello Arnav. Ready to deploy.");
    }
    else if (command.includes("who are you")) {
        speak("I am Jarvis, version 2.0, built by Arnav Mishra.");
    }
    else {
        speak("Command not recognized, try again.");
    }
}

// Text to Speech Function (Jarvis ki Awaaz)
function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Thoda robotic effect
    utterance.pitch = 0.8; // Thodi bhaari awaaz
    utterance.rate = 1;    // Normal speed
    
    synth.speak(utterance);
}
