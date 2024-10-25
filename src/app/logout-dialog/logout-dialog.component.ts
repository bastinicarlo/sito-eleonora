import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'logout-dialog',
  standalone: true,
  imports: [MatButtonModule, MatFormField, FormsModule, MatDialogModule, MatInputModule, CommonModule],
  templateUrl: 'logout-dialog.component.html',
})
export class LogoutDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LogoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {}
}