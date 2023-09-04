import * as THREE from "three";

export class SmallTree {
  constructor(scale) {
    this.scale = scale;
  }
  getSmallTree(scale=1) {
    const commonColor = new THREE.Color(0xffffff);
    const coneBotGeo = new THREE.SphereGeometry(1, 12, 14);
    const coneBotMat = new THREE.MeshPhongMaterial({ color: commonColor });
    const coneBot = new THREE.Mesh(coneBotGeo, coneBotMat);


    const cylinderWoodGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 3, 3);
    const cylinderWoodMat = new THREE.MeshPhongMaterial({ color: 0x310c0c });
    const cylinderWood = new THREE.Mesh(cylinderWoodGeo, cylinderWoodMat);
      coneBot.add(cylinderWood);
       cylinderWood.position.y = -3;
   

    coneBot.castShadow = true;
    cylinderWood.castShadow = true;
    //   coneBotGeo.scale(this.scale, this.scale, this.scale);
    //   coneMidGeo.scale(this.scale, this.scale, this.scale);
    //   coneTopGeo.scale(this.scale, this.scale, this.scale);
    //   cylinderWoodGeo.scale(this.scale, this.scale, this.scale);
      coneBot.scale.set(scale, scale, scale);
      coneBot.position.y = 2
    return coneBot;
  }
}

export function allSmallTree() {
    const allTree = []
    const smallTreeCount = 200
    for (var i = 0; i < smallTreeCount; i++) {
      const singleTree = new SmallTree().getSmallTree(1);
      singleTree.position.x =
        Math.random() * 200 * (Math.random() > 0.5 ? -1 : 1);
      singleTree.position.z =
        Math.random() * 200 * (Math.random() > 0.5 ? -1 : 1);
      allTree.push(singleTree);
    }
    return allTree;
}