import { Component, Inject, OnInit } from '@angular/core';
import { CriteriaParameter } from '../../shared/criteriaparameters';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface Value {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-criteriaparameter-dialog',
  templateUrl: './new-criteriaparameter-dialog.component.html',
  styleUrls: ['./new-criteriaparameter-dialog.component.css']
})
export class NewCriteriaparameterDialogComponent implements OnInit {
  selectedResource: string;
  selectedParameter: string;
  selectedOperation: string;

  resources: Value[] = [
    {value: 'Patient', viewValue: 'Patient'},
    {value: 'Observation', viewValue: 'Observation'},
    {value: 'Encounter', viewValue: 'Encounter'},
    {value: 'Condition', viewValue: 'Condition'},
    {value: 'Medication', viewValue: 'Medication'}
  ];

  parameters: Value[] = [
    {value: 'age', viewValue: 'Age'},
    {value: 'bithdate', viewValue: 'Bithdate'},
    {value: 'Address', viewValue: 'Address'},
    {value: 'code', viewValue: 'Code'},
    {value: 'gender', viewValue: 'Gender'},
    {value: 'name', viewValue: 'Name'},
    {value: 'organization', viewValue: 'Organization'},
    {value: 'phone', viewValue: 'Phone'}
  ];

  operations: Value[] = [
    {value: 'equal', viewValue: '='},
    {value: 'bigger', viewValue: '>'},
    {value: 'less', viewValue: '<'},
    {value: 'biggerequal', viewValue: '>='},
    {value: 'lessequal', viewValue: '<='}
  ];
  constructor(
    public dialogRef: MatDialogRef<NewCriteriaparameterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CriteriaParameter) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
