// import 'primeflex/primeflex.css';
// import 'primeicons/primeicons.css';
// import 'primeng/resources/themes/lara-light-indigo/theme.css';
// import 'primeng/resources/primeng.min.css';

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
