/* --- VARIABLES --- */
var bgMusic = document.getElementById("global-bg-music");
var muteBtn = document.getElementById("mute-btn");
var isMuted = true;

/* --- 1. POPUP & ANIMATION TRIGGER --- */
window.onload = function() {
    // 2 second baad popup dikhao
    setTimeout(function() {
        var popup = document.getElementById("music-popup");
        if(popup) popup.classList.add("active");
    }, 2000); 
};

function closePopup() {
    var popup = document.getElementById("music-popup");
    if(popup) {
        popup.classList.remove("active");
        setTimeout(function(){ 
            popup.style.display = "none";
            // Jab popup band ho, tabhi BIO animation start karo
            const bio = document.querySelector('.bio');
            if(bio) {
                bio.style.width = "0"; 
                bio.style.animation = "typing 3.5s steps(30, end) forwards, blink-caret .75s step-end infinite";
            }
        }, 800);
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

/* --- 3. PAGE NAVIGATION --- */
function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    var about = document.getElementById('about-view');
    about.style.display = 'block';
    window.scrollTo(0, 0);
    
    // Type Verses
    startTyping("Moh dya ka tyag kar...\nAb jism se na pyar kar...\nMastko ke unke Aaj...\nDeh se ajaad kar....", "typewriter-output-1");
    setTimeout(() => {
        startTyping("Mai antt hun mai ankurit,\nYugo yugo ka hal hai...", "typewriter-output-2");
    }, 2000);
}

function switchToHome() {
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
}

/* --- 4. HELPER FUNCTIONS --- */
function readMoreVerses() {
    if(confirm("Do you want to visit Instagram to read the full masterpiece? ✍️\n(Click OK to visit)")) {
        window.open("https://www.instagram.com/arnav_9.11", "_blank");
    }
}

function startTyping(text, elementId) {
    const element = document.getElementById(elementId);
    if(!element) return;
    element.innerHTML = "";
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') element.innerHTML += "<br>";
            else element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeChar, 50);
        }
    }
    typeChar();
}
