/* --- GLOBAL VARIABLES --- */
var globalAudio = document.getElementById("global-bg-music");
var gameAudio = document.getElementById("game-bg-music");
var btn = document.getElementById("mute-btn");
var currentMode = 'home'; 
var isMuted = true;
var board = null;
var game = null;
var $status = $('#status');
var typingInterval;

/* --- BUTTON FUNCTIONS (Top Level) --- */

// 1. Read More Button
function readMoreVerses() {
    var userChoice = confirm("Do you want to visit Instagram to read the full masterpiece? ✍️\n(Click OK to visit)");
    if(userChoice === true) {
        window.open("https://www.instagram.com/arnav_9.11", "_blank");
    }
}

// 2. Music Toggle
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

/* --- NAVIGATION LOGIC (The Fix) --- */

function switchToAbout() {
    console.log("Switching to About"); // Debugging
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    
    var about = document.getElementById('about-view');
    about.style.display = 'block';
    window.scrollTo(0, 0);
    
    typeWriterEffect();
}

function switchToGames() {
    console.log("Switching to Games"); // Debugging
    currentMode = 'game';
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';
    
    var gameView = document.getElementById('games-view');
    gameView.style.display = 'flex'; // Important: Flex for centering
    
    // Music Switch
    if(globalAudio) globalAudio.pause();
    if(gameAudio) { 
        gameAudio.currentTime = 0; 
        if(!isMuted) gameAudio.play(); 
    }
    if(btn) btn.innerHTML = (!isMuted) ? "🎵" : "🔇";

    // Init Board Delay
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

/* --- CHESS LOGIC --- */
function onDragStart (source, piece) {
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false;
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

/* --- TYPEWRITER EFFECT --- */
const poemText = "Moh dya ka tyag kar...\nAb jism se na pyar kar...\nMastko ke unke Aaj...\nDeh se ajaad kar....";
function typeWriterEffect() {
    const element = document.getElementById("typewriter-output");
    if(!element) return;
    element.innerHTML = ""; 
    let index = 0; 
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        if (poemText.charAt(index) === '\n') { element.innerHTML += "<br>"; } 
        else { element.innerHTML += poemText.charAt(index); }
        index++; 
        if (index === poemText.length) { clearInterval(typingInterval); }
    }, 50);
}

// Popup Logic
window.onload = function() {
    setTimeout(function() {
        var popup = document.getElementById("music-popup");
        if(popup) popup.classList.add("active");
    }, 3000); 
};
function closePopup() {
    var popup = document.getElementById("music-popup");
    if(popup) {
        popup.classList.remove("active");
        setTimeout(function(){ popup.style.display = "none"; }, 800);
    }
}
