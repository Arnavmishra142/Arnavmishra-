/* ==========================================================================
   🟢 ARNAV'S SAFE ZONE: EDIT HERE ONLY
========================================================================== */

const arnavPicks = [
    {
        type: "video",
        title: "Must Watch Podcast",
        desc: "Nikhil Kamath with Elon Musk.",
        link: "Rni7Fz7208c" // Video ID (No slash)
    },
    // Aur add karna ho to yahan comma laga ke add kar sakte ho
];

/* ==========================================================================
   🔴 DANGER ZONE: DO NOT TOUCH BELOW THIS LINE
========================================================================== */

/* --- 1. CONFIGURATION --- */
const bioText = "Building ideas from scratch.";
const introName = "Arnav Mishra";
let typingInterval;

/* --- 2. VERSE DATA --- */
const verseData = {
    verse1: {
        text: `Tu jang ka ailan kar \nDushmano PE vaar kar\nPapiyo ka naas kar....\n\nMoh dya ka tyag kar \nAb jism se na pyar kar \nMastko ke unke Aaj\nDeh se ajaad kar....`,
        link: "https://www.instagram.com/arnav_9.11/" 
    },
    verse2: {
        text: `Mai antt hun mai ankurit \nYugo yugo ka hal hai\nMai hinn hun ,mai hun priye\nMera hi maah saal hai\n\nNa saksh hun, na aatma \nNa devta ,pramatama \nMai bhoot (past) hun , mai kaal sa\nDivr hun mai bhaal sa`,
        link: "https://www.instagram.com/arnav_9.11/" 
    }
};

/* --- 3. DOM ELEMENTS --- */
const body = document.getElementById('main-body');
const homeView = document.getElementById('home-view');
const aboutView = document.getElementById('about-view');
const recsView = document.getElementById('recs-view');
const musicPopup = document.getElementById('music-popup');
const bgMusic = document.getElementById('global-bg-music');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
const introScreen = document.getElementById('intro-screen');
const signatureEl = document.getElementById('signature-text');
const themeToggleBtn = document.getElementById('themeToggle');
const bioElement = document.getElementById('bio-text');

let isMusicPlaying = false;

/* --- 4. INTRO ANIMATION (INSTANT START 🚀) --- */
// Pehle 'load' tha, ab 'DOMContentLoaded' kar diya taaki wait na kare
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Generate Picks instantly
    try { generatePicks(); } catch (e) { console.error(e); }

    // 2. Start Typing Immediately
    let i = 0;
    const speed = 75; // SPEED BADHA DI (Fast typing)
    
    function typeWriterIntro() {
        if (signatureEl && i < introName.length) {
            signatureEl.innerHTML += introName.charAt(i);
            i++;
            setTimeout(typeWriterIntro, speed);
        } else {
            // Typing khatam hote hi site khol do (No delay)
            finishIntro();
        }
    }

    // Start immediately
    if (signatureEl) {
        signatureEl.innerHTML = ""; // Clear existing cursor bug
        setTimeout(typeWriterIntro, 100); // Tiny buffer start
    } else {
        finishIntro();
    }
});

function finishIntro() {
    // Fade out black screen
    introScreen.style.opacity = '0';
    
    setTimeout(() => {
        introScreen.style.display = 'none';
        
        // Show Popup Immediately
        musicPopup.style.display = 'flex';
        setTimeout(() => { musicPopup.style.opacity = '1'; }, 50);

        // Hint Logic
        const hint = document.getElementById('themeHint');
        if(hint) {
            hint.style.display = 'flex';
            setTimeout(() => { hint.style.opacity = '0'; }, 4000);
        }
    }, 800); // 0.8 sec fade out time
}

function closePopup() {
    musicPopup.style.opacity = '0';
    setTimeout(() => {
        musicPopup.style.display = 'none';
        document.body.classList.remove('wait-for-intro');
        document.body.style.overflow = 'auto';
        
        // Animate Elements Entry
        const animatedElements = document.querySelectorAll('#home-view > div, #home-view > button, #home-view > p');
        animatedElements.forEach(el => { el.classList.add('animate-entry'); });
        
        // Type Bio
        if(bioElement) typeWriter(bioText, bioElement, 80);
        
        // Play Music
        if (bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().then(() => {
                if(muteIcon) muteIcon.className = "fas fa-volume-up";
                if(muteBtn) { muteBtn.style.borderColor = "#00ff88"; muteBtn.style.color = "#00ff88"; }
                isMusicPlaying = true;
            }).catch(e => console.log("Autoplay blocked"));
        }
    }, 400);
}

/* --- 5. TYPEWRITER HELPER --- */
function typeWriter(text, element, speed) {
    if(typingInterval) clearInterval(typingInterval);
    element.innerHTML = "";
    let i = 0;
    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, speed);
}

/* --- 6. DYNAMIC PICKS GENERATOR --- */
function generatePicks() {
    const container = document.getElementById('recs-view');
    if (!container) return;

    let wrapper = document.getElementById('dynamic-picks-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'dynamic-picks-wrapper';
        container.appendChild(wrapper);
    }
    wrapper.innerHTML = "";

    arnavPicks.forEach(pick => {
        let html = "";
        if (pick.type === "video") {
            html = `
            <div class="card" style="border-top: 4px solid #ff0000;">
                <h3 style="margin-top: 0; color: #fff;"><i class="fab fa-youtube" style="color: red;"></i> ${pick.title}</h3>
                <p style="color: #888; font-size: 0.9rem; margin-bottom: 10px;">${pick.desc}</p>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${pick.link}" title="YouTube video" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>`;
        } else {
            html = `
            <div class="card" style="border-top: 4px solid #ff9f43;">
                <h3 style="margin-top: 0; color: #fff;"><i class="fas fa-book" style="color: #ff9f43;"></i> ${pick.title}</h3>
                <p style="color: #888; font-size: 0.9rem; margin-top: 5px; font-style: italic;">"${pick.desc}"</p>
                <a href="${pick.link}" target="_blank" class="btn" style="display:block; margin-top:15px; background:var(--card-bg); border-color: #ff9f43; color: #ff9f43;">View Book <i class="fas fa-arrow-right"></i></a>
            </div>`;
        }
        wrapper.innerHTML += html;
    });
    wrapper.innerHTML += '<div style="height: 80px;"></div>';
}

/* --- 7. NAVIGATION --- */
function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; overlay.style.display = "none";
    } else {
        sidebar.style.width = "250px"; overlay.style.display = "block";
    }
}

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
        initVerse('verse1'); initVerse('verse2');
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
        aboutView.style.display = 'none'; recsView.style.display = 'none';
        homeView.style.display = 'block'; homeView.style.opacity = '1'; homeView.style.transform = 'translateY(0)';
    }
}

/* --- 8. MUSIC & THEME --- */
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        muteIcon.className = "fas fa-volume-up";
        muteBtn.style.borderColor = "#00ff88"; muteBtn.style.color = "#00ff88";
    } else {
        bgMusic.pause();
        muteIcon.className = "fas fa-volume-mute";
        muteBtn.style.borderColor = "#00a3ff"; muteBtn.style.color = "#00a3ff";
    }
}

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeToggleBtn.classList.add('active');
}
function toggleTheme() {
    body.classList.toggle('light-mode');
    themeToggleBtn.classList.toggle('active');
    if (body.classList.contains('light-mode')) localStorage.setItem('theme', 'light');
    else localStorage.setItem('theme', 'dark');
}
function closeHint() { document.getElementById('themeHint').style.display = 'none'; }

/* --- 9. VERSES --- */
function initVerse(verseKey) {
    const elementId = verseKey === 'verse1' ? 'verse-1-display' : 'verse-2-display';
    const data = verseData[verseKey];
    const container = document.getElementById(elementId);
    if(!container) return;
    const formattedText = data.text.split('\n').map((line, index) => {
        if (line.trim() === '') return '<br>';
        return `<span class="verse-line" style="animation-delay: ${index * 0.1}s">${line}</span>`;
    }).join('');
    container.innerHTML = formattedText + `<button class="read-more-btn" onclick="goToInsta('${data.link}')">Read Full Lyrics <i class="fab fa-instagram"></i></button>`;
}
function goToInsta(url) {
    if(confirm("Do you want to visit Instagram to read the full version?")) window.open(url, '_blank');
}

/* --- 10. DRAG LOGIC --- */
const dragItem = document.querySelector("#themeWrapper");
let active = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0, startX, startY;

if(dragItem) {
    dragItem.addEventListener("mousedown", dragStart, false);
    dragItem.addEventListener("touchstart", dragStart, {passive: false});
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("touchend", dragEnd, {passive: false});
    document.addEventListener("mousemove", drag, false);
    document.addEventListener("touchmove", drag, {passive: false});
}

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset; initialY = e.touches[0].clientY - yOffset;
        startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    } else {
        initialX = e.clientX - xOffset; initialY = e.clientY - yOffset;
        startX = e.clientX; startY = e.clientY;
    }
    if (e.target.closest('#themeWrapper')) active = true;
}
function dragEnd(e) {
    if(!active) return;
    initialX = currentX; initialY = currentY; active = false;
    let endX = (e.type === "touchend") ? e.changedTouches[0].clientX : e.clientX;
    let endY = (e.type === "touchend") ? e.changedTouches[0].clientY : e.clientY;
    if (Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) < 5) toggleTheme();
}
function drag(e) {
    if (active) {
        e.preventDefault();
        let clientX = (e.type === "touchmove") ? e.touches[0].clientX : e.clientX;
        let clientY = (e.type === "touchmove") ? e.touches[0].clientY : e.clientY;
        currentX = clientX - initialX; currentY = clientY - initialY;
        xOffset = currentX; yOffset = currentY;
        dragItem.style.transform = "translate3d(" + currentX + "px, " + currentY + "px, 0)";
    }
}

/* --- KR$NA PLAY BUTTON LOGIC --- */
function toggleKrsnaPlay() {
    const audio = document.getElementById('krsna-audio');
    const btn = document.getElementById('krsna-play-btn');
    const icon = document.getElementById('krsna-play-icon');

    if (audio.paused) {
        audio.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        btn.classList.add('playing');
    } else {
        audio.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        btn.classList.remove('playing');
    }
}
