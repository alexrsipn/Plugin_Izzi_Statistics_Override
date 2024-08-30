import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppStore } from '../../app.store';

@Component({
  selector: 'app-extraction-properties',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './extraction-properties.component.html',
})
export class ExtractionPropertiesComponent {
  vm$ = this.store.vm$;

  constructor(private readonly store: AppStore) {}

  getPropertyValues() {
    this.store.GetPropertiesValues();
  }
}
