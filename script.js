/* --- VARIABLES --- */
var globalAudio = document.getElementById("global-bg-music");
var gameAudio = document.getElementById("game-bg-music");
var btn = document.getElementById("mute-btn");
var currentMode = 'home';
var isMuted = true;
var board = null;
var game = null;
var $status = $('#status');
var typingInterval;

/* --- POPUP & ANIMATION TRIGGER --- */
window.onload = function() {
    setTimeout(function() {
        var popup = document.getElementById("music-popup");
        if(popup) popup.classList.add("active");
    }, 2000); 
};

function closePopup() {
    var popup = document.getElementById("music-popup");
    if(popup) {
        popup.classList.remove("active");
        setTimeout(function(){ 
            popup.style.display = "none";
            // MAGIC FIX: Animation starts ONLY after popup closes
            const bio = document.querySelector('.bio');
            if(bio) {
                bio.style.width = "0"; // Reset
                bio.style.animation = "typing 3.5s steps(30, end) forwards, blink-caret .75s step-end infinite";
            }
        }, 800);
    }
}

/* --- READ MORE --- */
function readMoreVerses() {
    if(confirm("Do you want to visit Instagram to read the full masterpiece? ✍️\n(Click OK to visit)")) {
        window.open("https://www.instagram.com/arnav_9.11", "_blank");
    }
}

/* --- MUSIC --- */
function toggleMusic() {
    var activeAudio = (currentMode === 'game') ? gameAudio : globalAudio;
    if (activeAudio.paused) {
        activeAudio.play().catch(e => console.log(e));
        isMuted = false;
        btn.innerHTML = "🎵"; btn.style.borderColor = "#00a3ff";
    } else {
        activeAudio.pause();
        isMuted = true;
        btn.innerHTML = "🔇"; btn.style.borderColor = "#444";
    }
}

/* --- NAVIGATION --- */
function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    
    var about = document.getElementById('about-view');
    about.style.display = 'block';
    window.scrollTo(0, 0);
    
    // Typing for Verses
    startTyping("Moh dya ka tyag kar...\nAb jism se na pyar kar...\nMastko ke unke Aaj...\nDeh se ajaad kar....", "typewriter-output-1");
    setTimeout(() => {
        startTyping("Mai antt hun mai ankurit,\nYugo yugo ka hal hai...", "typewriter-output-2");
    }, 2000);
}

function switchToGames() {
    currentMode = 'game';
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'flex';
    
    if(globalAudio) globalAudio.pause();
    if(gameAudio) { gameAudio.currentTime = 0; if(!isMuted) gameAudio.play(); }
    btn.innerHTML = (!isMuted) ? "🎵" : "🔇";
    setTimeout(initGame, 200);
}

function switchToHome() {
    currentMode = 'home';
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
    
    if(gameAudio) gameAudio.pause();
    if(globalAudio && !isMuted) globalAudio.play();
    btn.innerHTML = (!isMuted) ? "🎵" : "🔇";
}

/* --- TYPEWRITER HELPER --- */
function startTyping(text, elementId) {
    const element = document.getElementById(elementId);
    if(!element) return;
    element.innerHTML = "";
    let i = 0;
    function typeChar() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') element.innerHTML += "<br>";
            else element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeChar, 50);
        }
    }
    typeChar();
}

/* --- CHESS LOGIC --- */
function initGame() {
    game = new Chess();
    board = Chessboard('myBoard', {
        draggable: true, position: 'start',
        onDragStart: function(s, p) { if (game.game_over() || p.search(/^b/) !== -1) return false; },
        onDrop: function(s, t) {
            var move = game.move({ from: s, to: t, promotion: 'q' });
            if (move === null) return 'snapback';
            updateStatus();
            window.setTimeout(function() {
                var moves = game.moves();
                if (moves.length > 0) {
                    game.move(moves[Math.floor(Math.random() * moves.length)]);
                    board.position(game.fen());
                    updateStatus();
                }
            }, 250);
        },
        onSnapEnd: function() { board.position(game.fen()); },
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    });
    $(window).resize(board.resize);
}

function updateStatus() {
    var status = (game.turn() === 'b') ? 'Arnav AI to move' : 'Your move';
    if (game.in_checkmate()) status = 'Checkmate!';
    $status.html(status);
}
