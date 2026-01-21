/* --- CONFIGURATION --- */
const bioText = "Building ideas from scratch.";
const verses = {
    verse1: "Moh dya ka tyag kar...\nAb jism se na pyar kar...\nMastak ko uncha rakh tu,\nBas lakshya ka hi dhyan kar. 🔥",
    verse2: "Anjaan raaston pe chalta raha,\nNa manzil ka pata, na khud ka pata...\nBas ek umeed thi seene mein,\nJo har andhere ko roshan kar gayi. 🌌"
};

/* --- DOM ELEMENTS --- */
const homeView = document.getElementById('home-view');
const aboutView = document.getElementById('about-view');
const musicPopup = document.getElementById('music-popup');
const bgMusic = document.getElementById('global-bg-music');
const muteBtn = document.getElementById('mute-btn');
const bioElement = document.getElementById('bio-text');

let isMusicPlaying = false;

/* --- MUSIC CONTROL --- */
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        muteBtn.textContent = "🔊";
        isMusicPlaying = true;
    } else {
        bgMusic.pause();
        muteBtn.textContent = "🔇";
        isMusicPlaying = false;
    }
}

/* --- POPUP HANDLER --- */
function closePopup() {
    musicPopup.style.opacity = '0';
    setTimeout(() => {
        musicPopup.style.display = 'none';
        // Auto play music on entry if user interaction allowed
        bgMusic.volume = 0.5; // Set volume to 50%
        bgMusic.play().then(() => {
            muteBtn.textContent = "🔊";
            isMusicPlaying = true;
        }).catch(e => {
            console.log("Autoplay blocked, user must click mute btn");
        });
        
        // Start Bio Typing
        typeWriter(bioText, bioElement, 100);
    }, 500);
}

/* --- VIEW SWITCHING --- */
function switchToAbout() {
    homeView.style.opacity = '0';
    homeView.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        homeView.style.display = 'none';
        aboutView.style.display = 'block';
        
        // Reset animation for about view
        aboutView.style.opacity = '0';
        aboutView.style.transform = 'translateY(20px)';
        
        // Trigger reflow
        void aboutView.offsetWidth; 
        
        aboutView.style.transition = 'all 0.6s ease';
        aboutView.style.opacity = '1';
        aboutView.style.transform = 'translateY(0)';
        
        // Start verse typing previews
        startVerseTyping();
        
        window.scrollTo(0, 0);
    }, 400);
}

function switchToHome() {
    aboutView.style.opacity = '0';
    aboutView.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        aboutView.style.display = 'none';
        homeView.style.display = 'block';
        
        void homeView.offsetWidth;
        
        homeView.style.transition = 'all 0.6s ease';
        homeView.style.opacity = '1';
        homeView.style.transform = 'translateY(0)';
    }, 400);
}

/* --- TYPEWRITER EFFECT --- */
function typeWriter(text, element, speed) {
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function startVerseTyping() {
    const verse1El = document.getElementById('verse-1');
    const verse2El = document.getElementById('verse-2');
    
    // Type only first line as preview
    const v1Preview = verses.verse1.split('\n')[0] + "...";
    const v2Preview = verses.verse2.split('\n')[0] + "...";
    
    typeWriter(v1Preview, verse1El, 50);
    setTimeout(() => typeWriter(v2Preview, verse2El, 50), 1000);
}

/* --- READ FULL VERSE --- */
function readFullVerse(verseKey) {
    let elementId = (verseKey === 'verse1') ? 'verse-1' : 'verse-2';
    let content = (verseKey === 'verse1') ? verses.verse1 : verses.verse2;
    
    // Replace newlines with <br> for HTML display
    document.getElementById(elementId).innerHTML = content.replace(/\n/g, "<br>");
}
