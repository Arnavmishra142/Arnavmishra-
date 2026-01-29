/* ========================================
   ARNAV MISHRA - 3D PORTFOLIO
   Three.js & GSAP Powered Experience
   ======================================== */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initThreeJS();
    initGSAPAnimations();
    initNavigation();
    initScrollEffects();
    initInteractiveElements();
    initZeroGravity();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Trigger entrance animations
        setTimeout(() => {
            animateEntrance();
        }, 500);
    }, 2500);
}

// Three.js 3D Scene
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Camera position
    camera.position.z = 30;
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 100;
        posArray[i + 1] = (Math.random() - 0.5) * 100;
        posArray[i + 2] = (Math.random() - 0.5) * 50;
        
        // Color (cyan to magenta gradient)
        const ratio = i / (particlesCount * 3);
        colorArray[i] = ratio * 0.5;     // R
        colorArray[i + 1] = 0.8 + ratio * 0.2; // G
        colorArray[i + 2] = 1 - ratio * 0.5;   // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create floating geometric shapes
    const shapes = [];
    
    // Create cubes
    for (let i = 0; i < 8; i++) {
        const geometry = new THREE.BoxGeometry(
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5,
            Math.random() * 2 + 0.5
        );
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x00d4ff : 0xff00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.set(
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 80,
            (Math.random() - 0.5) * 30
        );
        
        cube.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(cube);
        shapes.push(cube);
    }
    
    // Create spheres
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.SphereGeometry(Math.random() * 1.5 + 0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 20
        );
        
        sphere.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: 0
            },
            floatSpeed: Math.random() * 0.3 + 0.3,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(sphere);
        shapes.push(sphere);
    }
    
    // Create torus rings
    for (let i = 0; i < 4; i++) {
        const geometry = new THREE.TorusGeometry(Math.random() * 3 + 2, 0.2, 8, 20);
        const material = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x00d4ff : 0xff00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const torus = new THREE.Mesh(geometry, material);
        
        torus.position.set(
            (Math.random() - 0.5) * 70,
            (Math.random() - 0.5) * 70,
            (Math.random() - 0.5) * 25
        );
        
        torus.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015
            },
            floatSpeed: Math.random() * 0.4 + 0.4,
            floatOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(torus);
        shapes.push(torus);
    }
    
    // Create connecting lines between particles
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.1
    });
    
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particlesCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });
    
    // Animation loop
    let time = 0;
    let animationId;
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        time += 0.01;
        
        // Smooth camera movement based on mouse
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Animate particles
        particlesMesh.rotation.y = time * 0.05;
        particlesMesh.rotation.x = Math.sin(time * 0.03) * 0.1;
        
        // Animate shapes
        shapes.forEach((shape, index) => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            
            // Floating animation
            shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.02;
        });
        
        // Update connecting lines (connect nearby particles)
        const positions = particlesGeometry.attributes.position.array;
        const linePos = lineGeometry.attributes.position.array;
        let lineIndex = 0;
        const maxDistance = 8;
        const maxConnections = 3;
        
        for (let i = 0; i < particlesCount; i++) {
            let connections = 0;
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];
            
            for (let j = i + 1; j < particlesCount && connections < maxConnections; j++) {
                const x2 = positions[j * 3];
                const y2 = positions[j * 3 + 1];
                const z2 = positions[j * 3 + 2];
                
                const distance = Math.sqrt(
                    Math.pow(x2 - x1, 2) +
                    Math.pow(y2 - y1, 2) +
                    Math.pow(z2 - z1, 2)
                );
                
                if (distance < maxDistance && lineIndex < particlesCount * 6 - 6) {
                    linePos[lineIndex++] = x1;
                    linePos[lineIndex++] = y1;
                    linePos[lineIndex++] = z1;
                    linePos[lineIndex++] = x2;
                    linePos[lineIndex++] = y2;
                    linePos[lineIndex++] = z2;
                    connections++;
                }
            }
        }
        
        // Clear remaining line positions
        for (let i = lineIndex; i < particlesCount * 6; i++) {
            linePos[i] = 0;
        }
        
        lineGeometry.attributes.position.needsUpdate = true;
        lines.rotation.y = time * 0.02;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Store scene reference for zero gravity effect
    window.threeScene = { shapes, particlesMesh, camera, scene };
}

// GSAP Animations
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero title animation
    gsap.from('.hero-title .title-line', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        rotationX: -90,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });
    
    // Hero subtitle
    gsap.from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: 1
    });
    
    // Quote 3D
    gsap.from('.quote-3d', {
        duration: 1.2,
        scale: 0.8,
        opacity: 0,
        rotationY: -30,
        ease: 'back.out(1.7)',
        delay: 1.2
    });
    
    // Hero buttons
    gsap.from('.hero-buttons .btn-3d', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.5
    });
    
    // Section titles on scroll
    gsap.utils.toArray('.section-title-3d').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
    });
    
    // Social cards
    gsap.from('.social-card-3d', {
        scrollTrigger: {
            trigger: '.social-grid',
            start: 'top 80%'
        },
        duration: 0.8,
        y: 80,
        opacity: 0,
        rotationY: -30,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });
    
    // About cards
    gsap.from('.about-card-3d', {
        scrollTrigger: {
            trigger: '.about-content-3d',
            start: 'top 80%'
        },
        duration: 1,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Picks items
    gsap.from('.pick-item-3d', {
        scrollTrigger: {
            trigger: '.picks-grid-3d',
            start: 'top 80%'
        },
        duration: 0.8,
        scale: 0.5,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });
    
    // Special links
    gsap.from('.special-link-3d', {
        scrollTrigger: {
            trigger: '.links-container',
            start: 'top 80%'
        },
        duration: 1,
        x: -100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Verse ring
    gsap.from('.verse-ring', {
        scrollTrigger: {
            trigger: '.verse-content-3d',
            start: 'top 80%'
        },
        duration: 1.5,
        scale: 0,
        opacity: 0,
        rotation: 720,
        ease: 'back.out(1.7)'
    });
    
    // Parallax effect for floating elements
    gsap.to('.floating-cube', {
        scrollTrigger: {
            trigger: '.hero-3d',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -200,
        rotation: 360
    });
    
    gsap.to('.floating-sphere', {
        scrollTrigger: {
            trigger: '.hero-3d',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -150,
        scale: 1.5
    });
    
    gsap.to('.floating-ring', {
        scrollTrigger: {
            trigger: '.hero-3d',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -250,
        rotation: -360
    });
}

// Navigation
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');
    
    // Mobile toggle
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Smooth scroll for nav links
    navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: targetSection, offsetY: 80 },
                    ease: 'power3.inOut'
                });
            }
            
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar background on scroll
    const nav = document.querySelector('.nav-3d');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.8)';
            nav.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// Scroll Effects
function initScrollEffects() {
    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.social-card-3d, .about-card-3d, .pick-item-3d, .special-link-3d');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// Interactive Elements
function initInteractiveElements() {
    // 3D Tilt effect for cards
    const cards = document.querySelectorAll('.social-card-3d, .pick-item-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn-3d');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Magnetic effect for social cards
    const socialCards = document.querySelectorAll('.social-card-3d');
    
    socialCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(card, {
                duration: 0.3,
                x: x * 0.1,
                y: y * 0.1,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                x: 0,
                y: 0,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// Zero Gravity Effect
function initZeroGravity() {
    const zeroGravityBtn = document.getElementById('zero-gravity');
    let isZeroGravity = false;
    
    zeroGravityBtn?.addEventListener('click', () => {
        isZeroGravity = !isZeroGravity;
        
        if (isZeroGravity) {
            // Activate zero gravity
            zeroGravityBtn.innerHTML = '<span class="btn-text">Normal Gravity</span><i class="fas fa-compress"></i>';
            zeroGravityBtn.style.background = 'var(--secondary-color)';
            
            // Animate shapes to float freely
            if (window.threeScene) {
                window.threeScene.shapes.forEach((shape, index) => {
                    gsap.to(shape.position, {
                        duration: 2,
                        x: (Math.random() - 0.5) * 100,
                        y: (Math.random() - 0.5) * 100,
                        z: (Math.random() - 0.5) * 50,
                        ease: 'power2.inOut'
                    });
                    
                    gsap.to(shape.rotation, {
                        duration: 3,
                        x: Math.random() * Math.PI * 4,
                        y: Math.random() * Math.PI * 4,
                        z: Math.random() * Math.PI * 4,
                        ease: 'power2.inOut'
                    });
                });
                
                // Speed up particles
                gsap.to(window.threeScene.particlesMesh.rotation, {
               
