import * as THREE from "three";
import { Plane } from "./plane";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  100000000
);

// Customized plane
const bottomPlane = new Plane("red", 4, 4).getPlane();

// this is for rendering. This is must. irrespective of the objects rendered in the screen.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
bottomPlane.rotation.x = -1.3;
bottomPlane.rotation.z = 0.9;
// plane1.rotation.y = -0.2;
scene.add(bottomPlane);
//scene.add(texture);
camera.position.z = 5;

document.body.appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  // plane1.rotation.y += 0.01;
  // plane1.rotation.z += 0.01;
  renderer.render(scene, camera);
}
animate();
