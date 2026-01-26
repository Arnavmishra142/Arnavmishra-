/* 🪐 ZERO GRAVITY MODULE
   File Name: gravity.js
   Description: Automatically adds a button and physics logic to the site.
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. CSS Styles Inject karna (Button ke liye)
    const style = document.createElement('style');
    style.innerHTML = `
        #gravity-btn {
            position: fixed; top: 20px; right: 80px;
            background: rgba(0, 0, 0, 0.6); 
            border: 1px solid #00ff88;
            color: #fff; padding: 8px 15px; border-radius: 20px;
            cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 0.8rem;
            z-index: 99999; backdrop-filter: blur(5px); transition: 0.3s;
            display: flex; align-items: center; gap: 5px;
            opacity: 0; /* Shuru mein gayab */
            pointer-events: none;
            transition: opacity 1s ease, transform 0.3s ease;
        }
        #gravity-btn:hover { 
            background: #00ff88; 
            color: #000; 
            box-shadow: 0 0 15px rgba(0, 255, 136, 0.5);
            transform: scale(1.05); 
        }
    `;
    document.head.appendChild(style);

    // 2. Button HTML Create karna
    const btn = document.createElement('button');
    btn.id = 'gravity-btn';
    btn.innerHTML = '<i class="fas fa-meteor"></i> Zero Gravity';
    btn.onclick = toggleGravity; // Click hone pe function chalega
    document.body.appendChild(btn);

    // 3. Intro ke baad Button dikhana (4 Second Delay)
    setTimeout(() => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }, 4000);
});

// --- PHYSICS LOGIC ---
let gravityActive = false;
let floatingElements = [];
let animationFrame;

function toggleGravity() {
    if (!gravityActive) {
        // Target Elements dhoondo
        const targets = document.querySelectorAll('.profile-container, .name, .bio-wrap, .btn-grid, .card, .main-btn, .chess-msg-container, .concert-btn, .project-card, .krsna-card, .verse-card');
        
        if(targets.length === 0) return; // Agar kuch load nahi hua to ruk jao

        startGravity(targets);
        
        // Button ka style change karo
        const btn = document.getElementById('gravity-btn');
        btn.innerHTML = '<i class="fas fa-undo"></i> Reset World';
        btn.style.borderColor = '#ff4b4b';
        btn.style.background = 'rgba(255, 75, 75, 0.2)';
    } else {
        location.reload(); // Refresh to reset
    }
}

function startGravity(targets) {
    gravityActive = true;
    
    targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        
        const obj = {
            element: el,
            x: rect.left,
            y: rect.top,
            vx: (Math.random() - 0.5) * 5, // Speed X
            vy: (Math.random() - 0.5) * 5, // Speed Y
            rot: 0,
            vRot: (Math.random() - 0.5) * 2 // Rotation
        };

        // Element ko Free karo
        el.style.position = 'fixed';
        el.style.left = obj.x + 'px';
        el.style.top = obj.y + 'px';
        el.style.width = rect.width + 'px';
        el.style.zIndex = '10000'; // Sabse upar
        el.style.margin = '0';
        el.style.transition = 'none';

        floatingElements.push(obj);
    });

    animateGravity();
}

function animateGravity() {
    if (!gravityActive) return;

    floatingElements.forEach(obj => {
        // Position Update
        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.rot += obj.vRot;

        // Screen Boundaries
        const rect = obj.element.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        if (obj.x <= 0 || obj.x + rect.width >= winW) obj.vx *= -1;
        if (obj.y <= 0 || obj.y + rect.height >= winH) obj.vy *= -1;

        // Apply
        obj.element.style.left = obj.x + 'px';
        obj.element.style.top = obj.y + 'px';
        obj.element.style.transform = `rotate(${obj.rot}deg)`;
    });

    animationFrame = requestAnimationFrame(animateGravity);
}
