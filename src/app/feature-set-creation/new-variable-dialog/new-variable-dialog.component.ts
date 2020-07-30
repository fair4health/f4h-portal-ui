import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Variable } from '../../shared/variable';

@Component({
  selector: 'app-new-variable-dialog',
  templateUrl: './new-variable-dialog.component.html',
  styleUrls: ['./new-variable-dialog.component.css']
})
export class NewVariableDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewVariableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Variable) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
