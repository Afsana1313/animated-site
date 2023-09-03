import * as THREE from "three";


const cloudGeo = (radius) => new THREE.SphereGeometry(radius, 200, 200);
  const textureLoader = new THREE.TextureLoader();
   const cloudTexture = textureLoader.load("../../cloud.jpg");
const cloudMat = new THREE.MeshStandardMaterial({ color: 'white', map: cloudTexture })
export class cloud  {

    constructor() {
        
    }
    getCloud() {
      const cloud1 = new THREE.Mesh(
        new THREE.SphereGeometry(10, 200, 200),
        new THREE.MeshBasicMaterial({ color: "white", map: cloudTexture })
      );
      const cloud2 = new THREE.Mesh(
        new THREE.SphereGeometry(10, 200, 200),
        new THREE.MeshBasicMaterial({ color: "white", map: cloudTexture })
      );
      const cloud3 = new THREE.Mesh(
        new THREE.SphereGeometry(10, 200, 200),
        new THREE.MeshBasicMaterial({ color: "white", map: cloudTexture })
      );
        const cloud4 = new THREE.Mesh(
          new THREE.SphereGeometry(5, 200, 200),
          new THREE.MeshBasicMaterial({ color: "white", map: cloudTexture })
        );
    
      cloud1.position.y = 10;


      cloud2.position.x = 15;
      cloud2.position.y = 5;
      
      cloud3.position.x = -15
      cloud3.position.y = 5;

       cloud4.position.x = -1;
      cloud4.position.y = 1;
      cloud4.position.z = 9
      // Create a torus geometry (bolster-like shape)
      const bolsterGeometry = new THREE.TorusGeometry(2, 4.0, 160, 320); // Adjust these parameters as needed

      // Create a material for the bolster
      const bolsterMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: cloudTexture
      }); // Adjust the color

      // Create a mesh using the geometry and material
      const bolster = new THREE.Mesh(bolsterGeometry, bolsterMaterial);
    
      bolster.position.x = 10;
      bolsterGeometry.scale(3, 1.5, 2.5);
      bolster.add(cloud1, cloud2, cloud3, cloud4);
      bolster.castShadow = true
      cloud1.castShadow = true;
      cloud2.castShadow = true;
      cloud3.castShadow = true;
      return bolster;
    }
}