import * as THREE from "three";

export class Clapper{
    constructor(){

    }
    getClapper(){
      // Create the clapper (box)
      const clapperGeometry = new THREE.BoxGeometry(40, 15, 2);
      const clapperMaterial = new THREE.MeshStandardMaterial({
        color: 0x120062,
        side: THREE.DoubleSide
      });
        const clapperBody = new THREE.Mesh(clapperGeometry, clapperMaterial);
        clapperBody.position.x = 120;
        clapperBody.position.z = 120;
        clapperBody.position.y = 10;
     

        const clapperGeo1 = new THREE.BoxGeometry(42, 2, 2);
        const clapperMat1 = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide
        });
        const clapperTop1 = new THREE.Mesh(clapperGeo1, clapperMat1);
       clapperTop1.position.y = 8
      
        clapperBody.add(clapperTop1)
        clapperBody.castShadow = true;
        clapperBody.rotateY(45);
        return clapperBody;
    }
}