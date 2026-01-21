/* --- VARIABLES --- */
var audio = document.getElementById("global-bg-music");
var btn = document.getElementById("mute-btn");
// Ye wo text hai jo Typewriter se likha jayega
const poemText = "Tu jang ka ailan kar...\nDushmano PE vaar kar...\nPapiyo ka naas kar....";
let typingInterval;

/* --- MUSIC CONTROL --- */
audio.volume = 0.2; 
function toggleGlobalMusic() {
    if (audio.paused) {
        audio.play(); 
        btn.innerHTML = "🎵"; 
        btn.style.borderColor = "#00a3ff";
        btn.style.boxShadow = "0 0 15px rgba(0, 163, 255, 0.3)";
    } else {
        audio.pause(); 
        btn.innerHTML = "🔇"; 
        btn.style.borderColor = "#444";
        btn.style.boxShadow = "none";
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
    setTimeout(function(){
        popup.style.display = "none";
    }, 800);
}

/* --- TYPEWRITER LOGIC (New!) --- */
function typeWriterEffect() {
    const element = document.getElementById("typewriter-output");
    if(!element) return;
    
    element.innerHTML = ""; // Clear old text
    let index = 0;
    
    // Reset any existing timer
    clearInterval(typingInterval);

    typingInterval = setInterval(() => {
        if (poemText.charAt(index) === '\n') {
            element.innerHTML += "<br>";
        } else {
            element.innerHTML += poemText.charAt(index);
        }
        index++;
        if (index === poemText.length) {
            clearInterval(typingInterval);
        }
    }, 50); // Speed: 50ms per letter
}

/* --- PAGE SWITCHING --- */
function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    var about = document.getElementById('about-view');
    about.style.display = 'block';
    about.classList.add('fade-in');
    window.scrollTo(0, 0);
    
    // Trigger Typing
    typeWriterEffect();
}

function switchToHome() {
    document.getElementById('about-view').style.display = 'none';
    var home = document.getElementById('home-view');
    home.style.display = 'block';
    home.classList.add('fade-in');
    
    // Stop Typing
    clearInterval(typingInterval);
}
