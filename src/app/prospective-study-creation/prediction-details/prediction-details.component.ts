import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prediction-details',
  templateUrl: './prediction-details.component.html',
  styleUrls: ['./prediction-details.component.css']
})
export class PredictionDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PredictionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  variablesColumn: string[] = ['name', 'data_type', 'type'];
  variables = [];

  ngOnInit(): void {
   
    this.variables = this.data.value; 
    console.log('data in the dialog: ', this.variables);
  }

  onClose() {
    this.dialogRef.close();
  }

}
