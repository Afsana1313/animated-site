import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
console.log(camera);
// this is for rendering. This is must. irrespective of the objects rendered in the screen.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// used for box/3d designs
const geometry = new THREE.BoxGeometry(2, 1, 3, 2, 1, 3);
// Experimental purpose , may use it later.
const image = new Image();
image.src = "/littol-dog.jpg";
// Experimental purpose , may use it later.
const material = new THREE.MeshBasicMaterial({
  color: "red",
  opacity: 0.1,
  combine: { blur: 0.2 },
  reflectivity: 20
  // map: {
  //   image: image
  // }
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

//create a blue LineBasicMaterial
const linematerial = new THREE.LineBasicMaterial({ color: 0x0000ff });
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(10, 0, 0));

const linegeometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(linegeometry, linematerial);
scene.add(line);
////////////////////////
document.body.appendChild(renderer.domElement);
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  renderer.render(scene, camera);
}
animate();
