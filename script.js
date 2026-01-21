/* --- VARIABLES --- */
var globalAudio = document.getElementById("global-bg-music");
var gameAudio = document.getElementById("game-bg-music");
var btn = document.getElementById("mute-btn");

const poemText = "Tu jang ka ailan kar...\nDushmano PE vaar kar...\nPapiyo ka naas kar....";
let typingInterval;

/* --- MUSIC CONTROL --- */
globalAudio.volume = 0.2; 
gameAudio.volume = 0.3; // Game music thoda tez

function toggleGlobalMusic() {
    if (globalAudio.paused) {
        globalAudio.play(); 
        btn.innerHTML = "🎵"; 
        btn.style.borderColor = "#00a3ff";
    } else {
        globalAudio.pause(); 
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

/* --- PAGE SWITCHING & MUSIC LOGIC --- */
function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none'; // Hide games
    
    var about = document.getElementById('about-view');
    about.style.display = 'block'; about.classList.add('fade-in');
    window.scrollTo(0, 0);
    typeWriterEffect();
}

function switchToGames() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';
    
    var games = document.getElementById('games-view');
    games.style.display = 'block'; games.classList.add('fade-in');
    window.scrollTo(0, 0);

    // MUSIC SWAP MAGIC
    globalAudio.pause();
    gameAudio.currentTime = 0;
    gameAudio.play();
}

function switchToHome() {
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    
    var home = document.getElementById('home-view');
    home.style.display = 'block'; home.classList.add('fade-in');

    // MUSIC SWAP BACK
    gameAudio.pause();
    if(btn.innerHTML === "🎵") { globalAudio.play(); } // Resume only if unmuted
}
