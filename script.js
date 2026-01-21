/* --- VARIABLES --- */
var globalAudio = document.getElementById("global-bg-music"); // Home Song
var gameAudio = document.getElementById("game-bg-music");     // Game Song
var btn = document.getElementById("mute-btn");

// Hum track karenge ki abhi user kahan hai (home ya game)
var currentMode = 'home'; 
var isMuted = true; // By default mute rakhenge jab tak user tap na kare

const poemText = "Tu jang ka ailan kar...\nDushmano PE vaar kar...\nPapiyo ka naas kar....";
let typingInterval;

/* --- MUSIC CONTROL (SMART TOGGLE) --- */
globalAudio.volume = 0.2; 
gameAudio.volume = 0.3; 

function toggleMusic() {
    // Jo mode active hai, uska gaana pakdo
    var activeAudio = (currentMode === 'game') ? gameAudio : globalAudio;

    if (activeAudio.paused) {
        activeAudio.play();
        isMuted = false;
        btn.innerHTML = "🎵"; 
        btn.style.borderColor = "#00a3ff";
    } else {
        activeAudio.pause();
        isMuted = true;
        btn.innerHTML = "🔇"; 
        btn.style.borderColor = "#444";
    }
}

/* --- POPUP CONTROL --- */
window.onload = function() {
    setTimeout(function() {
        var popup = document.getElementById("music-popup");
        if(popup) popup.classList.add("active");
    }, 3000); 
};

function closePopup() {
    var popup = document.getElementById("music-popup");
    popup.classList.remove("active");
    setTimeout(function(){ popup.style.display = "none"; }, 800);
}

/* --- TYPEWRITER LOGIC --- */
function typeWriterEffect() {
    const element = document.getElementById("typewriter-output");
    if(!element) return;
    element.innerHTML = ""; 
    let index = 0;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        if (poemText.charAt(index) === '\n') { element.innerHTML += "<br>"; } 
        else { element.innerHTML += poemText.charAt(index); }
        index++;
        if (index === poemText.length) { clearInterval(typingInterval); }
    }, 50);
}

/* --- PAGE SWITCHING --- */
function switchToAbout() {
    // Music change nahi hoga, bas view change hoga
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    
    var about = document.getElementById('about-view');
    about.style.display = 'block'; about.classList.add('fade-in');
    window.scrollTo(0, 0);
    typeWriterEffect();
}

function switchToGames() {
    currentMode = 'game'; // Mode update kiya
    
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';
    
    var games = document.getElementById('games-view');
    games.style.display = 'block'; games.classList.add('fade-in');
    window.scrollTo(0, 0);

    // LOGIC: Home song roko, Game song chalao (agar mute nahi hai)
    globalAudio.pause();
    gameAudio.currentTime = 0; // Shuru se bajega
    if (!isMuted) {
        gameAudio.play();
        btn.innerHTML = "🎵";
        btn.style.borderColor = "#00a3ff";
    } else {
        btn.innerHTML = "🔇";
    }
}

function switchToHome() {
    currentMode = 'home'; // Mode wapas Home
    
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    
    var home = document.getElementById('home-view');
    home.style.display = 'block'; home.classList.add('fade-in');

    // LOGIC: Game song roko, Home song wapas chalao
    gameAudio.pause();
    if (!isMuted) {
        globalAudio.play();
        btn.innerHTML = "🎵";
        btn.style.borderColor = "#00a3ff";
    } else {
        btn.innerHTML = "🔇";
    }
}
