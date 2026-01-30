document.addEventListener('DOMContentLoaded', () => {
    // 1. INJECT HTML STRUCTURE (DHANCHA) AUTOMATICALLY
    // Isse tujhe index.html mein gandagi nahi karni padegi
    const aiHTML = `
        <div id="ai-wrapper">
            <div id="chat-interface">
                <div class="chat-header">
                    <span class="ai-name">CORE_SYSTEM // V1</span>
                    <div class="status-dot"></div>
                </div>
                <div id="ai-messages">
                    <div class="msg ai">Reactor Online. Systems Nominal. ☢️</div>
                </div>
                <div class="ai-input-area">
                    <input type="text" class="ai-input" id="ai-user-input" placeholder="Enter command...">
                    <button class="ai-send-btn" id="ai-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="ai-canvas-container" title="Access Core"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', aiHTML);

    // 2. INITIALIZE THREE.JS (THE REACTOR LOOK)
    initReactor();
    
    // 3. INITIALIZE CHAT LOGIC
    initChat();
});

function initReactor() {
    const container = document.getElementById('ai-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(90, 90);
    container.appendChild(renderer.domElement);

    // --- REACTOR DESIGN ---
    // Core (Energy Source)
    const coreGeo = new THREE.OctahedronGeometry(0.6, 0);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Ring 1 (Cyan)
    const ringGeo1 = new THREE.TorusGeometry(1.4, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.8 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    scene.add(ring1);

    // Ring 2 (Pink)
    const ringGeo2 = new THREE.TorusGeometry(1.1, 0.05, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    scene.add(ring2);

    camera.position.z = 3.5;

    // Animation Variables
    window.aiState = { isThinking: false, speed: 0.02 };

    function animate() {
        requestAnimationFrame(animate);

        const { isThinking, speed } = window.aiState;

        // Complex Gyroscope Rotation
        core.rotation.y += speed * 2;
        core.rotation.z += speed;
        ring1.rotation.x += speed;
        ring1.rotation.y += speed * 0.5;
        ring2.rotation.x -= speed * 0.5;
        ring2.rotation.y += speed;

        // Visual Feedback
        if (isThinking) {
            core.scale.set(0.8, 0.8, 0.8);
            core.material.color.setHex(0xff0055); // Red Alert
        } else {
            const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.1;
            core.scale.set(pulse, pulse, pulse);
            core.material.color.setHex(0xffffff); // Stable White
        }

        renderer.render(scene, camera);
    }
    animate();
}

function initChat() {
    const chatInterface = document.getElementById('chat-interface');
    const container = document.getElementById('ai-canvas-container');
    const input = document.getElementById('ai-user-input');
    const btn = document.getElementById('ai-send-btn');
    const msgArea = document.getElementById('ai-messages');
    let isOpen = false;

    // Toggle Chat
    container.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatInterface.classList.add('active');
            window.aiState.speed = 0.08; // Fast Spin
        } else {
            chatInterface.classList.remove('active');
            window.aiState.speed = 0.02; // Idle
        }
    });

    // Send Logic
    function send() {
        const text = input.value.trim();
        if (!text) return;

        // User Msg
        addMsg(text, 'user');
        input.value = '';

        // Thinking Effect
        window.aiState.isThinking = true;
        window.aiState.speed = 0.2;

        // Fake Reply (Replace with API later)
        setTimeout(() => {
            window.aiState.isThinking = false;
            window.aiState.speed = 0.08;
            
            const replies = [
                "Scanning sectors... 🛸",
                "Processing data... 100%",
                "Systems functioning within normal parameters.",
                "Access granted. How can I help?"
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            addMsg(reply, 'ai');
        }, 1500);
    }

    function addMsg(text, type) {
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.innerText = text;
        msgArea.appendChild(div);
        msgArea.scrollTop = msgArea.scrollHeight;
    }

    btn.addEventListener('click', send);
    input.addEventListener('keypress', (e) => e.key === 'Enter' && send());
}
