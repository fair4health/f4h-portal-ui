import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-distribution-dialog',
  templateUrl: './distribution-dialog.component.html',
  styleUrls: ['./distribution-dialog.component.css']
})
export class DistributionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DistributionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  distributionColumns: string[] = ['value', 'count', 'percentage'];
  valueDistribution = [];
  title: string

  ngOnInit(): void {
    this.valueDistribution = [];
    this.data.value.forEach(element => {
      let perc  = parseFloat(element.percentage)
      element.percentage = perc.toFixed(2);
    });
    this.valueDistribution = this.data.value;
    this.title = this.data.title;
  }

  onClose() {
    this.dialogRef.close();
  }

}
