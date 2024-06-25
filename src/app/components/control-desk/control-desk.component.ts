import { Component, Input, Output } from '@angular/core';
import { ControlDesk } from '../../types/plugin';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-control-desk',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatRadioModule],
  templateUrl: './control-desk.component.html',
})
export class ControlDeskComponent {
  selectedDesk = new FormControl<ControlDesk | null>(null);
  @Input() controlDesks: ControlDesk[] = [];
  @Output() deskChanged = this.selectedDesk.valueChanges;
}
