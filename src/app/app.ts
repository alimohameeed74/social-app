import { Component, signal } from '@angular/core';
import { NavbarComponent } from './core/layouts/components/navbar/navbar.component';
import { LoaderComponent } from './core/layouts/components/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('social-app');
}
