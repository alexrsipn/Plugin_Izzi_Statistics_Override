import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { UpdateActivityDurationStatisticsItem } from '../../types/ofs-rest-api';
import { AppStore } from '../../app.store';

type AOA = UpdateActivityDurationStatisticsItem[];

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './sheet.component.html',
})
export class SheetComponent {
  vm$ = this.store.vm$;

  constructor(private readonly store: AppStore) {}

  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'layout_override.xlsx';
  headers: string[] = [];
  wb?: XLSX.WorkBook;
  ws?: XLSX.WorkSheet;
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) {
      throw new Error('No se soporta multiarchivos');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.wb = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = this.wb.SheetNames[0];
      this.ws = this.wb.Sheets[wsname];
      const dataRaw = XLSX.utils.sheet_to_json(this.ws, { header: 1 });
      this.data = this.DataToJSON(dataRaw);
      this.store.setLayoutData(this.data);
      this.store.setLayoutLength(this.data.length);
      this.headers = Object.keys(this.data[0]);
    };
    reader.readAsArrayBuffer(target.files[0]);
  }

  DataToJSON(data: any[]): any[] {
    const object: any[] = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const item = {
        akey: row[0].toString(),
        resourceId: row[1] ? row[1] : '',
        override: row[2] ? row[2] : 0,
      };
      object.push(item);
    }
    return object;
  }

  CleanData() {
    if (this.wb) {
      this.wb.SheetNames.forEach((sheetName) => {
        delete this.wb!.Sheets[sheetName];
        this.wb!.SheetNames = [];
        this.wb = undefined;
        this.ws = undefined;
        console.log('Limpiar data del archivo cargado');
      });
    }
  }

  clean() {
    this.data = [];
  }

  updateActivityDuration() {
    this.store.UpdateActivityDurationStatistics();
  }

  resetLayoutData() {
    this.data = [];
    this.store.resetLayoutData();
  }
}
