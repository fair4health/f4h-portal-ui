import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Variable } from '../../shared/variable';

@Component({
  selector: 'app-new-variable-dialog',
  templateUrl: './new-variable-dialog.component.html',
  styleUrls: ['./new-variable-dialog.component.css']
})
export class NewVariableDialogComponent implements OnInit {

  fhirpathInputType = '1';
  pattern = '^\/[?a-zA-Z0-9]+?[a-zA-Z0-9._%+-:=]{1,100}$';

  constructor(
    public dialogRef: MatDialogRef<NewVariableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Variable) {}

  ngOnInit(): void {
    console.log('pattern', this.pattern);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
