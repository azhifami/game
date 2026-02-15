const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// motor
const bike = {
  x: 100,
  y: 300,
  width: 60,
  height: 30,
  velY: 0,
  gravity: 0.8,
  jumpPower: -12,
  onGround: false
};

// tanah
const ground = 350;

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gravity
  bike.velY += bike.gravity;
  bike.y += bike.velY;

  // collision tanah
  if (bike.y + bike.height >= ground) {
    bike.y = ground - bike.height;
    bike.velY = 0;
    bike.onGround = true;
  } else {
    bike.onGround = false;
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  // tanah
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground, canvas.width, 50);

  // motor (sementara kotak)
  ctx.fillStyle = "red";
  ctx.fillRect(bike.x, bike.y, bike.width, bike.height);

  // roda
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bike.x + 10, bike.y + bike.height, 10, 0, Math.PI * 2);
  ctx.arc(bike.x + 50, bike.y + bike.height, 10, 0, Math.PI * 2);
  ctx.fill();
}

// kontrol
document.addEventListener("keydown", e => {
  if (e.code === "Space" && bike.onGround) {
    bike.velY = bike.jumpPower;
  }
});

update();
// ---------- RESIZE ----------
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
