// ===== CONFIG =====
const isMobile = window.innerWidth <= 768;

const CONFIG = {
    loaderDuration: 2000,
    typingSpeed: 50,
    // Reduce particles on mobile to prevent glitching/lag
    particlesCount: isMobile ? 15 : 40, 
    threeJsParticles: isMobile ? 300 : 800
};

// ... [Keep your Verses and Intel Data same as before] ...

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initThreeJS();
    initParticles();
    if (!isMobile) initCursor(); // Only Init cursor on PC
    initClock();
    initProfileFlip();
    
    // Disable Tilt on mobile to prevent scrolling issues
    if (!isMobile) initTiltCards(); 
    
    initIntelCards();
    initScrollAnimations();
    
    // Add Nav Toggle Logic
    document.getElementById('navToggle').addEventListener('click', toggleMenu);
});

// ===== UPDATED THREE.JS (Responsive) =====
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile }); // Turn off antialias on mobile for speed
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(CONFIG.threeJsParticles * 3);
    
    for (let i = 0; i < CONFIG.threeJsParticles * 3; i++) {
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
    
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.0005;
        if (!isMobile) {
            particlesMesh.rotation.x += 0.0002; // Simplify animation on mobile
        }
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ===== UPDATED NAV TOGGLE =====
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('navToggle');
    menu.classList.toggle('open');
    
    // Simple Hamburger Animation
    if (menu.classList.contains('open')) {
        toggle.children[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        toggle.children[1].style.opacity = "0";
        toggle.children[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
        toggle.children[0].style.transform = "none";
        toggle.children[1].style.opacity = "1";
        toggle.children[2].style.transform = "none";
    }
}

// ... [Keep the rest of your functions: initLoader, typeWriter, etc.] ...
