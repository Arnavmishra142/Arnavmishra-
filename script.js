document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Arnav Mishra 3D Portfolio Loaded!');
    initLoader();
    initNavigation();
    initParticles();
    initThreeJS();
    initScrollAnimations();
    initZeroGravity();
    initClickEffects();
    initAIAssistant();
    init3DSocialCards();
});

function initLoader() {
    const loader = document.getElementById('loading');
    setTimeout(function() {
        loader.classList.add('hidden');
        setTimeout(animateEntrance, 300);
    }, 1500);
}

function animateEntrance() {
    const titleLines = document.querySelectorAll('.title-line');
    const subtitle = document.querySelector('.hero-subtitle');
    const quote = document.querySelector('.quote-3d');
    const buttons = document.querySelectorAll('.hero-buttons .btn-3d');
    
    titleLines.forEach(function(line, index) {
        line.style.opacity = '0';
        line.style.transform = 'translateY(50px)';
        setTimeout(function() {
            line.style.transition = 'all 0.8s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    if (subtitle) {
        subtitle.style.opacity = '0';
        setTimeout(function() {
            subtitle.style.transition = 'opacity 0.6s ease';
            subtitle.style.opacity = '1';
        }, 500);
    }
    
    if (quote) {
        quote.style.opacity = '0';
        quote.style.transform = 'scale(0.9)';
        setTimeout(function() {
            quote.style.transition = 'all 0.8s ease';
            quote.style.opacity = '1';
            quote.style.transform = 'scale(1)';
        }, 700);
    }
    
    buttons.forEach(function(btn, index) {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(30px)';
        setTimeout(function() {
            btn.style.transition = 'all 0.6s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 900 + index * 150);
    });
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
        nav.style.background = window.scrollY > 50 ? 'rgba(5, 5, 5, 0.98)' : 'rgba(5, 5, 5, 0.9)';
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
        
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 80;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.2, color: 0x00d4ff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        const shapes = [];
        for (let i = 0; i < 6; i++) {
            let geometry;
            if (i % 3 === 0) geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            else if (i % 3 === 1) geometry = new THREE.SphereGeometry(1, 16, 16);
            else geometry = new THREE.TorusGeometry(1.5, 0.3, 8, 20);
            
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00d4ff : 0xff00ff, wireframe: true, transparent: true, opacity: 0.3
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 20);
            mesh.userData = { rotX: (Math.random() - 0.5) * 0.02, rotY: (Math.random() - 0.5) * 0.02, floatSpeed: 0.5 + Math.random() * 0.5, floatOffset: Math.random() * Math.PI * 2 };
            scene.add(mesh);
            shapes.push(mesh);
        }
        
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', function(e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        
        let time = 0, isActive = true;
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
                shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.02;
            });
            
            renderer.render(scene, camera);
        }
        animate();
        
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        document.addEventListener('visibilitychange', function() {
            isActive = !document.hidden;
            if (isActive) animate();
        });
        
        window.threeScene = { shapes, particlesMesh };
    } catch (error) {
        console.log('Three.js error:', error);
        canvas.style.display = 'none';
    }
}

function initScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.social-card-3d, .about-card-3d, .pick-item-3d, .special-link-3d, .section-title-3d').forEach(function(el, index) {
        el.classList.add('fade-in');
        el.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
}

function initZeroGravity() {
    const btn = document.getElementById('zero-gravity');
    if (!btn) return;
    
    let isZeroGravity = false;
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('i');
    
    btn.addEventListener('click', function() {
        isZeroGravity = !isZeroGravity;
        
        if (isZeroGravity) {
            btn.classList.add('active');
            if (btnText) btnText.textContent = 'Normal Gravity';
            if (btnIcon) btnIcon.className = 'fas fa-compress';
            document.body.classList.add('zero-gravity');
            
            // Enhance Three.js shapes
            if (window.threeScene && window.threeScene.shapes) {
                window.threeScene.shapes.forEach(function(shape) {
                    shape.userData.originalRotX = shape.userData.rotX;
                    shape.userData.originalRotY = shape.userData.rotY;
                    shape.userData.rotX *= 8;
                    shape.userData.rotY *= 8;
                    
                    // Add random velocity for floating effect
                    shape.userData.velocityX = (Math.random() - 0.5) * 0.5;
                    shape.userData.velocityY = (Math.random() - 0.5) * 0.5;
                    shape.userData.velocityZ = (Math.random() - 0.5) * 0.3;
                });
            }
            
            // Enhance particles
            if (window.threeScene && window.threeScene.particlesMesh) {
                window.threeScene.particlesMesh.userData.originalSpeed = 0.05;
            }
            
        } else {
            btn.classList.remove('active');
            if (btnText) btnText.textContent = 'Zero Gravity';
            if (btnIcon) btnIcon.className = 'fas fa-rocket';
            document.body.classList.remove('zero-gravity');
            
            // Restore Three.js shapes
            if (window.threeScene && window.threeScene.shapes) {
                window.threeScene.shapes.forEach(function(shape) {
                    if (shape.userData.originalRotX) {
                        shape.userData.rotX = shape.userData.originalRotX;
                        shape.userData.rotY = shape.userData.originalRotY;
                    }
                    delete shape.userData.velocityX;
                    delete shape.userData.velocityY;
                    delete shape.userData.velocityZ;
                });
            }
        }
    });
}

function initClickEffects() {
    document.addEventListener('click', function(e) {
        const colors = ['#00d4ff', '#ff00ff', '#ffff00'];
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = 'position: fixed; width: 6px; height: 6px; background: ' + colors[Math.floor(Math.random() * colors.length)] + '; border-radius: 50%; pointer-events: none; z-index: 9999; left: ' + e.clientX + 'px; top: ' + e.clientY + 'px;';
            document.body.appendChild(particle);
            const angle = (i / 8) * Math.PI * 2;
            const distance = 40 + Math.random() * 40;
            particle.animate([{ transform: 'translate(0, 0) scale(1)', opacity: 1 }, { transform: 'translate(' + Math.cos(angle) * distance + 'px, ' + Math.sin(angle) * distance + 'px) scale(0)', opacity: 0 }], { duration: 600, easing: 'ease-out' }).onfinish = function() { particle.remove(); };
        }
    });
}

// 3D Social Cards Tilt Effect
function init3DSocialCards() {
    const cards = document.querySelectorAll('.social-card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0)';
        });
    });
}

// AI Assistant
function initAIAssistant() {
    const aiOrb = document.getElementById('ai-orb');
    const aiModal = document.getElementById('ai-modal');
    const aiClose = document.getElementById('ai-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiChat = document.getElementById('ai-chat');
    const aiTyping = document.getElementById('ai-typing');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Toggle modal
    aiOrb.addEventListener('click', function() {
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
        showTyping();
        
        // Generate response
        setTimeout(() => {
            hideTyping();
            const response = generateAIResponse(text);
            addMessage(response, 'ai');
        }, 1000 + Math.random() * 1000);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender === 'user' ? 'user' : ''}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const avatar = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${text}</p>
                </div>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        aiChat.appendChild(messageDiv);
        aiChat.scrollTop = aiChat.scrollHeight;
    }

    // Show/hide typing
    function showTyping() {
        aiTyping.classList.add('active');
        aiChat.scrollTop = aiChat.scrollHeight;
    }

    function hideTyping() {
        aiTyping.classList.remove('active');
    }

    // AI Response Logic
    function generateAIResponse(input) {
        const lower = input.toLowerCase();
        
        const responses = {
            'who': "🚀 I'm Arnav Mishra, a passionate developer and creator building the future through code. I transform ideas into reality and push the boundaries of what's possible!",
            
            'skill': "💻 My expertise includes web development, 3D design, creative coding, and building immersive digital experiences. I work with Three.js, React, Node.js, and love experimenting with new tech!",
            
            'contact': "📱 You can reach me through WhatsApp by clicking the 'Say Hello' button, or connect with me on LinkedIn, X/Twitter, or Instagram. I'd love to hear from you!",
            
            'verse': "🌌 ARNAV VERSE is my digital universe where creativity meets technology. It's a space where I showcase my projects, ideas, and the boundaries I push!",
            
            'project': "🔥 I'm constantly working on new projects! Check out my 'ENTER THE UPSIDE DOWN' and 'Enter Live Concert' links for special experiences I've built!",
            
            'chess': "♟️ Yes, I play chess! You can challenge me on Chess.com - my username is Arnavm142. Let's have a match!",
            
            'hello': "👋 Hey there! Ready to explore my digital universe? Ask me anything about my work, skills, or just say hi!",
            
            'hi': "🚀 Greetings, traveler of the digital realm! How can I assist you today?",
            
            'default': "🤔 That's an interesting question! While I process that, why not check out my social links or try the 'Zero Gravity' button for a wild ride? You can also ask me about my skills, projects, or how to connect!"
        };
        
        for (let key in responses) {
            if (lower.includes(key)) return responses[key];
        }
        
        return responses['default'];
    }

    // Event listeners
    aiSend.addEventListener('click', () => sendMessage(aiInput.value));
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage(aiInput.value);
    });

    // Suggestion chips
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            sendMessage(this.dataset.question);
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

console.log('%c🚀 Arnav Mishra 3D Portfolio', 'font-size: 24px; font-weight: bold; color: #00d4ff;');
console.log('%cBuilt with pure awesomeness 💀', 'font-size: 14px; color: #ff00ff;');
console.log('%c🤖 AI Assistant Ready!', 'font-size: 14px; color: #00ff88;');
console.log('%cClick "Zero Gravity" for a wild ride!', 'font-size: 12px; color: #ffff00;');
        
