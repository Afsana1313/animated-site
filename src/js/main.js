import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
import gsap from 'gsap'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf29727);
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

camera.position.set(80,80,-80)


////////////////////////
document.body.appendChild(renderer.domElement);





const cylinderGeo = new THREE.CylinderGeometry(2, 2, 200,500,500)
const cylinderMat = new THREE.MeshBasicMaterial({
  color: "#1D5B79",
  side: THREE.DoubleSide
});
const cylinder = new THREE.Mesh(cylinderGeo,cylinderMat)
scene.add(cylinder)
cylinder.position.y = -100
cylinder.color = "#F4F2DE";



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


const groundGeo = new THREE.CylinderGeometry(15, 15, 1, 500,500);
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xA1CCD1,
  side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeo, groundMat)
scene.add(groundMesh)
groundMesh.rotation.z = -0.5 * Math.PI




const world = new CANNON.World({
  gravity: new CANNON.Vec3(0,-9.81,0)
})

const groundPhyMat = new CANNON.Material()

const groundBody = new CANNON.Body({
  // shape: new CANNON.Plane(),
  //mass: 10,
  type: CANNON.Body.STATIC,
  shape: new CANNON.Cylinder(15, 15, 1, 500, 500),
  material: groundPhyMat,
  fixedRotation: false
});
world.addBody(groundBody)

groundBody.quaternion.setFromEuler(-Math.PI/ 2, 0 ,0)
const timeStep = 1 / 60


const boxPhysMat = new CANNON.Material()

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  position: new CANNON.Vec3(1, 20, 0),
  material: boxPhysMat
})
world.addBody(boxBody);
boxBody.angularVelocity.set(0, 10,0)
boxBody.angularDamping = 0.5


const groundBoxContactMat = new CANNON.ContactMaterial(
  boxPhysMat, 
  groundPhyMat,
  {
    friction: 0
  }
)

world.addContactMaterial(groundBoxContactMat);



const spherePhysMat = new CANNON.Material()
const sphereBody = new CANNON.Body({
  mass: 10,
  shape: new CANNON.Sphere(2),
  position: new CANNON.Vec3(0, 15, 0),
  material: spherePhysMat
});
world.addBody(sphereBody);
const groundSphereContactMat = new CANNON.ContactMaterial(
  spherePhysMat,
  groundPhyMat,
  {
    restitution: 0.4
  }
);
world.addContactMaterial(groundSphereContactMat)
sphereBody.linearDamping = 0.31


function animate() {
  requestAnimationFrame(animate);
  world.step(timeStep)
  orbit.update();
  gsap.to(camera.position, {
    y: camera.position.y - 1,
    duration: 0.5
  });
//   window.addEventListener('keydown', (e) => {
   
//     gsap.to(camera.position, {
//       y: camera.position.y - 0.5
//     })
//  })

  groundMesh.position.copy(groundBody.position)
  groundMesh.quaternion.copy(groundBody.quaternion)
   boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
  
    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);
  renderer.render(scene, camera);
}
animate();
