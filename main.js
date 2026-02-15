/**
 * 2D DRAG RACE - PURE JAVASCRIPT EDITION
 * Semua elemen (Canvas, Style, UI) dibuat melalui Script ini.
 */

// 1. SETUP STYLE & CANVAS SECARA DINAMIS
const style = document.createElement('style');
style.textContent = `
    body { margin: 0; background: #111; color: white; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
    #ui-layer { position: absolute; top: 20px; text-align: center; pointer-events: none; }
    .perfect { color: #00ffcc; font-weight: bold; animation: pop 0.3s; }
    @keyframes pop { 0% { transform: scale(1.2); } 100% { transform: scale(1); } }
`;
document.head.appendChild(style);

const ui = document.createElement('div');
ui.id = 'ui-layer';
ui.innerHTML = '<h1 id="status">TEKAN [SPACE] UNTUK START</h1><p>Gunakan SPACE untuk Gas & Oper Gigi</p>';
document.body.appendChild(ui);

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 400;
canvas.style.border = "4px solid #333";
canvas.style.background = "#222";
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

// 2. STATE GAME & VARIABEL
let gameState = "IDLE"; // IDLE, COUNTDOWN, RACE, FINISH
let timer = 0;
let countdown = 3;
const finishLine = 720;

let player = {
    x: 50, y: 180, vel: 0, rpm: 0, gear: 0, 
    color: '#00ccff', time: 0, finished: false,
    maxRPM: 1000
};

let enemy = {
    x: 50, y: 280, vel: 0, 
    color: '#ff3333', time: 0, finished: false
};

// 3. LOGIKA UTAMA
function update() {
    if (gameState === "COUNTDOWN") {
        timer++;
        if (timer % 60 === 0) {
            countdown--;
            if (countdown <= 0) {
                gameState = "RACE";
                player.gear = 1;
                player.startT = Date.now();
                enemy.startT = Date.now();
            }
        }
    }

    if (gameState === "RACE" || gameState === "FINISH") {
        // Player Physics
        if (!player.finished) {
            if (player.gear > 0) {
                player.rpm += (15 - player.gear); 
                player.vel += (0.04 * player.gear);
            }
            player.vel *= 0.985; // Friction
            player.x += player.vel;
            if (player.rpm > player.maxRPM) player.rpm = player.maxRPM;
            
            if (player.x >= finishLine) {
                player.finished = true;
                player.time = ((Date.now() - player.startT) / 1000).toFixed(2);
            }
        }

        // Enemy AI Physics
        if (!enemy.finished) {
            enemy.vel += 0.21; // Speed bot
            enemy.vel *= 0.98;
            enemy.x += enemy.vel;
            if (enemy.x >= finishLine) {
                enemy.finished = true;
                enemy.time = ((Date.now() - enemy.startT) / 1000).toFixed(2);
            }
        }

        if (player.finished && enemy.finished) {
            gameState = "FINISH";
            const win = player.time < enemy.time;
            document.getElementById('status').innerHTML = win ? 
                `<span class="perfect">MENANG! (${player.time}s)</span>` : 
                `<span style="color:red">KALAH! (${player.time}s)</span>`;
        }
    }

    draw();
    requestAnimationFrame(update);
}

// 4. LUKIS GRAFIS
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aspal & Garis Putus
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 150, canvas.width, 200);
    ctx.strokeStyle = "#555";
    ctx.setLineDash([20, 20]);
    ctx.beginPath(); ctx.moveTo(0, 250); ctx.lineTo(800, 250); ctx.stroke();
    ctx.setLineDash([]);

    // Finish Line
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(finishLine, 150, 20, 200);

    // Gambar Motor (Simple Box Sprite)
    [player, enemy].forEach(m => {
        ctx.fillStyle = m.color;
        ctx.fillRect(m.x, m.y, 40, 15); // Body
        ctx.fillStyle = "black";
        ctx.beginPath(); ctx.arc(m.x+8, m.y+18, 6, 0, Math.PI*2); ctx.fill(); // Ban Blkg
        ctx.beginPath(); ctx.arc(m.x+32, m.y+18, 6, 0, Math.PI*2); ctx.fill(); // Ban Dpn
    });

    // Dashboard Player
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.fillText(`GEAR: ${player.gear}`, 20, 40);
    ctx.fillText(`KM/H: ${Math.floor(player.vel * 15)}`, 20, 60);
    
    // Tachometer (RPM)
    ctx.fillStyle = "#444";
    ctx.fillRect(20, 75, 200, 15);
    let rpmColor = player.rpm > 850 ? "#ff0000" : "#00ffcc";
    ctx.fillStyle = rpmColor;
    ctx.fillRect(20, 75, (player.rpm/player.maxRPM) * 200, 15);

    if (gameState === "COUNTDOWN") {
        ctx.fillStyle = "white";
        ctx.font = "80px Arial";
        ctx.textAlign = "center";
        ctx.fillText(countdown, canvas.width/2, 120);
        ctx.textAlign = "start";
    }
}

// 5. INPUT HANDLER
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameState === "IDLE") {
            gameState = "COUNTDOWN";
            document.getElementById('status').innerText = "READY...";
        } else if (gameState === "RACE" && player.gear < 6) {
            // Mekanisme Shift
            if (player.rpm > 850) {
                player.vel += 4; // Perfect shift boost
                document.getElementById('status').innerHTML = "<span class='perfect'>PERFECT!</span>";
            } else {
                player.vel += 1;
                document.getElementById('status').innerText = "SHIFT UP";
            }
            player.gear++;
            player.rpm = 350;
        }
    }
    if (e.key === 'r' || e.key === 'R') location.reload();
});

// Jalankan Engine
update();
