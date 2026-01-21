/* --- VARIABLES --- */
var globalAudio = document.getElementById("global-bg-music");
var gameAudio = document.getElementById("game-bg-music");
var btn = document.getElementById("mute-btn");
var currentMode = 'home'; 
var isMuted = true;
const poemText = "Tu jang ka ailan kar...\nDushmano PE vaar kar...\nPapiyo ka naas kar....";
let typingInterval;

/* --- CHESS VARIABLES --- */
var board = null;
var game = new Chess();
var $status = $('#status');

/* --- MUSIC LOGIC --- */
globalAudio.volume = 0.2; gameAudio.volume = 0.3; 
function toggleMusic() {
    var activeAudio = (currentMode === 'game') ? gameAudio : globalAudio;
    if (activeAudio.paused) {
        activeAudio.play(); isMuted = false;
        btn.innerHTML = "🎵"; btn.style.borderColor = "#00a3ff";
    } else {
        activeAudio.pause(); isMuted = true;
        btn.innerHTML = "🔇"; btn.style.borderColor = "#444";
    }
}

/* --- CHESS LOGIC (The Brain) --- */
function onDragStart (source, piece, position, orientation) {
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false; // Sirf White pieces utha sakte ho
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
    
    // AI thinks for 250ms then moves
    window.setTimeout(makeRandomMove, 250);
}

function onSnapEnd () { board.position(game.fen()); }

function updateStatus () {
    var status = '';
    var moveColor = (game.turn() === 'b') ? 'Black (Arnav AI)' : 'White (You)';
    if (game.in_checkmate()) { status = 'Game over, ' + moveColor + ' is in checkmate.'; }
    else if (game.in_draw()) { status = 'Game over, drawn position'; }
    else { status = moveColor + ' to move'; if (game.in_check()) { status += ', ' + moveColor + ' is in check'; } }
    $status.html(status);
}

function initGame() {
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
}

/* --- PAGE SWITCHING --- */
window.onload = function() {
    setTimeout(function() { document.getElementById("music-popup").classList.add("active"); }, 3000); 
};
function closePopup() {
    document.getElementById("music-popup").classList.remove("active");
    setTimeout(function(){ document.getElementById("music-popup").style.display = "none"; }, 800);
}
function typeWriterEffect() {
    const element = document.getElementById("typewriter-output");
    if(!element) return;
    element.innerHTML = ""; let index = 0; clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        if (poemText.charAt(index) === '\n') { element.innerHTML += "<br>"; } 
        else { element.innerHTML += poemText.charAt(index); }
        index++; if (index === poemText.length) { clearInterval(typingInterval); }
    }, 50);
}

function switchToAbout() {
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'block';
    window.scrollTo(0, 0); typeWriterEffect();
}

function switchToGames() {
    currentMode = 'game';
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'block';
    
    // Board Initialize (Important!)
    setTimeout(initGame, 200); 

    globalAudio.pause(); gameAudio.currentTime = 0;
    if (!isMuted) { gameAudio.play(); btn.innerHTML = "🎵"; }
}

function switchToHome() {
    currentMode = 'home';
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
    
    gameAudio.pause();
    if (!isMuted) { globalAudio.play(); btn.innerHTML = "🎵"; }
}
