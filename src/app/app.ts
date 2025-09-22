import { Component } from '@angular/core';
import { CompareFaceComponent } from './compare-face/compare-face.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CompareFaceComponent],
  template: `<app-compare-face />`,
})
export class App {}
