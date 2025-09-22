// import { Injectable } from '@angular/core';
// import * as faceapi from 'face-api.js';

// @Injectable({ providedIn: 'root' })
// export class FaceService {
//   private _ready = false;

//   get ready() {
//     return this._ready;
//   }

//   async init(): Promise<void> {
//     if (this._ready) return;

//     const base = '/assets/models'; // served by Angular
//     await Promise.all([
//       faceapi.nets.ssdMobilenetv1.loadFromUri(base),
//       faceapi.nets.faceLandmark68Net.loadFromUri(base),
//       faceapi.nets.faceRecognitionNet.loadFromUri(base),
//     ]);

//     this._ready = true;
//   }

//   async getSingleDescriptorFrom(imgEl: HTMLImageElement) {
//     // detect + landmarks + descriptor (best balance)
//     const res = await faceapi
//       .detectSingleFace(imgEl, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
//       .withFaceLandmarks()
//       .withFaceDescriptor();
//     return res; // null if no face
//   }

//   euclideanDistance(a: Float32Array, b: Float32Array) {
//     return faceapi.euclideanDistance(Array.from(a), Array.from(b));
//   }
// }

import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({ providedIn: 'root' })
export class FaceService {
  private _ready = false;
  get ready() {
    return this._ready;
  }

  async init(): Promise<void> {
    if (this._ready) return;
    const base = 'assets/models'; // <-- now using src/assets/models
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(base),
      faceapi.nets.faceLandmark68Net.loadFromUri(base),
      faceapi.nets.faceRecognitionNet.loadFromUri(base),
      // add more if you use them:
      // faceapi.nets.ageGenderNet.loadFromUri(base),
      // faceapi.nets.faceExpressionNet.loadFromUri(base),
    ]);
    this._ready = true;
  }

  async getSingleDescriptorFrom(imgEl: HTMLImageElement) {
    return await faceapi
      .detectSingleFace(imgEl, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor();
  }

  async getAllDescriptorsFrom(imgEl: HTMLImageElement) {
    return await faceapi
      .detectAllFaces(imgEl, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptors();
  }
}
