import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    {
      provide: FIREBASE_OPTIONS,
      useValue: 
      {
        "apiKey": "AIzaSyAlZhq2nsi6Hl3dAeEoUFQzje1NaxSE-N0",
        "authDomain": "product-management-syste-4c68c.firebaseapp.com",
        "projectId": "product-management-syste-4c68c",
        "storageBucket": "product-management-syste-4c68c.appspot.com",
        "messagingSenderId": "122627380192",
        "appId": "1:122627380192:web:1cab19dc5a8f3562365185"
      }
    },
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideNzI18n(en_US), 
    importProvidersFrom(FormsModule), 
    provideAnimationsAsync(), 
    provideHttpClient()
  ]
};
