import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { prenotazione } from '../interface/prenotazione';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'elimina-prenotazione',
  standalone: true,
  imports: [MatButtonModule, FormsModule, MatDialogModule, MatInputModule, CommonModule],
  templateUrl: 'elimina-prenotazione-dialog.component.html',
})
export class EliminaPrenotazioneDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EliminaPrenotazioneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: prenotazione) {}
}