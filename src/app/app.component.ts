import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` <app-header></app-header>
    <div class="app-body"><router-outlet></router-outlet></div>`,
  styles: ['.app-body { margin: 10px; }'],
})
export class AppComponent {
  title = 'Wydatki';
}
