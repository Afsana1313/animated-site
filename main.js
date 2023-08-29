import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// used for box/3d designs

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()

camera.position.set(0,20,-30)


////////////////////////
document.body.appendChild(renderer.domElement);


const boxGeo = new THREE.BoxGeometry(2, 2, 2)
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
})
const boxMesh = new THREE.Mesh(boxGeo, boxMat)
scene.add(boxMesh)


const sphereGeo = new THREE.SphereGeometry(2)
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,

})
const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
scene.add(sphereMesh)


const groundGeo = new THREE.PlaneGeometry(30, 30)
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide,
  wireframe: true
})
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
scene.add(groundMesh)

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0,-9.81,0)
})

const groundPhyMat = new CANNON.Material()

const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(),
  //mass: 10,
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
  material: groundPhyMat
});
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI/ 2, 0 ,0)
const timeStep = 1 / 60

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  position: new CANNON.Vec3(5,20,0)
})
world.addBody(boxBody);
boxBody.angularVelocity.set(0, 10,0)
boxBody.angularDamping = 0.5
const sphereBody = new CANNON.Body({
  mass: 10,
  shape: new CANNON.Sphere(2),
  position: new CANNON.Vec3(0, 15, 0)
});
world.addBody(sphereBody);
sphereBody.linearDamping = 0.31


function animate() {
  requestAnimationFrame(animate);
  world.step(timeStep)
  orbit.update();
  groundMesh.position.copy(groundBody.position)
  groundMesh.quaternion.copy(groundBody.quaternion)
   boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
  
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);
  renderer.render(scene, camera);
}
animate();
