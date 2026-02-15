// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Car
const car = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
car.position.y = 0.5;
scene.add(car);

// Buildings
for (let i = 0; i < 80; i++) {
  const h = Math.random() * 20 + 5;
  const b = new THREE.Mesh(
    new THREE.BoxGeometry(5, h, 5),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  b.position.set(Math.random() * 200 - 100, h / 2, Math.random() * 200 - 100);
  scene.add(b);
}

// Movement variables
let speed = 0;
let turn = 0;

// BUTTON CONTROLS
const press = (btn, fn) => {
  btn.addEventListener("touchstart", fn);
  btn.addEventListener("mousedown", fn);
};

press(left, () => turn = 0.03);
press(right, () => turn = -0.03);
press(forward, () => speed += 0.04);
press(back, () => speed -= 0.04);

// Stop turning when released
document.addEventListener("touchend", () => turn = 0);
document.addEventListener("mouseup", () => turn = 0);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  speed *= 0.97;
  car.rotation.y += turn;
  car.translateZ(speed);

  camera.position.lerp(
    new THREE.Vector3(car.position.x, car.position.y + 6, car.position.z + 12),
    0.1
  );
  camera.lookAt(car.position);

  document.getElementById("speed").textContent = Math.abs(speed * 100).toFixed(0);

  renderer.render(scene, camera);
}

camera.position.set(0, 6, 12);
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
