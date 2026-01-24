/* --- CONFIGURATION --- */
const bioText = "Building ideas from scratch.";
const introName = "Arnav Mishra"; // Text for Intro

// Full Lyrics Objects (Verse 1 & 2 as provided)
const fullVerses = {
    verse1: `Tu jang ka ailan kar \nDushmano PE vaar kar\nPapiyo ka naas kar....\n\nMoh dya ka tyag kar \nAb jism se na pyar kar \nMastko ke unke Aaj\nDeh se ajaad kar....\n\nDikha de pure vishwa ko\nParlaya ke raudra drishya ko\nJaha par keval dharm ho\nNa dharm me koi sharm ho\nJo dharm me kare sharam\nUn adharmiyo ka (naas kar)3...`,
    verse2: `Mai antt hun mai ankurit \nYugo yugo ka hal hai\nMai hinn hun ,mai hun priye\nMera hi maah saal hai\n\nNa saksh hun, na aatma \nNa devta ,pramatama \nMai bhoot (past) hun , mai kaal sa\nDivr hun mai bhaal sa`
};

/* --- DOM ELEMENTS --- */
const homeView = document.getElementById('home-view');
const aboutView = document.getElementById('about-view');
const musicPopup = document.getElementById('music-popup');
const bgMusic = document.getElementById('global-bg-music');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
const bioElement = document.getElementById('bio-text');
const introScreen = document.getElementById('intro-screen');
const signatureEl = document.getElementById('signature-text');

let isMusicPlaying = false;

/* --- 1. INTRO SEQUENCE (PAGE LOAD) --- */
window.addEventListener('load', () => {
    // Stage 1: Write Name Letter by Letter
    playIntroSequence();
});

function playIntroSequence() {
    let i = 0;
    const speed = 150; // Speed of writing

    function typeWriterIntro() {
        if (i < introName.length) {
            signatureEl.innerHTML += introName.charAt(i);
            i++;
            setTimeout(typeWriterIntro, speed);
        } else {
            // Stage 2: Finished writing, wait a bit then show Popup
            setTimeout(() => {
                finishIntro();
            }, 1000); // 1s delay after writing finishes
        }
    }
    // Start typing
    typeWriterIntro();
}

function finishIntro() {
    // Fade out Intro Screen
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
        
        // Stage 3: Show Music Popup (Site is still hidden/blurred)
        musicPopup.style.display = 'flex';
        setTimeout(() => {
            musicPopup.style.opacity = '1';
        }, 50);
    }, 1000);
}

/* --- 2. POPUP HANDLER (ENTRY POINT) --- */
function closePopup() {
    // Fade out popup
    musicPopup.style.opacity = '0';
    setTimeout(() => {
        musicPopup.style.display = 'none';
        
        // Stage 4: REVEAL SITE & START ANIMATIONS
        document.body.classList.remove('wait-for-intro');
        
        // Allow scrolling now
        document.body.style.overflow = 'auto';

        // Trigger animations for Home elements manually
        const animatedElements = document.querySelectorAll('#home-view > div, #home-view > button, #home-view > p');
        animatedElements.forEach(el => {
            el.classList.add('animate-entry');
        });

        // Start Bio Typewriter
        setTimeout(() => {
            typeWriter(bioText, bioElement, 100);
        }, 500);

        // Try Autoplay Music
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            muteIcon.className = "fas fa-volume-up";
            muteBtn.style.borderColor = "#00ff88";
            muteBtn.style.color = "#00ff88";
            isMusicPlaying = true;
        }).catch(e => {
            console.log("Autoplay blocked, user must click sound btn");
        });

    }, 500);
}


/* --- TYPEWRITER (For Bio) --- */
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
function switchToAbout() {
    homeView.style.opacity = '0';
    homeView.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        homeView.style.display = 'none';
        aboutView.style.display = 'block';
        
        aboutView.style.opacity = '0';
        aboutView.style.transform = 'translateY(20px)';
        void aboutView.offsetWidth; 
        
        aboutView.style.transition = 'all 0.6s ease';
        aboutView.style.opacity = '1';
        aboutView.style.transform = 'translateY(0)';
        
        initVerse('verse1');
        initVerse('verse2');
        
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

/* --- VERSE HANDLING --- */
function initVerse(verseKey) {
    const elementId = verseKey === 'verse1' ? 'verse-1-display' : 'verse-2-display';
    const content = fullVerses[verseKey];
    const container = document.getElementById(elementId);
    
    const formattedHtml = content.split('\n').map((line, index) => {
        if (line.trim() === '') return '<br>';
        return `<span class="verse-line" style="animation-delay: ${index * 0.1}s">${line}</span>`;
    }).join('');
    
    container.innerHTML = formattedHtml;
}
