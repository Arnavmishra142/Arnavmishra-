/* --- CONFIGURATION --- */
const bioText = "Building ideas from scratch.";
const introName = "Arnav Mishra";

/* --- VERSE DATA --- */
const verseData = {
    verse1: {
        text: `Tu jang ka ailan kar 
Dushmano PE vaar kar
Papiyo ka naas kar....

Moh dya ka tyag kar 
Ab jism se na pyar kar 
Mastko ke unke Aaj
Deh se ajaad kar....`,
        link: "https://www.instagram.com/arnav_9.11/" 
    },
    verse2: {
        text: `Mai antt hun mai ankurit 
Yugo yugo ka hal hai
Mai hinn hun ,mai hun priye
Mera hi maah saal hai

Na saksh hun, na aatma 
Na devta ,pramatama 
Mai bhoot (past) hun , mai kaal sa
Divr hun mai bhaal sa`,
        link: "https://www.instagram.com/arnav_9.11/" 
    }
};

/* --- DOM ELEMENTS --- */
const homeView = document.getElementById('home-view');
const aboutView = document.getElementById('about-view');
const recsView = document.getElementById('recs-view');
const musicPopup = document.getElementById('music-popup');
const bgMusic = document.getElementById('global-bg-music');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
const bioElement = document.getElementById('bio-text');
const introScreen = document.getElementById('intro-screen');
const signatureEl = document.getElementById('signature-text');

let isMusicPlaying = false;

/* --- MENU LOGIC --- */
function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        overlay.style.display = "none";
    } else {
        sidebar.style.width = "250px";
        overlay.style.display = "block";
    }
}

/* --- INTRO SEQUENCE --- */
window.addEventListener('load', () => {
    playIntroSequence();
});

function playIntroSequence() {
    let i = 0;
    const speed = 150;
    function typeWriterIntro() {
        if (i < introName.length) {
            signatureEl.innerHTML += introName.charAt(i);
            i++;
            setTimeout(typeWriterIntro, speed);
        } else {
            setTimeout(() => { finishIntro(); }, 1000);
        }
    }
    typeWriterIntro();
}

function finishIntro() {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
        musicPopup.style.display = 'flex';
        setTimeout(() => { musicPopup.style.opacity = '1'; }, 50);
    }, 1000);
}

/* --- POPUP HANDLER --- */
function closePopup() {
    musicPopup.style.opacity = '0';
    setTimeout(() => {
        musicPopup.style.display = 'none';
        document.body.classList.remove('wait-for-intro');
        document.body.style.overflow = 'auto';

        const animatedElements = document.querySelectorAll('#home-view > div, #home-view > button, #home-view > p');
        animatedElements.forEach(el => { el.classList.add('animate-entry'); });

        setTimeout(() => { typeWriter(bioText, bioElement, 100); }, 500);

        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            muteIcon.className = "fas fa-volume-up";
            muteBtn.style.borderColor = "#00ff88";
            muteBtn.style.color = "#00ff88";
            isMusicPlaying = true;
        }).catch(e => { console.log("Autoplay blocked"); });

    }, 500);
}

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

/* --- MUSIC CONTROL --- */
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        muteIcon.className = "fas fa-volume-up";
        muteBtn.style.borderColor = "#00ff88";
        muteBtn.style.color = "#00ff88";
        isMusicPlaying = true;
    } else {
        bgMusic.pause();
        muteIcon.className = "fas fa-volume-mute";
        muteBtn.style.borderColor = "#00a3ff";
        muteBtn.style.color = "#00a3ff";
        isMusicPlaying = false;
    }
}

/* --- VIEW SWITCHING --- */
function transitionView(hideView, showView, callback) {
    hideView.style.opacity = '0';
    hideView.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        hideView.style.display = 'none';
        showView.style.display = 'block';
        showView.style.opacity = '0';
        showView.style.transform = 'translateY(20px)';
        
        void showView.offsetWidth; 
        
        showView.style.transition = 'all 0.6s ease';
        showView.style.opacity = '1';
        showView.style.transform = 'translateY(0)';
        
        if (callback) callback();
        window.scrollTo(0, 0);
    }, 400);
}

function switchToAbout() {
    recsView.style.display = 'none'; 
    transitionView(homeView, aboutView, () => {
        initVerse('verse1');
        initVerse('verse2');
    });
}

function switchToRecs() {
    aboutView.style.display = 'none'; 
    transitionView(homeView, recsView);
}

function switchToHome() {
    if (aboutView.style.display === 'block') {
        transitionView(aboutView, homeView);
    } else if (recsView.style.display === 'block') {
        transitionView(recsView, homeView);
    } else {
        aboutView.style.display = 'none';
        recsView.style.display = 'none';
        homeView.style.display = 'block';
        homeView.style.opacity = '1';
        homeView.style.transform = 'translateY(0)';
    }
}

/* --- VERSE HANDLING --- */
function initVerse(verseKey) {
    const elementId = verseKey === 'verse1' ? 'verse-1-display' : 'verse-2-display';
    const data = verseData[verseKey];
    const container = document.getElementById(elementId);
    
    const formattedText = data.text.split('\n').map((line, index) => {
        if (line.trim() === '') return '<br>';
        return `<span class="verse-line" style="animation-delay: ${index * 0.1}s">${line}</span>`;
    }).join('');
    
    const buttonHtml = `
        <button class="read-more-btn" onclick="goToInsta('${data.link}')">
            Read Full Lyrics <i class="fab fa-instagram"></i>
        </button>
    `;

    container.innerHTML = formattedText + buttonHtml;
}

function goToInsta(url) {
    if(confirm("Do you want to visit Instagram to read the full version?")) {
        window.open(url, '_blank');
    }
}

/* =========================================
   DRAGGABLE THEME TOGGLE LOGIC
========================================= */
const dragItem = document.querySelector("#themeToggle");
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// Mouse Events
dragItem.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

// Touch Events
dragItem.addEventListener("touchstart", dragStart, {passive: false});
document.addEventListener("touchend", dragEnd, {passive: false});
document.addEventListener("touchmove", drag, {passive: false});

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target.closest('#themeToggle')) {
        active = true;
    }
}

function dragEnd(e) {
    if(!active) return;
    
    initialX = currentX;
    initialY = currentY;
    active = false;

    // Detect Click vs Drag (If moved less than 5px, treat as click)
    // Simple way: check if we moved much. If not, trigger toggleTheme()
    // However, since we track offset, let's keep it simple:
    // If user tapped without dragging, toggle theme.
    // This logic handles drag primarily. 
    // For click, we check if the mouseup happened on the element without much movement.
}

function drag(e) {
    if (active) {
        e.preventDefault();
    
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

// Handle Click explicitly since we removed onclick from HTML to avoid conflict
let startX, startY;
dragItem.addEventListener('touchstart', function(e) {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
}, {passive: false});

dragItem.addEventListener('touchend', function(e) {
    const endX = e.changedTouches[0].pageX;
    const endY = e.changedTouches[0].pageY;
    if (Math.abs(endX - startX) < 5 && Math.abs(endY - startY) < 5) {
        toggleTheme();
    }
}, {passive: false});

dragItem.addEventListener('click', function(e) {
    // For mouse clicks, simple click listener works if drag didn't happen
    // We can just use the toggleTheme logic directly here if dragging wasn't the intent
    // But since mousemove handles drag, a static click should trigger this.
    toggleTheme(); 
});
