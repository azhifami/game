const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const bikeImg = new Image();
bikeImg.src = "bike.png"; // PNG motor

const bike = {
  x: 150,
  y: 200,
  w: 80,
  h: 40,
  vy: 0,
  rotation: 0,
  rotSpeed: 0,
  gravity: 0.7,
  onGround: false
};

const ground = 320;

// rintangan
const obstacle = {
  x: 500,
  y: 300,
  w: 40,
  h: 40
};

function update() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // gravitasi
  bike.vy += bike.gravity;
  bike.y += bike.vy;
  bike.rotation += bike.rotSpeed;

  // tanah
  if (bike.y + bike.h >= ground) {
    bike.y = ground - bike.h;
    bike.vy = 0;
    bike.onGround = true;
    bike.rotSpeed *= 0.9;
  } else {
    bike.onGround = false;
  }

  // tabrakan rintangan
  if (
    bike.x < obstacle.x + obstacle.w &&
    bike.x + bike.w > obstacle.x &&
    bike.y < obstacle.y + obstacle.h &&
    bike.y + bike.h > obstacle.y
  ) {
    alert("CRASH!");
    location.reload();
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  // tanah
  ctx.fillStyle = "green";
  ctx.fillRect(0, ground, canvas.width, 80);

  // rintangan
  ctx.fillStyle = "red";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);

  // motor (rotasi)
  ctx.save();
  ctx.translate(bike.x + bike.w/2, bike.y + bike.h/2);
  ctx.rotate(bike.rotation);
  ctx.drawImage(bikeImg, -bike.w/2, -bike.h/2, bike.w, bike.h);
  ctx.restore();
}

// tombol sentuh
document.getElementById("jump").ontouchstart = () => {
  if (bike.onGround) bike.vy = -12;
};

document.getElementById("front").ontouchstart = () => {
  bike.rotSpeed = 0.08;
};

document.getElementById("back").ontouchstart = () => {
  bike.rotSpeed = -0.08;
};

// keyboard
document.addEventListener("keydown", e => {
  if (e.code === "Space" && bike.onGround) bike.vy = -12;
  if (e.code === "ArrowRight") bike.rotSpeed = 0.08;
  if (e.code === "ArrowLeft") bike.rotSpeed = -0.08;
});

document.addEventListener("keyup", () => {
  bike.rotSpeed = 0;
});

update();
