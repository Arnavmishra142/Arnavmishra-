/* --- CONFIGURATION --- */
const bioText = "Building ideas from scratch.";
const introName = "Arnav Mishra";

// --- UPDATED: SHORT LYRICS & LINKS ---
const verseData = {
    verse1: {
        text: `Tu jang ka ailan kar 
Dushmano PE vaar kar
Papiyo ka naas kar....

Moh dya ka tyag kar 
Ab jism se na pyar kar 
Mastko ke unke Aaj
Deh se ajaad kar....`,
        // YAHAN APNI INSTA POST KA LINK DAAL:
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
        // YAHAN DUSRI POST KA LINK DAAL:
        link: "https://www.instagram.com/arnav_9.11/" 
    }
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

/* --- 1. INTRO SEQUENCE --- */
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

/* --- 2. POPUP HANDLER --- */
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

/* --- TYPEWRITER --- */
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

/* --- UPDATED VERSE HANDLING (With Redirect) --- */
function initVerse(verseKey) {
    const elementId = verseKey === 'verse1' ? 'verse-1-display' : 'verse-2-display';
    const data = verseData[verseKey];
    const container = document.getElementById(elementId);
    
    // Create Text HTML
    const formattedText = data.text.split('\n').map((line, index) => {
        if (line.trim() === '') return '<br>';
        return `<span class="verse-line" style="animation-delay: ${index * 0.1}s">${line}</span>`;
    }).join('');
    
    // Create Button HTML with "Puch ke" logic (confirm dialog)
    const buttonHtml = `
        <button class="read-more-btn" onclick="goToInsta('${data.link}')">
            Read Full Lyrics <i class="fab fa-instagram"></i>
        </button>
    `;

    container.innerHTML = formattedText + buttonHtml;
}

// Redirect Function with Confirmation
function goToInsta(url) {
    if(confirm("Do you want to visit Instagram to read the full version?")) {
        window.open(url, '_blank');
    }
}
