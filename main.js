// ---------- SCENE ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ---------- CAMERA ----------
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// ---------- RENDERER ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------- LIGHTS ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// ---------- GROUND ----------
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ---------- CAR ----------
const car = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
car.position.y = 0.5;
scene.add(car);

// ---------- BUILDINGS ----------
for (let i = 0; i < 100; i++) {
  const h = Math.random() * 20 + 5;
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(5, h, 5),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  building.position.set(
    Math.random() * 200 - 100,
    h / 2,
    Math.random() * 200 - 100
  );
  scene.add(building);
}

// ---------- MOVEMENT ----------
let speed = 0;
let turn = 0;

// ---------- BUTTON CONTROLS ----------
function bindButton(id, onPress) {
  const btn = document.getElementById(id);
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    onPress();
  });
  btn.addEventListener("mousedown", onPress);
}

bindButton("forward", () => speed += 0.05);
bindButton("back", () => speed -= 0.05);
bindButton("left", () => turn = 0.04);
bindButton("right", () => turn = -0.04);

document.addEventListener("touchend", () => turn = 0);
document.addEventListener("mouseup", () => turn = 0);

// ---------- ANIMATION LOOP ----------
function animate() {
  requestAnimationFrame(animate);

  speed *= 0.97;
  car.rotation.y += turn;
  car.translateZ(speed);

  camera.position.lerp(
    new THREE.Vector3(
      car.position.x,
      car.position.y + 6,
      car.position.z + 12
    ),
    0.1
  );
  camera.lookAt(car.position);

  document.getElementById("speed").textContent =
    Math.abs(speed * 100).toFixed(0);

  renderer.render(scene, camera);
}

camera.position.set(0, 6, 12);
animate();

// ---------- RESIZE ----------
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
