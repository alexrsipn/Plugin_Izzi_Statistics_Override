import { Component } from '@angular/core';
import { AppStore } from './app.store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ControlDeskComponent } from './components/control-desk/control-desk.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    SpinnerComponent,
    ControlDeskComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(protected readonly store: AppStore) {}
}
