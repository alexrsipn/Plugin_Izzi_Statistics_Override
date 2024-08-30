import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AppStore } from '../../app.store';

@Component({
  selector: 'app-activity-duration',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './activity-duration.component.html',
})
export class ActivityDurationComponent {
  vm$ = this.store.vm$;

  constructor(private readonly store: AppStore) {}

  getActivityDuration() {
    this.store.GetActivityDurationStatistics();
  }
}
