/* --- 1. YE SABSE UPAR RAHEGA (Button Logic) --- */
function readMoreVerses() {
    // Ye popup dikhayega
    var userChoice = confirm("Do you want to visit Instagram to read the full masterpiece? ✍️\n(Click OK to visit, Cancel to stay)");
    
    if(userChoice === true) {
        window.open("https://www.instagram.com/arnav_9.11", "_blank");
    }
}

/* --- 2. BAAKI KA CODE --- */
var globalAudio = document.getElementById("global-bg-music");
var gameAudio = document.getElementById("game-bg-music");
var btn = document.getElementById("mute-btn");
var currentMode = 'home'; 
var isMuted = true;
var board = null;
var game = null;
var $status = $('#status');

// Poetry Teaser Text
const poemText = "Moh dya ka tyag kar...\nAb jism se na pyar kar...\nMastko ke unke Aaj...\nDeh se ajaad kar....";
let typingInterval;

/* --- MUSIC SYSTEM --- */
globalAudio.volume = 0.2; 
if(gameAudio) gameAudio.volume = 0.3;

function toggleMusic() {
    var activeAudio = (currentMode === 'game') ? gameAudio : globalAudio;
    
    if (activeAudio.paused) {
        activeAudio.play().catch(e => console.log("Audio play failed")); 
        isMuted = false;
        btn.innerHTML = "🎵"; btn.style.borderColor = "#00a3ff";
    } else {
        activeAudio.pause(); 
        isMuted = true;
        btn.innerHTML = "🔇"; btn.style.borderColor = "#444";
    }
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
    else { status = moveColor + ' to move'; if (game.in_check()) { status += ', ' + moveColor + ' is in check'; } }
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
    } catch (e) { console.log("Chess error: " + e); }
}

/* --- NAVIGATION --- */
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
    setTimeout(initGame, 100);
    globalAudio.pause();
    if(gameAudio) { gameAudio.currentTime = 0; if(!isMuted) gameAudio.play(); }
    btn.innerHTML = (!isMuted) ? "🎵" : "🔇";
}

function switchToHome() {
    currentMode = 'home';
    document.getElementById('about-view').style.display = 'none';
    document.getElementById('games-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
    if(gameAudio) gameAudio.pause();
    if(!isMuted) globalAudio.play();
    btn.innerHTML = (!isMuted) ? "🎵" : "🔇";
}

// Popup Logic (Welcome Screen)
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
