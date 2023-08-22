import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const geometry = new THREE.BoxGeometry(2, 1, 3, 2, 1, 3);
const image = new Image();
image.src = "public/littol-dog.jpg";
const material = new THREE.MeshBasicMaterial({
  color: "red",
  combine: { blur: 0.2 },
  reflectivity: 20,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
document.body.appendChild(renderer.domElement);
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  renderer.render(scene, camera);
}
animate();
