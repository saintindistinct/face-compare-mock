// import { Component, ViewChild, ElementRef, computed, signal } from '@angular/core';
// import { NgIf } from '@angular/common';
// import * as faceapi from 'face-api.js';
// import { FaceService } from '../face.service';

// @Component({
//   selector: 'app-compare-face',
//   standalone: true,
//   imports: [NgIf],
//   templateUrl: './compare-face.component.html',
//   styleUrls: ['./compare-face.component.css'],
// })
// export class CompareFaceComponent {
//   // previews
//   imgUrlA = signal<string | null>(null);
//   imgUrlB = signal<string | null>(null);

//   // result signals
//   status = signal<'idle' | 'processing' | 'done' | 'error'>('idle');
//   message = signal<string>('');
//   distance = signal<number | null>(null);
//   threshold = 0.6; // typical threshold for same-person

//   // canvas overlays
//   @ViewChild('canvasA') canvasA!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('canvasB') canvasB!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('imgA') imgA!: ElementRef<HTMLImageElement>;
//   @ViewChild('imgB') imgB!: ElementRef<HTMLImageElement>;

//   constructor(private face: FaceService) {}

//   onFileA(e: Event) {
//     const f = (e.target as HTMLInputElement).files?.[0];
//     if (!f) return;
//     this.imgUrlA.set(URL.createObjectURL(f));
//     this.clearResult();
//   }

//   onFileB(e: Event) {
//     const f = (e.target as HTMLInputElement).files?.[0];
//     if (!f) return;
//     this.imgUrlB.set(URL.createObjectURL(f));
//     this.clearResult();
//   }

//   private clearResult() {
//     this.status.set('idle');
//     this.message.set('');
//     this.distance.set(null);
//     this.clearCanvas(this.canvasA);
//     this.clearCanvas(this.canvasB);
//   }

//   private clearCanvas(ref: ElementRef<HTMLCanvasElement>) {
//     if (!ref) return;
//     const c = ref.nativeElement;
//     const ctx = c.getContext('2d');
//     if (ctx) ctx.clearRect(0, 0, c.width, c.height);
//   }

//   async compare() {
//     if (!this.face.ready) {
//       this.message.set('Models are not loaded yet. Try again in a moment.');
//       return;
//     }
//     if (!this.imgUrlA() || !this.imgUrlB()) {
//       this.message.set('Please select both images.');
//       return;
//     }

//     this.status.set('processing');
//     this.message.set('Detecting faces...');

//     // wait for images to render in the DOM
//     await this.waitForImage(this.imgA.nativeElement);
//     await this.waitForImage(this.imgB.nativeElement);

//     // run detection
//     const a = await this.face.getSingleDescriptorFrom(this.imgA.nativeElement);
//     const b = await this.face.getSingleDescriptorFrom(this.imgB.nativeElement);

//     if (!a || !b) {
//       this.status.set('error');
//       this.message.set(
//         `Face not detected in ${!a ? 'Image A' : 'Image B'}. Try a clearer, front-facing photo.`
//       );
//       return;
//     }

//     // draw boxes + landmarks
//     this.drawOverlay(this.imgA.nativeElement, this.canvasA.nativeElement, [a]);
//     this.drawOverlay(this.imgB.nativeElement, this.canvasB.nativeElement, [b]);

//     // compare descriptors
//     const dist = this.face.euclideanDistance(a.descriptor, b.descriptor);
//     this.distance.set(dist);

//     const isSame = dist < this.threshold;
//     this.status.set('done');
//     this.message.set(isSame ? '✅ Likely the same person' : '❌ Likely different people');
//   }

//   private async waitForImage(img: HTMLImageElement) {
//     if (img.complete && img.naturalWidth > 0) return;
//     await new Promise<void>((resolve) => {
//       img.onload = () => resolve();
//       img.onerror = () => resolve();
//     });
//   }

//   private drawOverlay(
//     img: HTMLImageElement,
//     canvas: HTMLCanvasElement,
//     results: Array<
//       faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>
//     >
//   ) {
//     const displaySize = { width: img.width, height: img.height };
//     canvas.width = displaySize.width;
//     canvas.height = displaySize.height;

//     const resized = faceapi.resizeResults(results, displaySize);
//     faceapi.draw.drawDetections(canvas, resized);
//     faceapi.draw.drawFaceLandmarks(canvas, resized);
//   }
// }

import { Component, ViewChild, ElementRef, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import * as faceapi from 'face-api.js';
import { FaceService } from '../face.service';

@Component({
  selector: 'app-compare-face',
  standalone: true,
  imports: [NgIf],
  templateUrl: './compare-face.component.html',
  styleUrls: ['./compare-face.component.css'],
})
export class CompareFaceComponent {
  imgUrlA = signal<string | null>(null);
  imgUrlB = signal<string | null>(null);

  status = signal<'idle' | 'processing' | 'done' | 'error'>('idle');
  message = signal<string>('');
  distance = signal<number | null>(null);
  threshold = 0.6; // same-person if distance < threshold

  @ViewChild('canvasA') canvasA!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasB') canvasB!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imgA') imgA!: ElementRef<HTMLImageElement>;
  @ViewChild('imgB') imgB!: ElementRef<HTMLImageElement>;

  constructor(private face: FaceService) {}

  onFileA(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.imgUrlA.set(URL.createObjectURL(f));
    this.clearResult();
  }

  onFileB(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.imgUrlB.set(URL.createObjectURL(f));
    this.clearResult();
  }

  private clearResult() {
    this.status.set('idle');
    this.message.set('');
    this.distance.set(null);
    this.clearCanvas(this.canvasA);
    this.clearCanvas(this.canvasB);
  }

  private clearCanvas(ref: ElementRef<HTMLCanvasElement>) {
    if (!ref) return;
    const c = ref.nativeElement;
    const ctx = c.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, c.width, c.height);
  }

  private async waitForImage(img: HTMLImageElement) {
    if (img.complete && img.naturalWidth > 0) return;
    await new Promise<void>((res) => {
      img.onload = () => res();
      img.onerror = () => res();
    });
  }

  private drawOverlay(
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    results:
      | Array<faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>>
      | Array<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>
  ) {
    const displaySize = { width: img.width, height: img.height };
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    const resized = faceapi.resizeResults(results as any, displaySize);
    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);
  }

  private drawMatchesOnGroup(
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    results: Array<{
      fd: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>>;
      best: faceapi.FaceMatch;
    }>
  ) {
    const displaySize = { width: img.width, height: img.height };
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;

    const resized = faceapi.resizeResults(
      results.map((r) => r.fd),
      displaySize
    );
    faceapi.draw.drawDetections(canvas, resized);

    resized.forEach((r, i) => {
      const isMatch = results[i].best.label === 'reference';
      const dist = results[i].best.distance;
      const drawBox = new faceapi.draw.DrawBox(r.detection.box, {
        label: `${isMatch ? 'MATCH' : 'NO MATCH'} (${dist.toFixed(3)})`,
        lineWidth: 2,
        boxColor: isMatch ? '#16a34a' : '#ef4444',
      });
      drawBox.draw(canvas);
    });
  }

  // ===== One-vs-Many compare =====
  async compare() {
    if (!this.face.ready) {
      this.message.set('Models not loaded yet.');
      return;
    }
    if (!this.imgUrlA() || !this.imgUrlB()) {
      this.message.set('Please select both images.');
      return;
    }

    this.status.set('processing');
    this.message.set('Detecting faces...');
    await this.waitForImage(this.imgA.nativeElement);
    await this.waitForImage(this.imgB.nativeElement);

    // 1) Single face from Image A (reference)
    const ref = await this.face.getSingleDescriptorFrom(this.imgA.nativeElement);
    if (!ref) {
      this.status.set('error');
      this.message.set('No face found in Image A.');
      return;
    }
    this.drawOverlay(this.imgA.nativeElement, this.canvasA.nativeElement, [ref]);

    // 2) All faces from Image B (group)
    const group = await this.face.getAllDescriptorsFrom(this.imgB.nativeElement);
    if (!group.length) {
      this.status.set('error');
      this.message.set('No faces found in Image B.');
      return;
    }

    // 3) Match each group face to the single reference
    const labeled = [new faceapi.LabeledFaceDescriptors('reference', [ref.descriptor])];
    const matcher = new faceapi.FaceMatcher(labeled, this.threshold);
    const results = group.map((g) => ({ fd: g, best: matcher.findBestMatch(g.descriptor) }));

    // 4) Draw & summarize
    this.drawMatchesOnGroup(this.imgB.nativeElement, this.canvasB.nativeElement, results);
    const positives = results.filter((r) => r.best.label === 'reference').length;
    const distances = results.map((r) => r.best.distance);
    const minDist = Math.min(...distances);
    this.status.set('done');
    this.message.set(
      `Found ${group.length} face(s) in Image B. Matches with Image A: ${positives}.`
    );
    this.distance.set(minDist);
  }
}
