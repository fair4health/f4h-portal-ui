import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fs-details-dialog',
  templateUrl: './fs-details-dialog.component.html',
  styleUrls: ['./fs-details-dialog.component.css']
})
export class FsDetailsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FsDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  variablesColumns: string[] = ['name', 'fhir_path', 'fhir_query', 'variable_data_type', 'variable_type'];
  variables = [];
  ngOnInit(): void {
    console.log("Data SEt: ", this.data);
    this.variables = this.data.variables;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
