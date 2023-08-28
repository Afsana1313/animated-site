import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import marsTexture from "../img/mars.jpg";
import uranusTexture from "../img/uranus.jpg";
import earthTexture from "../img/earth.jpg";
import gsap from 'gsap'

const rollerSpeed = 0.0004
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxDistance = 500.0
orbit.minDistance = 100.0
orbit.minPolarAngle = 1.0
orbit.maxPolarAngle = 1.5 

orbit.enablePan = false
camera.position.set(190, 140, 240);
orbit.update();


const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

const planeGeo = new THREE.CircleGeometry(300, 300);
const planeMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(uranusTexture),
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = 0.5 * Math.PI;

const boxGeo = new THREE.BoxGeometry(4, 5);
const boxMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(marsTexture)
});
const centerBox = new THREE.Mesh(boxGeo, boxMat);

const rollerGeo = new THREE.SphereGeometry(8, 8);
const rollerMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(earthTexture)
});
const roller = new THREE.Mesh(rollerGeo, rollerMat);
roller.position.x = 50;
roller.position.y = 8;

const ringGeo = new THREE.RingGeometry(45, 50, 30)
const ringMat = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide})
const ring = new THREE.Mesh(ringGeo, ringMat)
ring.rotation.x = -0.5 * Math.PI;
ring.position.y = 1;

scene.add(centerBox, plane);
centerBox.add(roller, ring);
function animate() {
  //Self-rotation
  window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") {
        centerBox.rotateY(0.0001);
         roller.rotateX(-1 * rollerSpeed);
    }
    if (e.key == "ArrowRight") {
        centerBox.rotateY(-0.0001);
          roller.rotateX(rollerSpeed);
      }
    //   gsap.to(camera.position, {
    //     z: 14,
    //       duration: 1.5,
    //       onUpdate: function () {
    //         camera.lookAt(0,0,0)
    //     }
    //   });
  });
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);