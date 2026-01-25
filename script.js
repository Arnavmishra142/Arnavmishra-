/* =========================================
   1. CONFIGURATION
========================================= */
const bioText = "Building ideas from scratch.";
const introName = "Arnav Mishra";
let typingInterval; 

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

/* =========================================
   2. DOM ELEMENTS
========================================= */
const body = document.getElementById('main-body');
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
const themeToggleBtn = document.getElementById('themeToggle');

let isMusicPlaying = false;

/* =========================================
   3. MENU LOGIC
========================================= */
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

/* =========================================
   4. INTRO SEQUENCE
========================================= */
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
        setTimeout(() => { musicPopup.style.opacity = '1'; }, 500);
        // Show Hint after intro
        const hint = document.getElementById('themeHint');
        if(hint) {
            hint.style.display = 'flex'; // Ensure it's visible before fading
            setTimeout(() => { hint.style.opacity = '0'; }, 5000); // Auto hide after 5s
        }
    }, 1000);
}

/* =========================================
   5. POPUP & MUSIC HANDLER
========================================= */
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

/* =========================================
   6. VIEW SWITCHING
========================================= */
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

/* =========================================
   7. VERSE HANDLING
========================================= */
function initVerse(verseKey) {
    const elementId = verseKey === 'verse1' ? 'verse-1-display' : 'verse-2-display';
    const data = verseData[verseKey];
    const container = document.getElementById(elementId);
    if(!container) return;

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
   8. DRAGGABLE THEME TOGGLE & HINT
========================================= */
// Close Hint Logic
function closeHint() {
    document.getElementById('themeHint').style.display = 'none';
}

if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeToggleBtn.classList.add('active');
}

function toggleTheme() {
    body.classList.toggle('light-mode');
    themeToggleBtn.classList.toggle('active');
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
}

// DRAG LOGIC
const dragItem = document.querySelector("#themeWrapper"); // Move wrapper instead of just button
let active = false;
let currentX, currentY, initialX, initialY;
let xOffset = 0, yOffset = 0;
let startX = 0, startY = 0;

dragItem.addEventListener("mousedown", dragStart, false);
dragItem.addEventListener("touchstart", dragStart, {passive: false});
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("touchend", dragEnd, {passive: false});
document.addEventListener("mousemove", drag, false);
document.addEventListener("touchmove", drag, {passive: false});

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        startX = e.clientX;
        startY = e.clientY;
    }
    if (e.target.closest('#themeWrapper')) { active = true; }
}

function dragEnd(e) {
    if(!active) return;
    initialX = currentX;
    initialY = currentY;
    active = false;
    let endX, endY;
    if (e.type === "touchend") {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
    } else {
        endX = e.clientX;
        endY = e.clientY;
    }
    let dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    if (dist < 5) { toggleTheme(); }
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
/* =========================================
   AUTOMATIC PICKS GENERATOR (JUGAAD)
========================================= */
function loadPicks() {
    const container = document.getElementById('recs-view');
    // Pehle purana static content hata dete hain (Title chhod ke)
    // Hum Title ke baad ek container bana lenge dynamic content ke liye
    
    // Check if container already has dynamic-wrapper, if not create one
    let wrapper = document.getElementById('dynamic-picks');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'dynamic-picks';
        container.appendChild(wrapper);
    }
    
    wrapper.innerHTML = ""; // Clear purana (just in case)

    // Loop through arnavPicks from picks.js
    if (typeof arnavPicks !== 'undefined') {
        arnavPicks.forEach(pick => {
            let cardHTML = "";

            if (pick.type === "video") {
                cardHTML = `
                <div class="card" style="border-top: 4px solid #ff0000;">
                    <h3 style="margin-top: 0; color: #fff;"><i class="fab fa-youtube" style="color: red;"></i> ${pick.title}</h3>
                    <p style="color: #bbb; font-size: 0.9rem; margin-bottom: 10px;">${pick.desc}</p>
                    <div class="video-container">
                        <iframe src="https://www.youtube.com/embed/${pick.link}" title="YouTube video" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>`;
            } else if (pick.type === "book") {
                cardHTML = `
                <div class="card" style="border-top: 4px solid #ff9f43;">
                    <h3 style="margin-top: 0; color: #fff;"><i class="fas fa-book" style="color: #ff9f43;"></i> ${pick.title}</h3>
                    <p style="color: #fff; font-weight: bold; font-size: 1.1rem; margin-top: 10px;">Recommended Read</p>
                    <p style="color: #888; font-size: 0.9rem; margin-top: 5px; font-style: italic;">"${pick.desc}"</p>
                    <a href="${pick.link}" target="_blank" class="btn" style="display:block; margin-top:15px; background:var(--card-bg); border-color: #ff9f43; color: #ff9f43;">View Book <i class="fas fa-arrow-right"></i></a>
                </div>`;
            }

            // HTML me inject kar do
            wrapper.innerHTML += cardHTML;
        });
        
        // Add bottom spacing
        wrapper.innerHTML += '<div style="height: 80px;"></div>';
    }
}

// Jab page load ho, tab ye chalao
window.addEventListener('load', () => {
    // Purana function call hone ke baad ye chalega
    setTimeout(loadPicks, 100); 
});

