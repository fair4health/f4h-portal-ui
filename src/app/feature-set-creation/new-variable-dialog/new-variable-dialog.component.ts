import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UserCommunicationService } from 'src/app/core/services/user-communication.service';
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

  variableForm = new FormGroup({
    name: new FormControl('', Validators.required),
    fhir_path: new FormControl('', Validators.required),
    fhir_query: new FormControl('', Validators.required),
    variable_data_type: new FormControl('', Validators.required),
    variable_type: new FormControl('', Validators.required),
    selectedVariable: new FormControl('', Validators.required),
    fieldData: new FormControl(''),

  })

  requiredFields = {
    name: true,
    fhir_path: true,
    fhir_query: true,
    variable_data_type: true,
    variable_type: true,
    fieldData: true,
    selectedVariable: true,
  }


  constructor(
    public dialogRef: MatDialogRef<NewVariableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Variable,
    private localStorage: LocalStorageService,
    private userCommunication: UserCommunicationService) {}

  ngOnInit(): void {
    this.variables = variables;
    this.projectType = this.localStorage.projectType;
  //  this.data.variable_type = 'independent';
    this.variableForm.get('variable_type').setValue('independent');

    this.onOpenAuto(this.variables[0]);
  }

  onOpenAuto(variable): void {
    this.selectedVariable = variable;
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
    this.variableForm.get('selectedVariable').setValue(event.value);
    if (event.value.fieldType === 'disabled') {
      this.inputDisabled = true;
    } else if (event.value.fieldType !== 'disabled') {
      this.inputDisabled = false;
      this.fieldType = event.value.fieldType;
      this.variableForm.get('fieldData').setValidators(Validators.required);
    }
    this.variableForm.get('variable_data_type').setValue(event.value.dataType);
    this.variableForm.get('fhir_query').setValue(event.value.fhirQuery);
    this.variableForm.get('fhir_path').setValue(event.value.fhirPath);

  }

  setValueToQuery(): void {

    this.fieldData = this.variableForm.get('fieldData').value;

    // get the data from the for to the variable body to save.
    this.data.fhir_query = this.variableForm.get('fhir_query').value;
    this.data.fhir_path = this.variableForm.get('fhir_path').value;

    // replace value type for empty string.
    this.data.fhir_query = this.data.fhir_query.replace('{string_value}', this.fieldData);
    this.data.fhir_query = this.data.fhir_query.replace('{integer_value}', this.fieldData);
    this.data.fhir_path = this.data.fhir_path.replace('{integer_value}', this.fieldData);
    this.data.fhir_path = this.data.fhir_path.replace('{string_value}', this.fieldData);


    // set name of variable.
    this.data.name = this.variableForm.get('name').value;
    
    // set value of variable_data_type (numeric, categorical)
    this.data.variable_data_type = this.variableForm.get('variable_data_type').value;

    // set variable type
    this.data.variable_type = this.variableForm.get('variable_type').value;

    if (this.selection === 'manual') {
      this.variableForm.get('selectedVariable').setValue(' ');
      this.variableForm.get('selectedVariable').touched;
    }
    
    if (this.data.name === 'Readmitted in X days') {
      const result = parseInt(this.fieldData) + 1;
      this.data.fhir_path = this.data.fhir_path.replace('{integer_value + 1}', result.toString());
    }
    if (this.variableForm.valid) {
      this.dialogRef.close(this.data);
    }
    else {

      Object.keys(this.variableForm.controls).forEach(key => {
        this.variableForm.get(key).markAsTouched();
        this.requiredFields[key] = this.variableForm.get(key).valid
      });
      this.userCommunication.createMessage(this.userCommunication.ERROR, 'There are empty fields that are required to fill');
    }
  }
}
