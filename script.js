/* --- CONFIGURATION --- */
const bioText = "Building ideas from scratch.";

// Full Lyrics Objects
const fullVerses = {
    verse1: `Tu jang ka ailan kar 
Dushmano PE vaar kar
Papiyo ka naas kar....

Moh dya ka tyag kar 
Ab jism se na pyar kar 
Mastko ke unke Aaj
Deh se ajaad kar....

Dikha de pure vishwa ko
Parlaya ke raudra drishya ko
Jaha par keval dharm ho
Na dharm me koi sharm ho
Jo dharm me kare sharam
Un adharmiyo ka (naas kar)3...

Na bhal(bhala) ka vo ghao ho 
Na tir ka prabhav ho
Bas bhid me tuhi,tuhi
Aur Tera hi dabao ho
Jo tu lade to kaun bhage 
Jo tu bhage to kaun bache 
Bache Jo bht koi karnaverse
Kabhi na fir (vo lade)3...

Moh dya ka tyag kr 
Bas ek hi dharm vaar kr

Saam,dam,dand,bhed
Adharmiya pe kar ke dekh
Man le to jane de 
Na Mane to tu pran le
Tu kaat de vo har gale 
Jo marg pe tere na chle 
Vo sarthi vo Tera bhale...

Moh Daya ka tyag kar 
Bs ek hi dharm var kr...

Aarmbh hai is kaal ka 
Papiyo ke naas ka
Tu kaal se dare Bina 
Ab Jaan ka bhi daan de
Dikha de pure vishwa ko
Nisthur se is dishya ko
Adharmiyo ka naas kar 
Apne vir ka praman de....

Moh dya ka tyag kr 
Bs ek hi dharm vaar kar....

Moh dya ka tyag kr 
Bs ek hi dharm (vaar kar)3...`,

    verse2: `Mai antt hun mai ankurit 
Yugo yugo ka hal hai
Mai hinn hun ,mai hun priye
Mera hi maah saal hai

Na saksh hun, na aatma 
Na devta ,pramatama 
Mai bhoot (past) hun , mai kaal sa
Divr hun mai bhaal sa

Kurn sa mai dheema bhi
Brahamand sa na sheema bhi
Krishna se bhi vanchit mai 
Bhole se na mai saar hun
Mai ant hun mai ankurit 
Chattan sa mai bhaar(bhaari) hun

Na paksh dhar, nipaksh mai 
Lankesh ka mai haar hun 
Koi to mujhse hai khda 
Kisi ka intezar hun
Adrishya na mai hun kabhi
Mai to shariyam hun
Adharm na -mai dharm hun .
Mai mera koi chaal hai 

Mai antt hun mai ankurit 
Yugo yugo ka haal hai

Marg mera ek hai sheesha raasta magr
Chaal mai jo chaldu 
Aata na mi do-baar hu
Mai paksh me vipaksh hun
Vipaksh ka bhi shadhi mai
Acha Bura ho jo magr
Har karm ka gathi mai`
};

/* --- DOM ELEMENTS --- */
const homeView = document.getElementById('home-view');
const aboutView = document.getElementById('about-view');
const musicPopup = document.getElementById('music-popup');
const bgMusic = document.getElementById('global-bg-music');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
const bioElement = document.getElementById('bio-text');

let isMusicPlaying = false;

/* --- PAGE LOAD EVENTS --- */
window.addEventListener('load', () => {
    // 1. Start Typewriter for Bio immediately
    setTimeout(() => {
        typeWriter(bioText, bioElement, 100);
    }, 500);

    // 2. Show Popup after 2.5 Seconds Delay
    setTimeout(() => {
        musicPopup.style.display = 'flex';
        // Small delay to allow 'display:flex' to apply before opacity transition
        setTimeout(() => {
            musicPopup.style.opacity = '1';
        }, 50);
    }, 2500);
});

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

/* --- POPUP HANDLER --- */
function closePopup() {
    musicPopup.style.opacity = '0';
    setTimeout(() => {
        musicPopup.style.display = 'none';
        
        // Try Auto play
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            muteIcon.className = "fas fa-volume-up";
            muteBtn.style.borderColor = "#00ff88";
            muteBtn.style.color = "#00ff88";
            isMusicPlaying = true;
        }).catch(e => {
            console.log("Autoplay blocked");
        });
    }, 500);
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

/* --- VERSE HANDLING --- */
function initVerse(verseKey) {
    const elementId = verseKey === 'verse1' ? 'verse-1-display' : 'verse-2-display';
    const content = fullVerses[verseKey];
    const container = document.getElementById(elementId);
    
    // Format lines with staggered animation
    const formattedHtml = content.split('\n').map((line, index) => {
        if (line.trim() === '') return '<br>';
        // Slower delay for a more "dramatic" reading feel
        return `<span class="verse-line" style="animation-delay: ${index * 0.1}s">${line}</span>`;
    }).join('');
    
    container.innerHTML = formattedHtml;
}
