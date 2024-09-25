import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { AppStore } from '../../app.store';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GetActivityDurationItem } from 'src/app/types/ofs-rest-api';

type duration = GetActivityDurationItem[];

@Component({
  selector: 'app-activity-duration',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './activity-duration.component.html',
})
export class ActivityDurationComponent {
  vm$ = this.store.vm$;
  private _bottomSheet = inject(MatBottomSheet);
  dataSource: duration = [];
  headers: string[] = [];

  constructor(private readonly store: AppStore) {}

  getActivityDuration() {
    this.store.GetActivityDurationStatistics();
    this.metadataTable();
  }

  showInfo(): void {
    this._bottomSheet.open(BottomSheetInfo);
  }

  metadataTable() {
    this.vm$.subscribe(({ activityDuration }) => {
      if (activityDuration.length > 0) {
        this.headers = Object.keys(activityDuration[0]);
        this.dataSource = activityDuration;
      }
    });
  }
}

@Component({
  selector: 'bottom-sheet-info',
  standalone: true,
  imports: [MatListModule],
  template: `
    <mat-nav-list>
      <p>
        <strong>Clave:</strong> Normas definidas por la empresa para tipos de
        trabajo específicos y condiciones de trabajo en los parámetros de
        Estadísticas.
      </p>
      <p><strong>Recurso</strong>: Clave única del recurso.</p>
      <p>
        <strong>Sustitución</strong>: Valor de sustitución, si se añade a través
        de la API.
      </p>
      <p>
        <strong>Promedio</strong>: Valor medio de minutos que se estima
        estadísticamente para una clave de actividad.
      </p>
      <p>
        <strong>Conteo</strong>: Cantidad de actividades completadas, en la que
        se basan las estadísticas de trabajo.
      </p>
      <p>
        <strong>Nivel</strong>: Indica si las estadísticas son a nivel de
        empresa, bucket o recurso. A nivel de empresa, se basan en toda la
        empresa, mientras que las otras se basan en el trabajo del bucket o
        recurso.
      </p>
      <p>
        <strong>Desviación</strong>: Desviación estándar de la duración
        estimmada en minutos.
      </p>
    </mat-nav-list>
  `,
})
export class BottomSheetInfo {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<BottomSheetInfo>>(MatBottomSheetRef);

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault;
  }
}
