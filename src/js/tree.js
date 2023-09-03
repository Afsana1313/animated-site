import * as THREE from "three";


export class Tree {
    constructor(scale) {
        this.scale = scale;

  }
    getTree(scale) {
      const commonColor = new THREE.Color(0x2615aa);
const coneBotGeo = new THREE.ConeGeometry(10, 15, 4);
const coneBotMat = new THREE.MeshPhongMaterial({ color: commonColor });
const coneBot = new THREE.Mesh(coneBotGeo, coneBotMat);



const coneMidGeo = new THREE.ConeGeometry(8, 15, 4);
const coneMidMat = new THREE.MeshPhongMaterial({ color: commonColor });
const coneMid = new THREE.Mesh(coneMidGeo, coneMidMat);
coneBot.add(coneMid);
coneMid.position.y = 10;

const coneTopGeo = new THREE.ConeGeometry(6, 10, 4);
const coneTopMat = new THREE.MeshPhongMaterial({ color: commonColor });
const coneTop = new THREE.Mesh(coneTopGeo, coneTopMat);
coneBot.add(coneTop);
coneTop.position.y = 15;

const cylinderWoodGeo = new THREE.CylinderGeometry(3, 3, 20, 300, 300);
const cylinderWoodMat = new THREE.MeshPhongMaterial({ color: 0x310c0c });
const cylinderWood = new THREE.Mesh(cylinderWoodGeo, cylinderWoodMat);
coneBot.add(cylinderWood);
cylinderWood.position.y = -10;

coneBot.castShadow = true;
coneMid.castShadow = true;
coneTop.castShadow = true;
      cylinderWood.castShadow = true;
    //   coneBotGeo.scale(this.scale, this.scale, this.scale);
    //   coneMidGeo.scale(this.scale, this.scale, this.scale);
    //   coneTopGeo.scale(this.scale, this.scale, this.scale);
    //   cylinderWoodGeo.scale(this.scale, this.scale, this.scale);
coneBot.scale.set(scale, scale, scale);
    return coneBot;
  }
}
