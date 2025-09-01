import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server'; // <-- named import, must match
import { App } from './app/app';

export default function bootstrap() {
  return bootstrapApplication(App, config);
}