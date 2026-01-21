/* --- VARIABLES --- */
var bgMusic = document.getElementById("global-bg-music");
var muteBtn = document.getElementById("mute-btn");
var isMuted = true;
var typingInterval; // To control typing speed/reset

/* --- 1. POPUP & HOME ANIMATION --- */
window.onload = function() {
    setTimeout(function() {
        var popup = document.getElementById("music-popup");
        if(popup) popup.classList.add("active");
    }, 1500); 
};

function closePopup() {
    var popup = document.getElementById("music-popup");
    if(popup) {
        popup.classList.remove("active");
        setTimeout(function(){ 
            popup.style.display = "none";
            // Start Home Page Bio Animation
            const bio = document.querySelector('.bio');
            if(bio) {
                bio.style.width = "0"; 
                bio.style.animation = "typing 3.5s steps(30, end) forwards, blink-caret .75s step-end infinite";
            }
        }, 500);
    }
}

/* --- 2. MUSIC CONTROL --- */
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Audio permission error:", e));
        isMuted = false;
        muteBtn.innerHTML = "🎵"; 
        muteBtn.style.borderColor = "#00a3ff";
    } else {
        bgMusic.pause();
        isMuted = true;
        muteBtn.innerHTML = "🔇"; 
        muteBtn.style.borderColor = "#444";
    }
}

/* --- 3. NAVIGATION & ANIMATION FIX --- */
function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    
    var about = document.getElementById('about-view');
    about.style.display = 'block';
    // Add Fade In Animation Reset
    about.classList.remove('fade-in');
    void about.offsetWidth; // Trigger reflow
    about.classList.add('fade-in');
    
    window.scrollTo(0, 0);
    
    // Start Verses Typing (Reset First)
    startTyping("Moh dya ka tyag kar...\nAb jism se na pyar kar...\nMastko ke unke Aaj...\nDeh se ajaad kar....", "typewriter-output-1");
    
    setTimeout(() => {
        startTyping("Mai antt hun mai ankurit,\nYugo yugo ka hal hai...", "typewriter-output-2");
    }, 2000);
}

function switchToHome() {
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
}

/* --- 4. TYPEWRITER HELPER --- */
function startTyping(text, elementId) {
    const element = document.getElementById(elementId);
    if(!element) return;
    
    element.innerHTML = ""; // Clear previous text
    let i = 0;
    
    // Create a local interval for this specific element
    let localInterval = setInterval(() => {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                element.innerHTML += "<br>";
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
        } else {
            clearInterval(localInterval);
        }
    }, 50); // Speed
}

function readMoreVerses() {
    if(confirm("Do you want to visit Instagram to read the full masterpiece? ✍️\n(Click OK to visit)")) {
        window.open("https://www.instagram.com/arnav_9.11", "_blank");
    }
}
