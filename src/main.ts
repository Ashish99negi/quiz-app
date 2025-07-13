import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // <--- Check this path carefully!
import { AppComponent } from './app/app.component'; // <--- Check this path carefully!

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));