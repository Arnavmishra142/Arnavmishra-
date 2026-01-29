// ===== CONFIG =====
const CONFIG = {
    loaderDuration: 2500,
    typingSpeed: 60,
    particlesCount: 30,
    isTouchDevice: window.matchMedia('(pointer: coarse)').matches
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

const taglines = [
    'Building ideas from scratch.',
    'Code. Create. Conquer.',
    'Turning dreams into reality.',
    'Full Stack Developer.',
    'Problem Solver.'
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
    initNavigation();
    initChat();
    initThemeToggle();
    initSoundToggle();
    initKrsnaPlayer();
    initCTAButton();
    initTitleAnimation();
});

// ===== LOADER =====
function initLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            
            // Start animations after loader
            setTimeout(() => {
                animateTitle();
                typeWriter(taglines[0], 'tagline', CONFIG.typingSpeed);
                populateVerses();
            }, 500);
        }
    }, CONFIG.loaderDuration);
}

// ===== THREE.JS BACKGROUND =====
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;
    
    // Check for WebGL support
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.warn('WebGL not supported, falling back to CSS background');
        canvas.style.display = 'none';
        return;
    }
    
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
    
    camera.position.z = 5;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
    
    // Animation
    let animationId;
    let isVisible = true;
    
    function animate() {
        if (!isVisible) return;
        
        animationId = requestAnimationFrame(animate);
        
        // Smooth mouse following
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // Mouse parallax
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Visibility handling
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
        }
    });
    
    // Resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 100);
    }, { passive: true });
}

// ===== PARTICLES =====
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
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
    if (CONFIG.isTouchDevice) return;
    
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    let isActive = true;
    let inactivityTimeout;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Reset inactivity
        isActive = true;
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            isActive = false;
        }, 100);
    }, { passive: true });
    
    function animateCursor() {
        if (!isActive) {
            requestAnimationFrame(animateCursor);
            return;
        }
        
        // Smooth follow
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, [data-tilt]');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = '#ff00ff';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
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
    
    if (!profile || !card) return;
    
    let isFlipped = false;
    
    // 3D tilt on mouse move (desktop only)
    if (!CONFIG.isTouchDevice) {
        profile.addEventListener('mousemove', (e) => {
            if (isFlipped) return;
            
            const rect = profile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }, { passive: true });
        
        profile.addEventListener('mouseleave', () => {
            if (!isFlipped) {
                card.style.transform = 'rotateX(0) rotateY(0)';
            }
        });
    }
    
    // Click to flip
    profile.addEventListener('click', () => {
        isFlipped = !isFlipped;
        
        if (isFlipped) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
            card.style.transform = 'rotateX(0) rotateY(0)';
        }
    });
}

// ===== TILT CARDS =====
function initTiltCards() {
    if (CONFIG.isTouchDevice) return;
    
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
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
        }, { passive: true });
        
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
                        <iframe src="https://www.youtube.com/embed/${item.link}" 
                                allowfullscreen 
                                loading="lazy"
                                title="${item.title}"></iframe>
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
                    <a href="${item.link}" target="_blank" rel="noopener" class="intel-link">
                        View Book <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }).join('');
    
    // Re-init tilt for new cards
    setTimeout(initTiltCards, 100);
}

// ===== TITLE ANIMATION =====
function initTitleAnimation() {
    const titleEl = document.getElementById('mainTitle');
    if (!titleEl) return;
    
    const name = 'ARNAV MISHRA';
    let html = '';
    
    for (let i = 0; i < name.length; i++) {
        if (name[i] === ' ') {
            html += '<span class="space"></span>';
        } else {
            html += `<span class="char" style="--i: ${i}">${name[i]}</span>`;
        }
    }
    
    titleEl.innerHTML = html;
}

function animateTitle() {
    const chars = document.querySelectorAll('.main-title-3d .char');
    
    chars.forEach((char, i) => {
        setTimeout(() => {
            char.classList.add('visible');
        }, i * 50);
    });
}

// ===== TYPEWRITER =====
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

// ===== POPULATE VERSES =====
function populateVerses() {
    const verse1 = document.getElementById('verse1');
    const verse2 = document.getElementById('verse2');
    
    if (verse1) verse1.textContent = verses.verse1;
    if (verse2) verse2.textContent = verses.verse2;
}

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navbar = document.getElementById('navbar');
    
    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });
        
        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (navbar) {
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(0,0,0,0.95)';
                navbar.style.padding = '15px 40px';
            } else {
                navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
                navbar.style.padding = '20px 40px';
            }
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ===== CTA BUTTON =====
function initCTAButton() {
    const ctaBtn = document.getElementById('ctaBtn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const workSection = document.getElementById('work');
            if (workSection) {
                workSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===== CHAT =====
function initChat() {
    const chatTrigger = document.getElementById('chatTrigger');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatBody = document.getElementById('chatBody');
    
    if (!chatTrigger || !chatWindow) return;
    
    // Toggle chat
    chatTrigger.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });
    
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });
    }
    
    // Send message
    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        // User message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.innerHTML = `
            <div class="msg-avatar" style="background: rgba(255,255,255,0.1);"><i class="fas fa-user"></i></div>
            <div class="msg-content">${escapeHtml(text)}</div>
        `;
        chatBody.appendChild(userMsg);
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // AI response
        const AI_PROMPT = `You are 'Arnav AI', a confident and witty assistant for Arnav Mishra's portfolio. Speak in Hinglish (mix of Hindi and English), keep responses short and punchy. Be helpful but maintain an edgy, cool personality.`;
        
        fetch(`https://text.pollinations.ai/${encodeURIComponent(AI_PROMPT + "\n\nUser: " + text + "\nArnav AI:")}`)
            .then(res => res.text())
            .then(reply => {
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot';
                botMsg.innerHTML = `
                    <div class="msg-avatar"><i class="fas fa-robot"></i></div>
                    <div class="msg-content">${escapeHtml(reply)}</div>
                `;
                chatBody.appendChild(botMsg);
                chatBody.scrollTop = chatBody.scrollHeight;
            })
            .catch(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot';
                botMsg.innerHTML = `
                    <div class="msg-avatar"><i class="fas fa-robot"></i></div>
                    <div class="msg-content">Network glitch! Try again 🔌</div>
                `;
                chatBody.appendChild(botMsg);
                chatBody.scrollTop = chatBody.scrollHeight;
            });
    }
    
    if (sendMessage) {
        sendMessage.addEventListener('click', handleSend);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSend();
            }
        });
    }
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeBtn = document.getElementById('themeBtn');
    if (!themeBtn) return;
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeBtn.querySelector('i');
        
        if (document.body.classList.contains('light-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
}

// ===== SOUND TOGGLE =====
function initSoundToggle() {
    const soundBtn = document.getElementById('soundBtn');
    const bgMusic = document.getElementById('bgMusic');
    if (!so
