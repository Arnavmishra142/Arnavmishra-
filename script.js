/* ============================================
   🚀 ARNAV MISHRA - PREMIUM PORTFOLIO JS
   3D Effects | Smooth Animations | Interactions
============================================ */

// --- DATA ---
const arnavPicks = [
    {
        type: "video",
        title: "Must Watch Podcast",
        desc: "Nikhil Kamath with Elon Musk - A conversation about the future.",
        link: "Rni7Fz7208c"
    },
    {
        type: "book",
        title: "Atomic Habits",
        desc: "Tiny changes, remarkable results. Changed how I approach goals.",
        link: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299"
    },
    {
        type: "video",
        title: "Steve Jobs' Stanford Speech",
        desc: "Stay hungry, stay foolish. The speech that inspired millions.",
        link: "UF8uR6Z6KLc"
    },
    {
        type: "book",
        title: "Deep Work",
        desc: "Rules for focused success in a distracted world.",
        link: "https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692"
    },
    {
        type: "video",
        title: "How to Get Rich",
        desc: "Naval Ravikant's wisdom on wealth and happiness.",
        link: "1-TZqOsVCNM"
    }
];

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

// --- DOM ELEMENTS ---
const body = document.getElementById('main-body');
const homeView = document.getElementById('home-view');
const aboutView = document.getElementById('about-view');
const recsView = document.getElementById('recs-view');
const bgMusic = document.getElementById('global-bg-music');
const muteBtn = document.getElementById('mute-btn');
const muteIcon = document.getElementById('mute-icon');
const introScreen = document.getElementById('intro-screen');
const signatureEl = document.getElementById('signature-text');
const themeToggleBtn = document.getElementById('themeToggle');
const bioElement = document.getElementById('bio-text');

let isMusicPlaying = false;
let typingInterval;

// ============================================
// 🎬 INTRO ANIMATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // Initialize 3D Background
    initParticleCanvas();
    
    // Initialize Custom Cursor
    initCustomCursor();
    
    // Initialize Magnetic Buttons
    initMagneticButtons();
    
    // Initialize Tilt Cards
    initTiltCards();
    
    // Initialize Scroll Reveal
    initScrollReveal();
    
    // Start Intro
    startIntro();
});

function startIntro() {
    const introName = "Arnav Mishra";
    let i = 0;
    const speed = 80;
    
    function typeWriter() {
        if (signatureEl && i < introName.length) {
            signatureEl.innerHTML += introName.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            setTimeout(finishIntro, 800);
        }
    }
    
    if (signatureEl) {
        signatureEl.innerHTML = "";
        setTimeout(typeWriter, 300);
    }
}

function finishIntro() {
    introScreen.style.opacity = '0';
    introScreen.style.visibility = 'hidden';
    
    setTimeout(() => {
        introScreen.style.display = 'none';
        
        // Animate entry of all elements
        animateEntryElements();
        
        // Start bio typing
        if (bioElement) typeWriter("Building ideas from scratch.", bioElement, 60);
        
        // Play music
        if (bgMusic) {
            bgMusic.volume = 0.4;
            bgMusic.play().then(() => {
                if (muteIcon) muteIcon.className = "fas fa-volume-up";
                if (muteBtn) {
                    muteBtn.style.borderColor = "#00ff88";
                    muteBtn.style.color = "#00ff88";
                }
                isMusicPlaying = true;
            }).catch(e => console.log("Autoplay blocked"));
        }
    }, 1000);
}

function animateEntryElements() {
    const elements = document.querySelectorAll('.anim-delay-1, .anim-delay-2, .anim-delay-3, .anim-delay-4, .anim-delay-5, .anim-delay-6, .anim-delay-7, .anim-delay-8, .anim-delay-9, .anim-delay-10');
    
    elements.forEach((el, index) => {
        gsap.fromTo(el, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                delay: index * 0.1,
                ease: "power3.out"
            }
        );
    });
}

// ============================================
// ✨ 3D PARTICLE BACKGROUND
// ============================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;
    const mouseDistance = 200;
    
    let mouse = { x: null, y: null };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(0, 163, 255, ${Math.random() * 0.5 + 0.2})`;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Mouse interaction
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;
                    
                    this.vx += directionX;
                    this.vy += directionY;
                }
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Draw connections
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 163, 255, ${0.2 * (1 - distance / connectionDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
}

// ============================================
// 🖱️ CUSTOM CURSOR
// ============================================
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    
    if (!cursor || window.innerWidth <= 768) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        
        setTimeout(() => {
            trail.style.left = e.clientX - 4 + 'px';
            trail.style.top = e.clientY - 4 + 'px';
        }, 50);
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
}

// ============================================
// 🧲 MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// 🎯 3D TILT CARDS
// ============================================
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            
            // Move shine
            const shine = card.querySelector('.card-shine');
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ============================================
// 👁️ SCROLL REVEAL
// ============================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.card, .verse-card, .project-card').forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

// ============================================
// ⌨️ TYPEWRITER EFFECT
// ============================================
function typeWriter(text, element, speed) {
    if (typingInterval) clearInterval(typingInterval);
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

// ============================================
// 📱 NAVIGATION
// ============================================
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    
    if (sidebar.style.width === "280px") {
        sidebar.style.width = "0";
        overlay.classList.remove('active');
        setTimeout(() => overlay.style.display = "none", 300);
    } else {
        sidebar.style.width = "280px";
        overlay.style.display = "block";
        setTimeout(() => overlay.classList.add('active'), 10);
    }
}

function transitionView(hideView, showView, callback) {
    gsap.to(hideView, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        onComplete: () => {
            hideView.style.display = 'none';
            showView.style.display = 'block';
            
            gsap.fromTo(showView, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.5,
                    onComplete: callback
                }
            );
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    generatePicks();
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
        gsap.to(homeView, { opacity: 1, y: 0, duration: 0.5 });
    }
}

// ============================================
// 🎵 MUSIC CONTROLS
// ============================================
function toggleMusic() {
    if (bgMusic.paused) {
        bgMusic.play();
        muteIcon.className = "fas fa-volume-up";
        muteBtn.style.borderColor = "#00ff88";
        muteBtn.style.color = "#00ff88";
        
        // Add pulse animation
        muteBtn.style.animation = 'none';
        setTimeout(() => {
            muteBtn.style.animation = '';
        }, 10);
    } else {
        bgMusic.pause();
        muteIcon.className = "fas fa-volume-mute";
        muteBtn.style.borderColor = "#00a3ff";
        muteBtn.style.color = "#00a3ff";
    }
}

// ============================================
// 🌓 THEME TOGGLE
// ============================================
function toggleTheme() {
    body.classList.toggle('light-mode');
    themeToggleBtn.classList.toggle('active');
    
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Animate transition
    gsap.to(body, {
        backgroundColor: isLight ? '#f4f4f4' : '#050505',
        duration: 0.5
    });
}

function closeHint() {
    const hint = document.getElementById('themeHint');
    gsap.to(hint, { opacity: 0, duration: 0.3, onComplete: () => hint.style.display = 'none' });
}

// ============================================
// 📝 VERSES
// ============================================
function initVerse(verseKey) {
    const elementId = verseKey === 'verse1' ? 'verse-1-display' : 'verse-2-display';
    const data = verseData[verseKey];
    const container = document.getElementById(elementId);
    
    if (!container) return;
    
    const lines = data.text.split('\n');
    container.innerHTML = lines.map((line, index) => {
        if (line.trim() === '') return '<br>';
        return `<div class="verse-line" style="animation-delay: ${index * 0.1}s">${line}</div>`;
    }).join('') + `<button class="read-more-btn" onclick="goToInsta('${data.link}')">Read Full Lyrics <i class="fab fa-instagram"></i></button>`;
    
    // Animate lines
    gsap.fromTo(container.querySelectorAll('.verse-line'),
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.5 }
    );
}

function goToInsta(url) {
    if (confirm("Do you want to visit Instagram to read the full version?")) {
        window.open(url, '_blank');
    }
}

// ============================================
// 📚 GENERATE PICKS
// ============================================
function generatePicks() {
    const container = document.getElementById('dynamic-picks-wrapper');
    if (!container) return;
    
    container.innerHTML = arnavPicks.map((pick, index) => {
        if (pick.type === "video") {
            return `
            <div class="card tilt-card reveal-on-scroll" data-tilt style="animation-delay: ${index * 0.1}s">
                <div class="card-shine"></div>
                <div class="card-header">
                    <div class="project-icon" style="background: linear-gradient(135deg, #ff0000, #ff6b6b);">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <h3>${pick.title}</h3>
                </div>
                <p class="card-desc">${pick.desc}</p>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${pick.link}" title="YouTube video" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>`;
        } else {
            return `
            <div class="card tilt-card reveal-on-scroll" data-tilt style="animation-delay: ${index * 0.1}s; border-top: 4px solid #ff9f43;">
                <div class="card-shine"></div>
                <div class="card-header">
                    <div class="project-icon" style="background: linear-gradient(135deg, #ff9f43, #ffd89b);">
                        <i class="fas fa-book"></i>
                    </div>
                    <h3>${pick.title}</h3>
                </div>
                <p class="card-desc">${pick.desc}</p>
                <a href="${pick.link}" target="_blank" class="project-link-btn" style="border-color: #ff9f43; color: #ff9f43;">
                    View Book <i class="fas fa-arrow-right"></i>
                </a>
            </div>`;
        }
    }).join('');
    
    // Re-initialize tilt for new cards
    setTimeout(initTiltCards, 100);
}

// ============================================
// 🤖 CHATBOT
// ============================================
const SYSTEM_PROMPT = `You are 'Arnav AI', a raw, intelligent, and loyal assistant created by Arnav Mishra. You speak in Hinglish (mix of Hindi and English), are confident, witty, and helpful. Keep responses short and punchy.`;

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    
    if (chatWindow.style.display === 'flex') {
        gsap.to(chatWindow, {
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: 0.3,
            onComplete: () => chatWindow.style.display = 'none'
        });
    } else {
        chatWindow.style.display = 'flex';
        gsap.fromTo(chatWindow,
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
        document.getElementById('user-input').focus();
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const 
