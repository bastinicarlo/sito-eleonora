import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { prenotazione } from '../interface/prenotazione';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'prenotazione-dialog',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatInputModule, CommonModule],
  templateUrl: 'prenotazione-dialog.component.html',
})
export class PrenotazioneDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PrenotazioneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: prenotazione) {}
}