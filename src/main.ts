import { bootstrapApplication } from '@angular/platform-browser';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { FaceService } from './app/face.service';
import { App } from './app/app';

function initFaceModels(face: FaceService) {
  return () => face.init();
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initFaceModels,
      deps: [FaceService],
    },
  ],
}).catch((err) => console.error(err));
