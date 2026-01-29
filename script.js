// ===== DATA =====
const picksData = [
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
        title: 'Steve Jobs\' Stanford Speech',
        desc: 'Stay hungry, stay foolish. The speech that inspired millions.',
        link: 'UF8uR6Z6KLc'
    }
];

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

// ===== LOADING =====
window.addEventListener('load', () => {
    // Hide loader after 2 seconds
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
        
        // Start typing animation
        typeWriter('Building ideas from scratch.', 'tagline', 80);
        
        // Load verses
        document.getElementById('verse1').textContent = verses.verse1;
        document.getElementById('verse2').textContent = verses.verse2;
        
        // Load picks
        loadPicks();
    }, 2000);
});

// ===== TYPEWRITER =====
function typeWriter(text, elementId, speed) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    let i = 0;
    el.textContent = '';
    
    const interval = setInterval(() => {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, speed);
}

// ===== NAVIGATION =====
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

function showHome() {
    switchView('home-view');
}

function showAbout() {
    switchView('about-view');
}

function showPicks() {
    switchView('picks-view');
}

function switchView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== THEME =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = document.getElementById('theme-icon');
    
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== SOUND =====
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

function toggleSound() {
    const icon = document.getElementById('sound-icon');
    const btn = document.getElementById('sound-btn');
    
    if (!isPlaying) {
        bgMusic.volume = 0.3;
        bgMusic.play().then(() => {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            btn.style.borderColor = '#00ff88';
            btn.style.color = '#00ff88';
            isPlaying = true;
        }).catch(() => {
            alert('Click again to enable sound');
        });
    } else {
        bgMusic.pause();
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
        btn.style.borderColor = '#00a3ff';
        btn.style.color = '#00a3ff';
        isPlaying = false;
    }
}

// ===== CHAT =====
const SYSTEM_PROMPT = `You are 'Arnav AI', a confident and witty assistant. Speak in Hinglish (mix of Hindi and English), keep responses short and punchy.`;

function toggleChat() {
    const chat = document.getElementById('chat-window');
    chat.classList.toggle('show');
}

function sendChat() {
    const input = document.getElementById('chat-input-field');
    const body = document.getElementById('chat-body');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = text;
    body.appendChild(userMsg);
    
    input.value = '';
    body.scrollTop = body.scrollHeight;
    
    // Get AI response
    fetch(`https://text.pollinations.ai/${encodeURIComponent(SYSTEM_PROMPT + "\n\nUser: " + text + "\nArnav AI:")}`)
        .then(res => res.text())
        .then(reply => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg bot';
            botMsg.textContent = reply;
            body.appendChild(botMsg);
            body.scrollTop = body.scrollHeight;
        })
        .catch(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-msg bot';
            botMsg.textContent = 'Network issue, try again! 🛜';
            body.appendChild(botMsg);
        });
}

// ===== KR$NA AUDIO =====
function toggleKrsna() {
    const audio = document.getElementById('krsna-audio');
    const btn = document.getElementById('krsna-play');
    const icon = btn.querySelector('i');
    
    if (audio.paused) {
        audio.play();
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        audio.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

// ===== LOAD PICKS =====
function loadPicks() {
    const container = document.getElementById('picks-container');
    if (!container) return;
    
    container.innerHTML = picksData.map(pick => {
        if (pick.type === 'video') {
            return `
                <div class="pick-card youtube">
                    <div class="pick-header">
                        <i class="fab fa-youtube"></i>
                        <h4>${pick.title}</h4>
                    </div>
                    <p>${pick.desc}</p>
                    <div class="video-wrap">
                        <iframe src="https://www.youtube.com/embed/${pick.link}" allowfullscreen></iframe>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="pick-card book">
                    <div class="pick-header">
                        <i class="fas fa-book"></i>
                        <h4>${pick.title}</h4>
                    </div>
                    <p>${pick.desc}</p>
                    <a href="${pick.link}" target="_blank" class="pick-link">
                        View Book <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }).join('');
}

// ===== SMOOTH SCROLL FOR ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
       
