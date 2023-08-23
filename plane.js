import * as THREE from "three";

export class Plane {
  constructor(color, width, height) {
    this.color = color;
    this.width = width;
    this.height = height;
  }
  getPlane() {
    const planegeometry = new THREE.PlaneGeometry(this.width, this.height);
    const planematerial = new THREE.MeshBasicMaterial({
      color: this.color,
      opacity: 0.1,
      combine: { blur: 0.2 },
      reflectivity: 20
    });
    return new THREE.Mesh(planegeometry, planematerial);
  }
}

// export const plane = (color = "red", width = 3, height = 3) => {
//   const planegeometry = new THREE.PlaneGeometry(width, height);
//   const planematerial = new THREE.MeshBasicMaterial({
//     color: color,
//     opacity: 0.1,
//     combine: { blur: 0.2 },
//     reflectivity: 20
//   });
//   return new THREE.Mesh(planegeometry, planematerial);
// };
