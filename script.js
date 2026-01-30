document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Arnav Mishra 3D Portfolio Loaded!');
    initLoader();
    initNavigation();
    initParticles();
    initThreeJS();
    initZeroGravity();
    initAIAssistant();
});

function initLoader() {
    const loader = document.getElementById('loading');
    setTimeout(function() {
        loader.classList.add('hidden');
    }, 1500);
}

function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
    
    const nav = document.querySelector('.nav-3d');
    window.addEventListener('scroll', function() {
        if (nav) {
            nav.style.background = window.scrollY > 50 ? 'rgba(5, 5, 5, 0.98)' : 'rgba(5, 5, 5, 0.9)';
        }
    });
}

function initParticles() {
    const container = document.getElementById('particles-fallback');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        const colors = ['#00d4ff', '#ff00ff', '#ffff00'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(particle);
    }
}

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') {
        if (canvas) canvas.style.display = 'none';
        return;
    }
    
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 30;
        
        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 80;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.2, 
            color: 0x00d4ff, 
            transparent: true, 
            opacity: 0.6, 
            blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Shapes
        const shapes = [];
        for (let i = 0; i < 6; i++) {
            let geometry;
            if (i % 3 === 0) geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            else if (i % 3 === 1) geometry = new THREE.SphereGeometry(1, 16, 16);
            else geometry = new THREE.TorusGeometry(1.5, 0.3, 8, 20);
            
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00d4ff : 0xff00ff, 
                wireframe: true, 
                transparent: true, 
                opacity: 0.3
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 60, 
                (Math.random() - 0.5) * 60, 
                (Math.random() - 0.5) * 20
            );
            mesh.userData = { 
                rotX: (Math.random() - 0.5) * 0.02, 
                rotY: (Math.random() - 0.5) * 0.02
            };
            scene.add(mesh);
            shapes.push(mesh);
        }
        
        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        
        // Animation
        let time = 0;
        let isActive = true;
        
        function animate() {
            if (!isActive) return;
            requestAnimationFrame(animate);
            time += 0.01;
            
            camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            particlesMesh.rotation.y = time * 0.05;
            particlesMesh.rotation.x = Math.sin(time * 0.03) * 0.1;
            
            shapes.forEach(function(shape) {
                shape.rotation.x += shape.userData.rotX;
                shape.rotation.y += shape.userData.rotY;
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Visibility handler
        document.addEventListener('visibilitychange', function() {
            isActive = !document.hidden;
            if (isActive) animate();
        });
        
        // Store for zero gravity
        window.threeScene = { shapes, particlesMesh };
        
    } catch (error) {
        console.log('Three.js error:', error);
        canvas.style.display = 'none';
    }
}

function initZeroGravity() {
    const btn = document.getElementById('zero-gravity');
    if (!btn) return;
    
    let isZeroGravity = false;
    
    btn.addEventListener('click', function() {
        isZeroGravity = !isZeroGravity;
        
        if (isZeroGravity) {
            btn.classList.add('active');
            btn.innerHTML = '<span>Normal Gravity</span><i class="fas fa-compress"></i>';
            document.body.classList.add('zero-gravity');
            
            // Speed up Three.js shapes
            if (window.threeScene && window.threeScene.shapes) {
                window.threeScene.shapes.forEach(function(shape) {
                    shape.userData.rotX *= 10;
                    shape.userData.rotY *= 10;
                });
            }
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<span>Zero Gravity</span><i class="fas fa-rocket"></i>';
            document.body.classList.remove('zero-gravity');
            
            // Slow down Three.js shapes
            if (window.threeScene && window.threeScene.shapes) {
                window.threeScene.shapes.forEach(function(shape) {
                    shape.userData.rotX /= 10;
                    shape.userData.rotY /= 10;
                });
            }
        }
    });
}

function initAIAssistant() {
    const aiOrb = document.getElementById('ai-orb');
    const aiModal = document.getElementById('ai-modal');
    const aiClose = document.getElementById('ai-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiChat = document.getElementById('ai-chat');
    const aiTyping = document.getElementById('ai-typing');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    if (!aiOrb || !aiModal) return;

    // Toggle modal
    aiOrb.addEventListener('click', function(e) {
        e.stopPropagation();
        aiModal.classList.toggle('active');
        if (aiModal.classList.contains('active')) {
            setTimeout(() => aiInput.focus(), 300);
        }
    });

    aiClose.addEventListener('click', function() {
        aiModal.classList.remove('active');
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!aiModal.contains(e.target) && !aiOrb.contains(e.target) && aiModal.classList.contains('active')) {
            aiModal.classList.remove('active');
        }
    });

    // Send message
    function sendMessage(text) {
        if (!text.trim()) return;
        
        // Add user message
        addMessage(text, 'user');
        aiInput.value = '';
        
        // Show typing
        aiTyping.classList.add('active');
        aiChat.scrollTop = aiChat.scrollHeight;
        
        // Generate response
        setTimeout(() => {
            aiTyping.classList.remove('active');
            const response = generateAIResponse(text);
            addMessage(response, 'ai');
        }, 1000 + Math.random() * 500);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message ' + (sender === 'user' ? 'user' : '');
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
            </div>
            <span class="message-time">${time}</span>
        `;
        
        aiChat.appendChild(messageDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }

    function generateAIResponse(input) {
        const lower = input.toLowerCase();
        
        if (lower.includes('who') || lower.includes('you')) {
            return "🚀 I'm Arnav Mishra, a passionate developer and creator building the future through code!";
        }
        else if (lower.includes('skill') || lower.includes('code')) {
            return "💻 My skills: Three.js, React, Node.js, 3D Design, Creative Coding & Web Development!";
        }
        else if (lower.includes('contact') || lower.includes('reach')) {
            return "📱 Connect via WhatsApp 'Say Hello' button, or find me on LinkedIn, X/Twitter & Instagram!";
        }
        else if (lower.includes('verse') || lower.includes('universe')) {
            return "🌌 ARNAV VERSE is my digital universe where creativity meets technology!";
        }
        else if (lower.includes('chess')) {
            return "♟️ Yes! Challenge me on Chess.com - username: Arnavm142";
        }
        else if (lower.includes('hello') || lower.includes('hi')) {
            return "👋 Hey! Welcome to my portfolio! Ask me about my skills, projects, or anything!";
        }
        else if (lower.includes('project')) {
            return "🔥 Check out 'ENTER THE UPSIDE DOWN' and 'Enter Live Concert' links for my special projects!";
        }
        else {
            return "🤔 Interesting! Try asking about my skills, projects, or click 'Zero Gravity' for a wild ride!";
        }
    }

    // Event listeners
    aiSend.addEventListener('click', function() {
        sendMessage(aiInput.value);
    });
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage(aiInput.value);
    });

    // Suggestion chips
    suggestionChips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            sendMessage(this.dataset.question);
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) { 
            e.preventDefault(); 
            target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
        }
    });
});

console.log('%c🚀 Arnav Mishra 3D Portfolio', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
console.log('%c🤖 AI Assistant Ready!', 'font-size: 14px; color: #00ff88;');
