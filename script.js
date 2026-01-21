/* --- SCRIPT.JS (Logic) --- */
var audio = document.getElementById("global-bg-music");
var btn = document.getElementById("mute-btn");
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

// Popup Logic with Delay
window.onload = function() {
    setTimeout(function() {
        var popup = document.getElementById("music-popup");
        if(popup) popup.classList.add("active");
    }, 3000); // 3 Seconds Wait
};

function closePopup() {
    var popup = document.getElementById("music-popup");
    popup.classList.remove("active");
    setTimeout(function(){
        popup.style.display = "none";
    }, 800);
}

// Page Switching
function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    var about = document.getElementById('about-view');
    about.style.display = 'block';
    about.classList.add('fade-in');
    window.scrollTo(0, 0);
}

function switchToHome() {
    document.getElementById('about-view').style.display = 'none';
    var home = document.getElementById('home-view');
    home.style.display = 'block';
    home.classList.add('fade-in');
}

