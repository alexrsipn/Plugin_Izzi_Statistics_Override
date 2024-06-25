import { Injectable } from '@angular/core';
import { utils, writeFileXLSX } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  exportToExcel(data: unknown[][], filename: string = 'activities') {
    const ws = utils.aoa_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, `${filename}.xlsx`);
  }
}
