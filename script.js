// ===== CONFIG =====
const CONFIG = {
    loaderDuration: 2500,
    typingSpeed: 60,
    particlesCount: 30
};

// ===== DATA =====
const verses = {
    verse1: `Tu jang ka ailan kar 
Dushmano PE vaar kar
Papiyo ka naas kar....

Moh dya ka tyag kar 
Ab jism se na pyar kar 
Mastko ke unke Aaj
Deh se ajaad kar....`,
    verse2: `Mai antt hun mai ankurit 
Yugo yugo ka hal hai
Mai hinn hun ,mai hun priye
Mera hi maah saal hai

Na saksh hun, na aatma 
Na devta ,pramatama 
Mai bhoot (past) hun , mai kaal sa
Divr hun mai bhaal sa`
};

const intelData = [
    {
        type: 'video',
        title: 'Must Watch Podcast',
        desc: 'Nikhil Kamath with Elon Musk - A conversation about the future.',
        link: 'Rni7Fz7208c'
    },
    {
        type: 'book',
        title: 'Atomic Habits',
        desc: 'Tiny changes, remarkable results. Changed how I approach goals.',
        link: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299'
    },
    {
        type: 'video',
        title: 'Steve Jobs Speech',
        desc: 'Stay hungry, stay foolish. The speech that inspired millions.',
        link: 'UF8uR6Z6KLc'
    }
];

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initThreeJS();
    initParticles();
    initCursor();
    initClock();
    initProfileFlip();
    initTiltCards();
    initIntelCards();
    initScrollAnimations();
});

// ===== LOADER =====
function initLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');
        
        // Start animations after loader
        setTimeout(() => {
            animateTitle();
            typeWriter('Building ideas from scratch.', 'tagline', CONFIG.typingSpeed);
            document.getElementById('verse1').textContent = verses.verse1;
            document.getElementById('verse2').textContent = verses.verse2;
        }, 500);
    }, CONFIG.loaderDuration);
}

// ===== THREE.JS BACKGROUND =====
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create connecting lines
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.1
    });
    
    camera.position.z = 5;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation
    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // Mouse parallax
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ===== PARTICLES =====
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < CONFIG.particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ===== CUSTOM CURSOR =====
function initCursor() {
    if (window.innerWidth <= 768) return;
    
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth follow
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        follower.style.left = followerX - 20 + 'px';
        follower.style.top = followerY - 20 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#ff00ff';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#00f0ff';
        });
    });
}

// ===== CLOCK =====
function initClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;
    
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== PROFILE FLIP =====
function initProfileFlip() {
    const profile = document.getElementById('profile3d');
    const card = document.getElementById('profileCard');
    const video = document.getElementById('profileVideo');
    
    if (!profile || !card) return;
    
    // 3D tilt on mouse move
    profile.addEventListener('mousemove', (e) => {
        if (card.classList.contains('flipped')) return;
        
        const rect = profile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    profile.addEventListener('mouseleave', () => {
        if (!card.classList.contains('flipped')) {
            card.style.transform = 'rotateX(0) rotateY(0)';
        }
    });
    
    // Click to flip
    profile.addEventListener('click', () => {
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
            video.pause();
        } else {
            // Load appropriate video based on time
            const hour = new Date().getHours();
            let videoFile = 'elon_evening.mp4';
            if (hour >= 5 && hour < 12) videoFile = 'elon_morning.mp4';
            else if (hour >= 12 && hour < 18) videoFile = 'elon_afternoon.mp4';
            
            video.src = videoFile + '?t=' + Date.now();
            card.classList.add('flipped');
            
            setTimeout(() => {
                video.play().catch(() => {});
            }, 400);
        }
    });
}

// ===== TILT CARDS =====
function initTiltCards() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            
            // Update shine position
            card.style.setProperty('--x', x + 'px');
            card.style.setProperty('--y', y + 'px');
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ===== INTEL CARDS =====
function initIntelCards() {
    const container = document.getElementById('intelGrid');
    if (!container) return;
    
    container.innerHTML = intelData.map(item => {
        if (item.type === 'video') {
            return `
                <div class="intel-card youtube" data-tilt>
                    <div class="intel-header">
                        <div class="intel-icon"><i class="fab fa-youtube"></i></div>
                        <h4>${item.title}</h4>
                    </div>
                    <p>${item.desc}</p>
                    <div class="video-container">
                        <iframe src="https://www.youtube.com/embed/${item.link}" allowfullscreen></iframe>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="intel-card book" data-tilt>
                    <div class="intel-header">
                        <div class="intel-icon"><i class="fas fa-book"></i></div>
                        <h4>${item.title}</h4>
                    </div>
                    <p>${item.desc}</p>
                    <a href="${item.link}" target="_blank" class="intel-link">
                        View Book <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }).join('');
    
    // Re-init tilt for new cards
    setTimeout(initTiltCards, 100);
}

// ===== ANIMATIONS =====
function animateTitle() {
    const chars = document.querySelectorAll('.main-title-3d .char');
    chars.forEach((char, i) => {
        char.style.setProperty('--i', i);
        gsap.fromTo(char, 
            { opacity: 0, y: 50, rotateX: -90 },
            { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                duration: 0.6,
                delay: i * 0.05,
                ease: "back.out(1.7)"
            }
        );
    });
}

function typeWriter(text, elementId, speed) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    let i = 0;
    el.textContent = '';
    
    function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== NAVIGATION =====
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
}

function closeMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
}

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const btn = document.getElementById('themeBtn');
    const icon = btn.querySelector('i');
    
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// ===== SOUND =====
let isPlaying = false;
const bgMusic = document.getElementById('bgMusic');

function toggleSound() {
    const btn = document.getElementById('soundBtn');
    const icon = btn.querySelector('i');
    
    if (!isPlaying) {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            btn.style.borderColor = '#00ff88';
            btn.style.color = '#00ff88';
            isPlaying = true;
        }).catch(() => {
            alert('Click again to enable audio');
        });
    } else {
        bgMusic.pause();
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        btn.style.borderColor = '#00f0ff';
        btn.style.color = '#00f0ff';
        isPlaying = false;
    }
}

// ===== CHAT =====
const AI_PROMPT = `You are 'Arnav AI', a confident and witty assistant for Arnav Mishra's portfolio. Speak in Hinglish (mix of Hindi and English), keep responses short and punchy. Be helpful but maintain an edgy, cool personality.`;

function toggleChat() {
    const chat = document.getElementById('chatWindow');
    chat.classList.toggle('open');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const body = document.getElementById('chatBody');
    const text = input.value.trim();
    
    if (!text) return;
    
    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerHTML = `
        <div class="msg-avatar" style="background: rgba(255,255,255,0.1);"><i class="fas fa-user"></i></div>
        <div class="msg-content" style="border-bottom-right-radius: 5px; border-bottom-left-radius: 15px;">${text}</div>
    `;
    body.appendChild(userMsg);
    input.value = '';
    body.scrollTop = body.scrollHeight;
    
    // AI response
    fetch(`https://text.pollinations.ai/${encodeURIComponent(AI_PROMPT + "\n\nUser: " + text + "\nArnav AI:")}`)
        .then(res => res.text())
        .then(reply => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.innerHTML = `
                <div class="msg-avatar"><i class="fas fa-robot"></i></div>
                <div class="msg-content">${reply}</div>
            `;
            body.appendChild(botMsg);
            body.scrollTop = body.scrollHeight;
        })
        .catch(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';
            botMsg.innerHTML = `
                <div class="msg-avatar"><i class="fas fa-robot"></i></div>
                <div class="msg-content">Network glitch! Try again 🔌</div>
            `;
            body.appendChild(botMsg);
        });
}

// ===== KR$NA AUDIO =====
function toggleKrsna() {
    const audio = document.getElementById('krsnaAudio');
    const btn = document.getElementById('krsnaPlay');
    const icon = btn.querySelector('i');
    
    if (audio.paused) {
        audio.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    } else {
        audio.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        btn.innerHTML = '<i class="fas fa-play"></i> Play';
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Section headers
    gsap.utils.toArray('.section-header-3d').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    });
    
    // Cards
    gsap.utils.toArray('.card-3d, .verse-3d-card, .intel-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 80,
            rotateX: 15,
            duration: 0.8,
            delay: i * 0.1
        });
    });
}

// ===== NAVBAR SCROLL =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(0,0,0,0.95)';
        navbar.style.padding = '15px 40px';
    } else {
        navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
        navbar.style.padding = '20px 40px';
    }
    
    lastScroll = currentScroll;
});
        
