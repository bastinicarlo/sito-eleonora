import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { prenotazione } from '../interface/prenotazione';

@Component({
  selector: 'prenotazioni-dialog',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, FormsModule, MatDialogModule, MatInputModule, CommonModule],
  templateUrl: 'prenotazioni-dialog.component.html',
})
export class PrenotazioniDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PrenotazioniDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[]) {
      console.log(data);
    }
}