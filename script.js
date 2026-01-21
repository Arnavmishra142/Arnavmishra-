/* --- GLOBAL --- */
body {
    background-color: #000;
    color: #fff;
    font-family: 'Courier New', Courier, monospace; 
    margin: 0; padding: 0;
    overflow-x: hidden;
}

.main-wrapper {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: 80px;
    position: relative;
    z-index: 10;
}

/* --- PROFILE PHOTO (Original Fix) --- */
.profile-container { position: relative; width: 100px; height: 100px; margin: 0 auto; margin-top: 20px; }
.profile-img { 
    width: 100%; height: 100%; border-radius: 50%; object-fit: cover; 
    border: 2px solid #333; 
    /* Filter hata diya taaki original dikhe */
    position: relative; z-index: 2; 
}
.profile-glow { 
    position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; 
    border-radius: 50%; background: linear-gradient(45deg, #00a3ff, #ff0099); 
    z-index: 1; animation: spin 4s linear infinite; filter: blur(8px);
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* --- NAME (Blue & White Gradient Fix) --- */
.name { 
    text-align: center; font-size: 1.8rem; margin-top: 15px; 
    font-weight: bold; letter-spacing: 2px; text-transform: uppercase; 
    
    /* GRADIENT LOGIC */
    background: linear-gradient(to right, #00a3ff, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px rgba(0, 163, 255, 0.3);
}

/* --- BIO ANIMATION --- */
.bio-wrap { display: flex; justify-content: center; margin-bottom: 25px; margin-top: 5px; }
.bio { 
    color: #00a3ff; font-size: 0.9rem; letter-spacing: 2px; 
    text-transform: lowercase; font-family: 'Courier New', monospace;
    border-right: 2px solid #00a3ff;
    white-space: nowrap; overflow: hidden;
    width: 0;
}
@keyframes typing { from { width: 0 } to { width: 100% } }
@keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: #00a3ff; } }

/* --- UI ELEMENTS --- */
.quote-box { background: #111; border-left: 3px solid #00a3ff; padding: 15px; margin: 25px 0; color: #ccc; font-style: italic; font-size: 0.85rem; line-height: 1.5; }
.card { background: #111; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px; margin-top: 20px; }

/* Buttons */
.btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
.btn { background: #111; border: 1px solid #333; color: #fff; padding: 12px; text-align: center; text-decoration: none; border-radius: 8px; font-size: 0.9rem; transition: 0.3s; font-family: sans-serif; }
.btn:hover { border-color: #00a3ff; background: #0a0a0a; }

.main-btn { background: #00a3ff; color: #fff; border: none; padding: 15px; width: 100%; font-weight: bold; margin-top: 25px; cursor: pointer; border-radius: 8px; font-size: 1rem; box-shadow: 0 4px 15px rgba(0, 163, 255, 0.3); }

.back-btn { background: transparent; border: none; color: #888; cursor: pointer; font-size: 0.9rem; margin-bottom: 15px; display: flex; align-items: center; gap: 5px; }

/* --- POPUP FIX (Transparent Background) --- */
#music-popup { 
    display: none; 
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    /* Halka transparent black, taaki peeche ka site dikhe */
    background: rgba(0,0,0,0.8); 
    z-index: 9999; 
    align-items: center; justify-content: center; 
    backdrop-filter: blur(8px); /* Blur effect */
}
#music-popup.active { display: flex; }
.popup-content { text-align: center; color: #fff; animation: popUp 0.5s ease; }
@keyframes popUp { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

/* Page Transition */
.fade-in { animation: fadeIn 0.8s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
