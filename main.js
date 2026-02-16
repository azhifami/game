const motor = document.getElementById("motor");
const gasBtn = document.getElementById("gas");
const bgm = document.getElementById("bgm");

let posisi = 50;
let speed = 0;

bgm.volume = 0.5;
bgm.play();

gasBtn.addEventListener("click", () => {
  speed += 2;
});

function gameLoop() {
  posisi += speed;
  speed *= 0.95; // gesekan

  if (posisi > 700) {
    posisi = 700;
    alert("FINISH!");
    speed = 0;
  }

  motor.style.left = posisi + "px";
  requestAnimationFrame(gameLoop);
}

gameLoop();
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
