import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.css'
})
export class InfoDialogComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string },
  private dialogRef: MatDialogRef<InfoDialogComponent>
) {}





  closeDialog(): void {
    console.log("cerrando informacion");
    this.dialogRef.close();
  }
}
