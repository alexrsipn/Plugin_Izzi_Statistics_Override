import { NgIf } from '@angular/common';
import { Component, Inject, Injectable } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  error(error: Error): Observable<void> {
    const dialogRef = this.dialog.open(ErrDialogComponent, {
      data: error,
    });
    return dialogRef.afterClosed();
  }

  success(message: string): Observable<void> {
    const dialogRef = this.dialog.open(SuccDialogComponent, {
      data: message,
    });
    return dialogRef.afterClosed();
  }
}

@Component({
  selector: 'app-err-dialog',
  standalone: true,
  imports: [NgIf, MatIconModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title style="margin-top: 1rem; display: flex;">
      <span>Error </span>
      <span style="align-self: center;"
        ><mat-icon
          aria-hidden="false"
          aria-label="Error Icon"
          fontIcon="error"
          color="warn"
        ></mat-icon
      ></span>
    </h2>
    <mat-dialog-content>
      <span *ngIf="data; else unidentifiedError">
        <p>Nombre: {{ data.name }}</p>
        <p>Mensaje: {{ data.message }}</p>
      </span>
      <ng-template #unidentifiedError><p>Error no identificado</p></ng-template>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button class="w-full" mat-button mat-dialog-close>Aceptar</button>
    </mat-dialog-actions>
  `,
})
export class ErrDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Error) {}
}

@Component({
  selector: 'app-scc-dialog',
  standalone: true,
  imports: [MatIconModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title style="margin-top: 1rem; display: flex;">
      <span>Éxito </span>
      <span style="align-self: center;"
        ><mat-icon
          aria-hidden="false"
          aria-label="Success Icon"
          fontIcon="check_circle"
          color="primary"
        ></mat-icon
      ></span>
    </h2>
    <mat-dialog-content>
      <p>{{ data }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button class="w-full" color="basic" mat-button mat-dialog-close>
        Aceptar
      </button>
    </mat-dialog-actions>
  `,
})
export class SuccDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
