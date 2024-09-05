import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppStore } from './app.store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ControlDeskComponent } from './components/control-desk/control-desk.component';
import { SheetComponent } from './components/sheet/sheet.component';
import { ActivityDurationComponent } from './components/activity-duration/activity-duration.component';
import { ExtractionPropertiesComponent } from './components/extraction-properties/extraction-properties.component';
import { ExtractionResourcesComponent } from './components/extraction-resources/extraction-resources.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    SpinnerComponent,
    SheetComponent,
    ActivityDurationComponent,
    ExtractionPropertiesComponent,
    ExtractionResourcesComponent,
  ],
  templateUrl: './app.component.html',
  providers: [SheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly panelOpenState = signal(false);

  constructor(
    protected readonly store: AppStore,
    protected readonly sheet: SheetComponent
  ) {}
  updateActivityDuration() {
    this.store.UpdateActivityDurationStatistics();
  }
}
