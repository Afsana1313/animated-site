import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//import gsap from 'gsap';
//import { DragControls } from "three/addons/controls/DragControls.js";
// import * as GUI from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"; 
import { cloud } from "./cloud";
import {Tree} from './tree'
import {allSmallTree} from './smallTree'
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";


const rollerSpeed = 0.00004
const ringInnerRadius = 200
const rollerRadius = 8
const shadowCameraArea = 4050;
const rollerSpeedMultiplier = 30
const mapShadowSize = 12096
const waterBodyColor = 0xb7d4ff
let scooterLady
let cyclistRun = false


let scooterLoaderx, scooterLoaderz;

const islandY = 50

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
 
});
const centerBox = new THREE.Mesh(boxGeo, boxMat);
const centerBox1 = new THREE.Mesh(boxGeo, boxMat)

scene.add(centerBox, centerBox1)

// const rollerGeo = new THREE.SphereGeometry(rollerRadius, 800);
// const rollerMat = new THREE.MeshStandardMaterial({
//   map: textureLoader.load(earthTexture)
// });
// const roller = new THREE.Mesh(rollerGeo, rollerMat);
// roller.position.x = ringInnerRadius + rollerRadius / 2 ;
// roller.position.y = 8;
// roller.castShadow = true
// centerBox.castShadow = true;



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

const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
scene.add(directionalLight);
directionalLight.position.set(240,450,240)
directionalLight.castShadow = true
directionalLight.shadow.camera.bottom = -shadowCameraArea;
directionalLight.shadow.camera.top = shadowCameraArea;
directionalLight.shadow.camera.left = -shadowCameraArea;
directionalLight.shadow.camera.right = shadowCameraArea;
directionalLight.shadow.camera.far = 4000
directionalLight.shadow.camera.near = 1;

directionalLight.shadow.mapSize.width = mapShadowSize
directionalLight.shadow.mapSize.height = mapShadowSize;

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 20)
// scene.add(directionalLightHelper)

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)


const axesHelper = new THREE.AxesHelper(4000)
axesHelper.position.y = 30
scene.add(axesHelper)
//const controls = new DragControls([plane], camera, renderer.domElement);

// scene.add( plane, ring);
//scene.add(plane);
//centerBox.add(roller);



let runMixer;
let animationTime = 0;
const movementSpeed = 0.005;
let model;
let animationAction;
// Part - 2
// Note that since Three release 148, you will find the Draco libraries in the `.\node_modules\three\examples\jsm\libs\draco\` folder.
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("../../node_modules/three/examples/jsm/libs/draco/");

// island loader
const islandloader = new GLTFLoader();
islandloader.setDRACOLoader(dracoLoader);
islandloader.load(
  "../island.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        const m = child;
        m.receiveShadow = true;
        //m.castShadow = true;
      }
      if (child.isLight) {
        const l = child;
      //  l.castShadow = true;
      //  l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });
    scene.add(gltf.scene);
    gltf.scene.scale.set(20, 20, 20);
   // gltf.scene.position.x = 210;
    gltf.scene.position.y = islandY;
   // gltf.scene.rotateY(-30);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("errrrrrrr", error);
  }
);
// cyclist loader
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load(
    '../cyclist.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child).isMesh) {
                const m = child 
                m.receiveShadow = true
                m.castShadow = true
            }
            if ((child ).isLight) {
                const l = child 
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
          }
                let model = gltf.scene;
          runMixer = new THREE.AnimationMixer(model);
          animationAction = runMixer.clipAction(gltf.animations[0])
          animationAction.clampWhenFinished = true
                window.addEventListener("keydown", (e) => {
                  if (e.key == "ArrowRight") {
                    animationAction.play();
                   animationAction.paused = false;
                    setTimeout(function () {
                    animationAction.paused = true
                    }, 2000);
                  }
                  if (e.key == "ArrowLeft") {
                     animationAction.play();
                    animationAction.paused = false;
                    setTimeout(function () {
                     animationAction.paused = true;
                    }, 2000);
                  }
                });

          
        })

      centerBox.add(gltf.scene)

      gltf.scene.scale.set(8, 8, 8)
      gltf.scene.position.x = 235
       gltf.scene.position.y = 0 + islandY
      gltf.scene.rotateY(-30)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log('errrrrrrr',error)
    }
)

const clapperloader = new GLTFLoader();
clapperloader.setDRACOLoader(dracoLoader);
clapperloader.load(
  "../clapper.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        const m = child;
       //m.receiveShadow = true;
        m.castShadow = true;
      }
      if (child.isLight) {
        const l = child;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
      let model = gltf.scene;
      runMixer = new THREE.AnimationMixer(model);
      animationAction = runMixer.clipAction(gltf.animations[0]);
      //console.log(gltf.animations);
      animationAction.play();
    });

    scene.add(gltf.scene);

    gltf.scene.scale.set(30, 30, 30);
    gltf.scene.position.x = 210;
    gltf.scene.position.y = 0 + islandY;
    gltf.scene.rotateY(0);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("errrrrrrr", error);
  }
);


const scooterloader = new GLTFLoader();
scooterloader.setDRACOLoader(dracoLoader);
scooterloader.load(
  "../scooter.glb",
  function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          const m = child;
          //m.receiveShadow = true;
          m.castShadow = true;
        }
        if (child.isLight) {
          const l = child;
          l.castShadow = true;
          l.shadow.bias = -0.003;
          l.shadow.mapSize.width = 2048;
          l.shadow.mapSize.height = 2048;
        }
      });

    centerBox1.add(gltf.scene);
   scooterLady = gltf.scene
    gltf.scene.scale.set(8, 8, 8);
    gltf.scene.position.x = scooterLoaderx;
     gltf.scene.position.z = scooterLoaderz;
    gltf.scene.position.y = 0 + islandY;
    
  
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("errrrrrrr", error);
  }
);

const mugloader = new GLTFLoader();
mugloader.setDRACOLoader(dracoLoader);
mugloader.load(
  "../mug.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        const m = child;
        //m.receiveShadow = true;
        m.castShadow = true;
      }
      if (child.isLight) {
        const l = child;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });

    scene.add(gltf.scene);

    gltf.scene.scale.set(28, 28, 28);
    gltf.scene.position.x = -130;
    gltf.scene.position.z = -130;
    gltf.scene.position.y = 0 + islandY;
    gltf.scene.rotateY(0);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("errrrrrrr", error);
  }
);

const roboloader = new GLTFLoader();
roboloader.setDRACOLoader(dracoLoader);
roboloader.load(
  "../robo.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        const m = child;
        //m.receiveShadow = true;
        m.castShadow = true;
      }
      if (child.isLight) {
        const l = child;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });

    scene.add(gltf.scene);

    gltf.scene.scale.set(18, 18, 18);
    gltf.scene.position.x = -30;
    gltf.scene.position.z = -190;
    gltf.scene.position.y = 0 + islandY;
    gltf.scene.rotation.y = 9.0;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("errrrrrrr", error);
  }
);

const manloader = new GLTFLoader();
manloader.setDRACOLoader(dracoLoader);
manloader.load(
  "../man.glb",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.isMesh) {
        const m = child;
        //m.receiveShadow = true;
        m.castShadow = true;
      }
      if (child.isLight) {
        const l = child;
        l.castShadow = true;
        l.shadow.bias = -0.003;
        l.shadow.mapSize.width = 2048;
        l.shadow.mapSize.height = 2048;
      }
    });

    scene.add(gltf.scene);

    gltf.scene.scale.set(18, 18, 18);
    gltf.scene.position.x = -60;
    gltf.scene.position.z = 190;
    gltf.scene.position.y = 0 + islandY;
    gltf.scene.rotation.y = 0.0;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log("errrrrrrr", error);
  }
);

const tree1 = new Tree().getTree(2)
scene.add(tree1)
tree1.position.y = 100;
tree1.position.x = 30;
tree1.position.z = 60;

const tree2 = new Tree().getTree(1.5);
scene.add(tree2);
tree2.position.y = 45;
tree2.position.z = 100;

const tree3 = new Tree().getTree(1);
scene.add(tree3);
tree3.position.y = 35;
tree3.position.x = 10;

const tree4 = new Tree().getTree(1.5);
scene.add(tree4);
tree4.position.y = 45;
tree4.position.x = 15;
tree4.position.z = 50;

const tree5 = new Tree().getTree(1.5);
scene.add(tree5);
tree5.position.y = 145;
tree5.position.x = 10;
tree5.position.z = 15;

const tree6 = new Tree().getTree(1);
scene.add(tree6);
tree6.position.y = 35;
tree6.position.x = 100;
tree6.position.z = 70;

const tree7 = new Tree().getTree(2.0);
scene.add(tree7);
tree7.position.y = 135;
tree7.position.x = -23;
tree7.position.z = 25;

const tree8 = new Tree().getTree(1);
scene.add(tree8);
tree8.position.y = 125;
tree8.position.x = -7;
tree8.position.z = 5;

const tree9 = new Tree().getTree(1.5);
scene.add(tree9);
tree9.position.y = 125;
tree9.position.x = 2;
tree9.position.z = -10;

const tree10 = new Tree().getTree(1.5);
scene.add(tree10);
tree10.position.y = 115;
tree10.position.x = 5;
tree10.position.z = 20;

const tree11 = new Tree().getTree(1);
scene.add(tree11);
tree11.position.y = 105;
tree11.position.x = 20;
tree11.position.z = 20;

const tree12 = new Tree().getTree(1);
scene.add(tree12);
tree12.position.y = 75;
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


function animate() {
  //Self-rotation
  const time = Date.now() * 0.0005;
  scooterLoaderx = Math.sin(time * 0.7) * 240;
  scooterLoaderz = Math.cos(time * 0.7) * 240;

if (runMixer) {
  runMixer.update(0.04);
}
// camera.position.x = 500 * Math.sin(cameraRotation);
//  camera.position.z = 500 * Math.cos(cameraRotation);
  
  centerBox.rotateY(Math.sin(cameraRotation));
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

  
  //  roller.position.x = Math.sin(time * 0.7) * 270;
  //  roller.position.z = Math.cos(time * 0.7) * 270;
  centerBox.rotateY(0.00001);
  for (var i = 0; i < cloudCount; i++) {
    cloudList[i].position.x += 0.9;
  }
 
  //roller.rotateX(-1 * rollerSpeed);
  camera.lookAt(0, 0, 0);


  centerBox1.rotation.y -= 0.01;
//scooterLady.rotation.y -= 0.01
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
