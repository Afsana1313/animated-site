import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import marsTexture from "../img/mars.jpg";
import uranusTexture from "../img/uranus.jpg";
import earthTexture from "../img/earth.jpg";
import gsap from 'gsap';
import { DragControls } from "three/addons/controls/DragControls.js";
// import * as GUI from "dat.gui";

const rollerSpeed = 0.000004
const ringInnerRadius = 250
const rollerRadius = 8
const shadowCameraArea = 350;
const rollerSpeedMultiplier = 30
const mapShadowSize = 8096


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

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxDistance = 500.0
orbit.minDistance = 100.0
orbit.minPolarAngle = 1.0
orbit.maxPolarAngle = 1.5 

orbit.enableRotate = true

camera.position.set(900, 100,150);

orbit.update();
   //console.log(orbit.getAzimuthalAngle());


const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const waterBodyGeo = new THREE.CircleGeometry(3000, 300,3000)
const waterBodyMat = new THREE.MeshStandardMaterial({
  color: 0x006994
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
  color: new THREE.Color(0xfbb995),
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = 0.5 * Math.PI;
plane.receiveShadow = true


const boxGeo = new THREE.BoxGeometry(4, 5);
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


const coneBotGeo = new THREE.ConeGeometry(10, 15, 32);
const coneBotMat = new THREE.MeshPhongMaterial({ color: 0x008000 });
const coneBot = new THREE.Mesh(coneBotGeo, coneBotMat);
scene.add(coneBot);
coneBot.position.y = 15;
coneBot.position.x = 100;

const coneMidGeo = new THREE.ConeGeometry(8, 15, 32);
const coneMidMat = new THREE.MeshPhongMaterial({ color: 0xa0c253 });
const coneMid = new THREE.Mesh(coneMidGeo, coneMidMat);
coneBot.add(coneMid);
coneMid.position.y = 10;

const coneTopGeo = new THREE.ConeGeometry(6, 10, 32);
const coneTopMat = new THREE.MeshPhongMaterial({ color: 0xcfea91 });
const coneTop = new THREE.Mesh(coneTopGeo, coneTopMat);
coneBot.add(coneTop);
coneTop.position.y = 15;

const cylinderWoodGeo = new THREE.CylinderGeometry(3, 3, 20, 300, 300)
const cylinderWoodMat = new THREE.MeshPhongMaterial({ color: 0x310c0c });
const cylinderWood = new THREE.Mesh(cylinderWoodGeo, cylinderWoodMat)
coneBot.add(cylinderWood);
cylinderWood.position.y = -10

coneBot.castShadow = true
coneMid.castShadow = true
coneTop.castShadow = true
cylinderWood.castShadow = true

const ringGeo = new THREE.RingGeometry(ringInnerRadius, ringInnerRadius + rollerRadius,500,500)
const ringMat = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide
});
const ring = new THREE.Mesh(ringGeo, ringMat)
ring.rotation.x = -0.5 * Math.PI;
ring.position.y = 0.5;
// ring.castShadow = true
ring.receiveShadow = true

const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
scene.add(directionalLight);
directionalLight.position.set(140,50,240)
directionalLight.castShadow = true
directionalLight.shadow.camera.bottom = -shadowCameraArea;
directionalLight.shadow.camera.top = shadowCameraArea;
directionalLight.shadow.camera.left = -shadowCameraArea;
directionalLight.shadow.camera.right = shadowCameraArea;
directionalLight.shadow.camera.far = 1000

directionalLight.shadow.mapSize.width = mapShadowSize
directionalLight.shadow.mapSize.height = mapShadowSize;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 20)
scene.add(directionalLightHelper)

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(cameraHelper)

//const controls = new DragControls([plane], camera, renderer.domElement);

scene.add(centerBox, plane, ring,roller);
//centerBox.add(roller);




// const gui = new dat.GUI()
// const options = {
//   speed: 250,
//   rollerRadius: 8
// }
// gui.add(options, "speed",0,Math.PI)

function animate() {
  //Self-rotation
  window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowRight") {
      centerBox.rotateY(rollerSpeed);
      roller.rotateX(-rollerSpeedMultiplier * rollerSpeed);
    }
    if (e.key == "ArrowLeft") {
        centerBox.rotateY(-rollerSpeed);
          roller.rotateX(rollerSpeedMultiplier * rollerSpeed);
      }
    //   gsap.to(camera.position, {
    //     z: 14,
    //       duration: 1.5,
    //       onUpdate: function () {
    //         camera.lookAt(0,0,0)
    //     }
    //   });
  });
  orbit.addEventListener("change", () => {
    // centerBox.rotateY(0.00001);
    // roller.rotateX(-1 * rollerSpeed);
    roller.position.x = Math.sin(time * 0.7) * 270;
    roller.position.z = camera.rotation.y * 120;
  });
  // const time = Date.now() * 0.0005;
  // directionalLight.position.x = Math.sin(time * 0.7) * 270 ;
  // directionalLight.position.z = Math.cos(time * 0.7) * 270 ;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
