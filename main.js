// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: 0x333333 })
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

// City buildings
for (let i = 0; i < 100; i++) {
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(5, Math.random() * 20 + 5, 5),
    new THREE.MeshStandardMaterial({ color: 0x777777 })
  );
  building.position.set(
    Math.random() * 200 - 100,
    building.geometry.parameters.height / 2,
    Math.random() * 200 - 100
  );
  scene.add(building);
}

// Movement
let speed = 0;
let direction = 0;

document.addEventListener("keydown", e => {
  if (e.key === "w") speed += 0.02;
  if (e.key === "s") speed -= 0.02;
  if (e.key === "a") direction += 0.03;
  if (e.key === "d") direction -= 0.03;
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  speed *= 0.98;
  car.rotation.y += direction * speed;
  car.translateZ(speed);

  // Camera follow
  camera.position.lerp(
    new THREE.Vector3(
      car.position.x,
      car.position.y + 5,
      car.position.z + 10
    ),
    0.1
  );
  camera.lookAt(car.position);

  document.getElementById("speed").textContent =
    Math.abs(speed * 100).toFixed(0);

  renderer.render(scene, camera);
}

camera.position.set(0, 5, 10);
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
    
