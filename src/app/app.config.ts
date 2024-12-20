import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({
      "projectId": "vicci-6555e",
      "appId": "1:168265970401:web:c3fa65ffac8cc8a5a3bda0",
      "storageBucket": "vicci-6555e.appspot.com",
      "apiKey": "AIzaSyAkYaJXBGgHpjKbChg0hJG2VuJVSgKPQP8",
      "authDomain": "vicci-6555e.firebaseapp.com",
      "messagingSenderId": "168265970401",
      "measurementId": "G-WS4FM6BSSY"
    })),
      provideAuth(() => getAuth())
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } }
  ],
};
