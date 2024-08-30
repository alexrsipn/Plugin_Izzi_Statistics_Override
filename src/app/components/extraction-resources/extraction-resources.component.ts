import { Component } from '@angular/core';
import { AppStore } from '../../app.store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-extraction-resources',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './extraction-resources.component.html',
})
export class ExtractionResourcesComponent {
  vm$ = this.store.vm$;

  constructor(private readonly store: AppStore) {}

  getResources() {
    this.store.GetResources();
  }
}
