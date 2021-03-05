import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Variable } from '../../shared/variable';

declare var require: any;
const variables = require('../../core/automatic-variables.json');

@Component({
  selector: 'app-new-variable-dialog',
  templateUrl: './new-variable-dialog.component.html',
  styleUrls: ['./new-variable-dialog.component.css']
})


export class NewVariableDialogComponent implements OnInit {

  fhirpathInputType = '1';
  pattern = '^\/[?a-zA-Z0-9]+?[a-zA-Z0-9._%+-:=]{1,100}$';
  projectType: string;
  selection = 'auto';
  variables: any;
  selectedVariable: any;
  inputDisabled: boolean;
  fieldType: string;
  public fieldData = '';
  public fieldNumber = 0;


  constructor(
    public dialogRef: MatDialogRef<NewVariableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Variable,
    private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    this.variables = variables;
    this.projectType = this.localStorage.projectType;
    this.data.variable_type = 'independent';

    this.onOpenAuto(this.variables[0]);
  }

  onOpenAuto(variable): void {
    this.selectedVariable = variable;
    console.log('selected variabnle: ', this.selectedVariable);
    this.data.variable_data_type = variable.dataType;
    this.data.fhir_query = variable.fhirQuery;
    this.data.fhir_path = variable.fhirPath;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectionType(type): void {
    this.selection = type;
  }

  selectvariable(event): void {
    this.selectedVariable = event.value;
    if (event.value.fieldType === 'disabled') {
      this.inputDisabled = true;
    } else if (event.value.fieldType !== 'disabled') {
      this.inputDisabled = false;
      this.fieldType = event.value.fieldType;
    }

    // this.data.name = event.value.name;
    this.data.variable_data_type = event.value.dataType;
    this.data.fhir_query = event.value.fhirQuery;
    this.data.fhir_path = event.value.fhirPath;

  }

  setValueToQuery(): void {

    this.data.fhir_query = this.data.fhir_query.replace('{string_value}', this.fieldData);
    this.data.fhir_query = this.data.fhir_query.replace('{integer_value}', this.fieldData);
    this.data.fhir_path = this.data.fhir_path.replace('{integer_value}', this.fieldData);
    this.data.fhir_path = this.data.fhir_path.replace('{string_value}', this.fieldData);

    if (this.data.name === 'Readmitted in X days') {
      const result = parseInt(this.fieldData) + 1;
      this.data.fhir_path = this.data.fhir_path.replace('{integer_value + 1}', result.toString());
    }

    this.dialogRef.close(this.data);
  }
}
