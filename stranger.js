/* --- STRANGER JS --- */

const music = document.getElementById('stranger-music');
const steveSection = document.getElementById('steve-section');
const wallSection = document.getElementById('wall-section');
const wallMessage = document.getElementById('wall-message');
const steveText = document.querySelector('.steve-text');
const nameInput = document.getElementById('userNameInput');

// Try playing music on load (Browser might block it until interaction)
window.addEventListener('load', () => {
    music.volume = 0.7;
    music.play().catch(() => {
        console.log("Click needed for music");
    });
});

function submitName() {
    const name = nameInput.value.trim();
    if (name === "") return;

    // 1. Steve replies
    steveText.innerHTML = `"Hold on <strong>${name}</strong>, something's wrong. Watch the wall..."`;
    music.play(); // Ensure music plays now if it was blocked

    // 2. Hide Steve, Show Wall after 2 seconds
    setTimeout(() => {
        steveSection.style.opacity = '0';
        steveSection.style.transition = 'opacity 1s';
        
        setTimeout(() => {
            steveSection.style.display = 'none';
            wallSection.style.display = 'block';
            startLightMessage();
        }, 1000);
    }, 2000);
}

// The Message to spell: H E S C O M I N G
const messageSequence = ['H', 'E', 'S', 'C', 'O', 'M', 'I', 'N', 'G'];
let seqIndex = 0;

function startLightMessage() {
    wallMessage.textContent = "SOMETHING IS TRYING TO SPEAK...";
    
    const interval = setInterval(() => {
        if (seqIndex >= messageSequence.length) {
            clearInterval(interval);
            endSequence();
            return;
        }

        const letter = messageSequence[seqIndex];
        const bulb = document.getElementById(`light-${letter}`);
        
        // Blink ON
        if(bulb) bulb.classList.add('glow');

        // Blink OFF quickly
        setTimeout(() => {
            if(bulb) bulb.classList.remove('glow');
        }, 500);

        seqIndex++;
    }, 800); // Time between each letter blink
}

function endSequence() {
    // Show final scary message
    setTimeout(() => {
        document.getElementById('final-warning').style.opacity = '1';
        wallMessage.textContent = "";
        // Intense music moment (optional: increase volume here)
        music.volume = 1.0;
    }, 1000);
}

// Allow 'Enter' key to submit name
nameInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') submitName();
});

