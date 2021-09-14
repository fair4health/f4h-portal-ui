import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DistributionDialogComponent } from '../distribution-dialog/distribution-dialog.component';

@Component({
  selector: 'app-see-all-distribution-dialog',
  templateUrl: './see-all-distribution-dialog.component.html',
  styleUrls: ['./see-all-distribution-dialog.component.css']
})
export class SeeAllDistributionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DistributionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  distributionColumns: string[] = ['value', 'count', 'percentage'];
  valueDistribution = [];

  ngOnInit(): void {
    console.log('data en el dialogo::::',this.data.value.variable_statistics);

    this.valueDistribution = this.data.value.variable_statistics;

  }

  onClose() {
    this.dialogRef.close();
  }

}
