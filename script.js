/* --- VARIABLES --- */
var globalAudio = document.getElementById("global-bg-music");
var gameAudio = document.getElementById("game-bg-music");
var btn = document.getElementById("mute-btn");
var currentMode = 'home';
var isMuted = true;
var board = null;
var game = null;
var $status = $('#status'); // Chess status ke liye
var typingInterval; // Typing rokne ke liye

/* --- 1. POPUP & READ MORE --- */
function readMoreVerses() {
    var userChoice = confirm("Do you want to visit Instagram to read the full masterpiece? ✍️\n(Click OK to visit)");
    if(userChoice === true) {
        window.open("https://www.instagram.com/arnav_9.11", "_blank");
    }
}

/* --- 2. MUSIC CONTROL --- */
function toggleMusic() {
    var activeAudio = (currentMode === 'game') ? gameAudio : globalAudio;
    if (activeAudio.paused) {
        activeAudio.play().catch(function(e){ console.log("Audio Error:", e); });
        isMuted = false;
        if(btn) { btn.innerHTML = "🎵"; btn.style.borderColor = "#00a3ff"; }
    } else {
        activeAudio.pause();
        isMuted = true;
        if(btn) { btn.innerHTML = "🔇"; btn.style.borderColor = "#444"; }
    }
}

/* --- 3. PAGE NAVIGATION --- */
function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    
    var about = document.getElementById('about-view');
    about.style.display = 'block';
    window.scrollTo(0, 0); // Upar scroll karo
    
    // Yahan se Typing shuru hogi (Sync Fix)
    // Pehle Jang-kaal type hoga
    startTyping("Moh dya ka tyag kar...\nAb jism se na pyar kar...\nMastko ke unke Aaj...\nDeh se ajaad kar....", "typewriter-output-1");
    
    // Thodi der baad Anjaan type hoga
    setTimeout(() => {
        startTyping("Mai antt hun mai ankurit,\nYugo yugo ka hal hai...", "typewriter-output-2");
    }, 2000);
}

function switchToGames() {
    currentMode = 'game';
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';
    
    var gameView = document.getElementById('games-view');
    gameView.style.display = 'flex'; // Flex zaroori hai centering ke liye
    
    // Music Switch
    if(globalAudio) globalAudio.pause();
    if(gameAudio) { 
        gameAudio.currentTime = 0; 
        if(!isMuted) gameAudio.play(); 
    }
    if(btn) btn.innerHTML = (!isMuted) ? "🎵" : "🔇";
    
    // Chess Board Init
    setTimeout(initGame, 200);
}

function switchToHome() {
    currentMode = 'home';
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
    
    // Music Switch Back
    if(gameAudio) gameAudio.pause();
    if(globalAudio && !isMuted) globalAudio.play();
    if(btn) btn.innerHTML = (!isMuted) ? "🎵" : "🔇";
}

/* --- 4. TYPEWRITER EFFECT (FIXED) --- */
function startTyping(text, elementId) {
    const element = document.getElementById(elementId);
    if(!element) return;
    
    element.innerHTML = ""; // Pehle safai
    let i = 0;
    
    // Simple recursive function for typing
    function typeChar() {
        if (i < text.length) {
            if (text.charAt(i) === '\n') {
                element.innerHTML += "<br>";
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(typeChar, 50); // Speed: 50ms
        }
    }
    typeChar();
}

/* --- 5. CHESS LOGIC (Arnav Bot) --- */
function onDragStart (source, piece) {
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false; // Sirf White chala sakte ho
}

function makeRandomMove () {
    var possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;

    var randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
    updateStatus();
}

function onDrop (source, target) {
    var move = game.move({ from: source, to: target, promotion: 'q' });
    if (move === null) return 'snapback';
    updateStatus();
    window.setTimeout(makeRandomMove, 250);
}

function onSnapEnd () { board.position(game.fen()); }

function updateStatus () {
    var status = '';
    var moveColor = (game.turn() === 'b') ? 'Arnav AI' : 'You';
    if (game.in_checkmate()) { status = 'Game over, ' + moveColor + ' is in checkmate.'; }
    else if (game.in_draw()) { status = 'Game over, drawn position'; }
    else { status = moveColor + ' to move'; }
    if($status) $status.html(status);
}

function initGame() {
    try {
        game = new Chess();
        var config = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd,
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
        };
        board = Chessboard('myBoard', config);
        $(window).resize(board.resize);
    } catch (e) { console.log("Chess Error:", e); }
}

/* --- 6. POPUP LOGIC --- */
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
            // Jab popup hatega, tabhi Home Page ki typing animation chalegi
            const bio = document.querySelector('.bio');
            if(bio) bio.style.animation = "typing 3.5s steps(30, end), blink-caret .75s step-end infinite";
        }, 800);
    }
}
