import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import marsTexture from "../img/mars.jpg";
import earthTexture from "../img/earth.jpg";
//import gsap from 'gsap';
//import { DragControls } from "three/addons/controls/DragControls.js";
// import * as GUI from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; 
import { cloud } from "./cloud";
import {Tree} from './tree'
import {allSmallTree} from './smallTree'
import { Clapper } from "./clapper";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";


const rollerSpeed = 0.004
const ringInnerRadius = 200
const rollerRadius = 8
const shadowCameraArea = 4050;
const rollerSpeedMultiplier = 30
const mapShadowSize = 8096
const waterBodyColor = 0xb7d4ff


const renderer = new THREE.WebGLRenderer();
renderer.alpha
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('drawing-site').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffa500);
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  4000
);
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = 256; // Adjust the size as needed
canvas.height = 256; // Adjust the size as needed

const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, "skyblue");
gradient.addColorStop(1, "white");

context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);

const texture = new THREE.CanvasTexture(canvas);
scene.background = texture;
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxDistance = 500.0
orbit.minDistance = 50.0
orbit.minPolarAngle = 1.0
orbit.maxPolarAngle = 1.5 

orbit.enableRotate = true

camera.position.set(270, 70,200);

orbit.update();
   //console.log(orbit.getAzimuthalAngle());


const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const waterBodyGeo = new THREE.CircleGeometry(3000, 300,3000)
const waterBodyMat = new THREE.MeshStandardMaterial({
  color: waterBodyColor
});
const waterBody = new THREE.Mesh(waterBodyGeo, waterBodyMat)
scene.add(waterBody)
waterBody.rotation.x = -0.5 * Math.PI
waterBody.position.y = -10
waterBody.receiveShadow = true


// const skyGeo = new THREE.BoxGeometry(30000000, 3000)
// const skyMat = new THREE.MeshBasicMaterial({
//   color: 0xffa500,
//   side: THREE.DoubleSide
// });
// const sky = new THREE.Mesh(skyGeo, skyMat)
// scene.add(sky)
// sky.position.z = 1000

const textureLoader = new THREE.TextureLoader();

const planeGeo = new THREE.CircleGeometry(300, 300);
const planeMat = new THREE.MeshPhongMaterial({
  color: new THREE.Color(0x5e60fa),
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = 0.5 * Math.PI;
plane.receiveShadow = true


const boxGeo = new THREE.BoxGeometry(1, 1);
const boxMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(marsTexture)
});
const centerBox = new THREE.Mesh(boxGeo, boxMat);



const rollerGeo = new THREE.SphereGeometry(rollerRadius, 800);
const rollerMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(earthTexture)
});
const roller = new THREE.Mesh(rollerGeo, rollerMat);
roller.position.x = ringInnerRadius + rollerRadius / 2 ;
roller.position.y = 8;
roller.castShadow = true
centerBox.castShadow = true;



const ringGeo = new THREE.RingGeometry(ringInnerRadius, ringInnerRadius + rollerRadius + 10,500,500)
const ringMat = new THREE.MeshStandardMaterial({
  color: 0x707eff,
  side: THREE.DoubleSide
});
const ring = new THREE.Mesh(ringGeo, ringMat)
ring.rotation.x = -0.5 * Math.PI;
ring.position.y = 0.5;
// ring.castShadow = true
ring.receiveShadow = true

const directionalLight = new THREE.DirectionalLight(0xffffff, 10.0);
scene.add(directionalLight);
directionalLight.position.set(1040,250,240)
directionalLight.castShadow = true
directionalLight.shadow.camera.bottom = -shadowCameraArea;
directionalLight.shadow.camera.top = shadowCameraArea;
directionalLight.shadow.camera.left = -shadowCameraArea;
directionalLight.shadow.camera.right = shadowCameraArea;
directionalLight.shadow.camera.far = 4000
directionalLight.shadow.camera.near = 1;

directionalLight.shadow.mapSize.width = mapShadowSize
directionalLight.shadow.mapSize.height = mapShadowSize;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 20)
scene.add(directionalLightHelper)

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(cameraHelper)

//const controls = new DragControls([plane], camera, renderer.domElement);

scene.add(centerBox, plane, ring);
centerBox.add(roller);




// const gui = new dat.GUI()
// const options = {
//   speed: 250,
//   rollerRadius: 8
// }
// gui.add(options, "speed",0,Math.PI)
// const cyclistURL = new URL("../assets/island.glb", import.meta.url);
// const gltfLoader = new GLTFLoader();
// gltfLoader.load(
//   cyclistURL.href,
//   function (gltf) {
//     const model = gltf.scene;
//     model.scale.set(10, 10, 10);
//     scene.add(model);
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );
// scene.add(gltfLoader)
// gltfLoader.position.x = 0;
// gltfLoader.position.y = 0;
// gltfLoader.position.z = 0;

// Adding tree


// Instantiate a loader
const loader = new DRACOLoader();

// Specify path to a folder containing WASM/JS decoding libraries.
loader.setDecoderPath( '/examples/jsm/libs/draco/' );

// Optional: Pre-fetch Draco WASM/JS module.
loader.preload();

// Load a Draco geometry
loader.load(
  // resource URL
  "../assets/cyclist.drc",
  // called when the resource is loaded
  function (geometry) {
    const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  },
  // called as loading progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);
scene.add(loader)
const tree1 = new Tree().getTree(1)
scene.add(tree1)
tree1.position.y = 15;
tree1.position.x = 100;

const tree2 = new Tree().getTree(1.5);
scene.add(tree2);
tree2.position.y = 25;
tree2.position.z = 100;

const tree3 = new Tree().getTree(1);
scene.add(tree3);
tree3.position.y = 15;
tree3.position.x = 10;

const tree4 = new Tree().getTree(1.5);
scene.add(tree4);
tree4.position.y = 25;
tree4.position.x = 15;
tree4.position.z = 50;

const tree5 = new Tree().getTree(1.5);
scene.add(tree5);
tree5.position.y = 25;
tree5.position.x = 10;
tree5.position.z = 15;

const tree6 = new Tree().getTree(1);
scene.add(tree6);
tree6.position.y = 15;
tree6.position.x = 100;
tree6.position.z = 70;

const tree7 = new Tree().getTree(1);
scene.add(tree7);
tree7.position.y = 15;
tree7.position.x = 70;
tree7.position.z = 70;

const tree8 = new Tree().getTree(1);
scene.add(tree8);
tree8.position.y = 15;
tree8.position.x = 100;

const tree9 = new Tree().getTree(1);
scene.add(tree9);
tree9.position.y = 15;
tree9.position.x = 100;

const tree10 = new Tree().getTree(1);
scene.add(tree10);
tree10.position.y = 15;
tree10.position.x = 100;

const tree11 = new Tree().getTree(1);
scene.add(tree11);
tree11.position.y = 15;
tree11.position.x = 100;

const tree12 = new Tree().getTree(1);
scene.add(tree12);
tree12.position.y = 15;
tree12.position.x = 100;

// tree out of the rings

const tree13 = new Tree().getTree(1);
scene.add(tree13);
tree13.position.y = 15;
tree13.position.x = 205;
tree13.position.z = 105;

const tree14 = new Tree().getTree(1.5);
scene.add(tree14);
tree14.position.y = 25;
tree14.position.x = 205;
tree14.position.z = 205;

const tree15 = new Tree().getTree(1);
scene.add(tree15);
tree15.position.y = 15;
tree15.position.x = -205;
tree15.position.z = 205;

const tree16 = new Tree().getTree(1.5);
scene.add(tree16);
tree16.position.y = 25;
tree16.position.x = -205;
tree16.position.z = -205;

const cloudList = []
const cloudCount = 1
for (var i = 0; i < cloudCount; i++){
  const singleCloud = new cloud().getCloud()
  singleCloud.position.x = Math.random() * 3000 * (Math.random() > 0.5 ? -1 : 1)
  singleCloud.position.z = Math.random() * 3000 * (Math.random() > 0.5 ? -1 : 1);
  singleCloud.position.y = Math.random()  + 500
  cloudList.push(singleCloud)
}
  
//const cloud1 = new cloud().getCloud()
//scene.add(cloud1);
//cloud1.position.y = 10
scene.add(...cloudList)
let cameraRotation = 0;
  window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowRight") {
     // centerBox.rotateY(rollerSpeed);
      cameraRotation += rollerSpeedMultiplier * rollerSpeed;
     // roller.rotateX(-rollerSpeedMultiplier * rollerSpeed);
    }
    if (e.key == "ArrowLeft") {
    //  centerBox.rotateY(-rollerSpeed);

   //   roller.rotateX(rollerSpeedMultiplier * rollerSpeed);
      cameraRotation -= rollerSpeedMultiplier * rollerSpeed;
    }
    //   gsap.to(camera.position, {
    //     z: 14,
    //       duration: 1.5,
    //       onUpdate: function () {
    //         camera.lookAt(0,0,0)
    //     }
    //   });
  });

scene.add(...allSmallTree())

const clapperBox = new Clapper().getClapper()
scene.add(clapperBox)

function animate() {
  //Self-rotation


// camera.position.x = 700 * Math.sin(cameraRotation);
//  camera.position.z = 700 * Math.cos(cameraRotation);
  
  roller.position.x = 250 * Math.sin(cameraRotation);
 roller.position.z = 250 * Math.cos(cameraRotation);
  // centerBox.rotateY(Math.sin(cameraRotation));
//console.log(camera.position)

// Handle window resize
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});








  orbit.addEventListener("change", () => {
    // centerBox.rotateY(0.00001);
    // roller.rotateX(-1 * rollerSpeed);
    // roller.position.x = Math.sin(time * 0.7) * 270;
    //  roller.position.z = camera.rotation.y * 120;
  });
  const time = Date.now() * 0.0005;
  // camera.position.x = Math.sin(time * 0.7) * 470;
  // camera.position.z = Math.cos(time * 0.7) * 470;
  //  roller.position.x = Math.sin(time * 0.7) * 270;
  //  roller.position.z = Math.cos(time * 0.7) * 270;
  //centerBox.rotateY(0.00001);
  for (var i = 0; i < cloudCount; i++) {
    cloudList[i].position.x += 0.9;
  }
 
  //roller.rotateX(-1 * rollerSpeed);
  camera.lookAt(0, 0, 0);


  // cloud.rotation.x += 0.001;
  // cloud.rotation.y += 0.001;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
