import * as THREE from "three";


const cloudGeo = (radius) => new THREE.SphereGeometry(radius, 200, 200);
const cloudMat = new THREE.MeshStandardMaterial({ color: 'white' })
export class cloud  {

    constructor() {
        
    }
    getPlane() {
      const cloud1 = new THREE.Mesh(
        new THREE.SphereGeometry(2, 200, 200),
        cloudMat
      );
      const cloud2 = new THREE.Mesh(
        new THREE.SphereGeometry(3, 200, 200),
        cloudMat
      );
      const cloud3 = new THREE.Mesh(
        new THREE.SphereGeometry(4, 200, 200),
        cloudMat
        );
        cloud2.position.x = -2
        cloud1.position.y = 2
      cloud3.add(cloud1, cloud2)
      return cloud3;
    }
}