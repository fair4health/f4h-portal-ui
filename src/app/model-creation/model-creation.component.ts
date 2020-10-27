/**
 * @license
 * Copyright (C) 2020  Atos Spain SA. All rights reserved.
 *
 * Use of this source code is governed by a license style Apache License, Version 2.0 that can be
 * found in the LICENSE file at https://github.com/fair4health/f4h-portal-ui/blob/master/LICENSE
 *
 * The software is provided "AS IS", without any warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a particular
 * purpose and noninfringement, in no event shall the authors or copyright holders be
 * liable for any claim, damages or other liability, whether in action of contract, tort or
 * otherwise, arising from, out of or in connection with the software or the use or other
 * dealings in the software.
 *
 * See README file for the full disclaimer information and LICENSE file for full license
 * information in the project root.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '../core/services/local-storage.service';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { DmModel } from '../shared/dm-model';
import { of } from 'rxjs';
import { variable } from '@angular/compiler/src/output/output_ast';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-model-creation',
  templateUrl: './model-creation.component.html',
  styleUrls: ['./model-creation.component.css']
})
export class ModelCreationComponent implements OnInit {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  formGroup5: FormGroup;
  formGroup6: FormGroup;

  newDMModel: DmModel;
  selectedDatasetRow;

  datasetSelectionDisplayedColumns: string[] = ['select', 'name', 'description', 'data_sources', 'created_by', 'creation_time', 'details'];
  datasetSelectionDataSource;

  categorialVariablesColumns: string[] = ['name', 'fhir_path', 'fhir_query', 'variable_type'];
  categorigalVariablesDataSource;

  missingDataColumns: string[] = ['name', 'variable_type', 'operation', 'value'];
  missingDataDataSource;
  operations: any[] = [
    {value: 'set_minimum', viewValue: 'Set minimum'},
    {value: 'set_maximum', viewValue: 'Set maximun'},
    {value: 'set_average', viewValue: 'Set average'},
    {value: 'set_mean', viewValue: 'Set mean'},
    {value: 'set_median', viewValue: 'Set median'},
    {value: 'set_specific', viewValue: 'Set specific'},
  ];
  selectedOperation;

  componentDirection: string;
  featureSetVariables;

  constructor(
    private backendService: BackendService,
    private localStorage: LocalStorageService,
    private userCommunication: UserCommunicationService,
    private formBuilder: FormBuilder
    ) {}


    /**
     * TODO: methods to get data in the sections:
     *  3 - Categorial variables.
     *  4 - Missing data.
     *  5 - Algorithm selection.
     */
  ngOnInit(): void {
    this.newDMModel = new DmModel();
    this.getDataSets();

    this.formGroup1 = this.formBuilder.group({
      // formGroup1: ['', Validators.required]
      name: ['',  Validators.required],
      description: ['',  Validators.required],
    });
    this.formGroup2 = this.formBuilder.group({
      formGroup2: ['', Validators.required]
    });
    this.formGroup3 = this.formBuilder.group({
      formGroup3: ['', Validators.required]
    });
    this.formGroup4 = this.formBuilder.group({
      // formGroup4: ['', Validators.required]
      missing_data_operation: ['']
    });
    this.formGroup5 = this.formBuilder.group({
      formGroup5: ['', Validators.required]
    });
    this.formGroup6 = this.formBuilder.group({
      formGroup5: ['', Validators.required]
    });
    if (history.state.selectedModel) {
      this.onSeeModel();
      this.componentDirection = 'Model edition';
    } else {
      this.componentDirection = 'Model creation';
    }
  }

  getDataSets(): void {
    this.backendService.getDataSetsList(this.localStorage.projectId).subscribe(
      (datasets) => {
        console.log(datasets);
        this.datasetSelectionDataSource = datasets;
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get datasets list operation failed');
      });
  }

  onSeeModel(): void {
    this.getModel(history.state.selectedModel).subscribe(data => {
      this.newDMModel = data;
      this.formGroup1.get('name').setValue(this.newDMModel.name);
      this.formGroup1.get('description').setValue(this.newDMModel.description);
      this.getCategorialVariables();
      this.getMissingData();
    });
  }

  getModel(model): any {
    return of(model);
  }

  getCategorialVariables(): void {
    this.categorigalVariablesDataSource = [];
    this.newDMModel.variable_configurations.forEach(element => {
      if (element.variable.variable_data_type === 'categorical') {
        this.categorigalVariablesDataSource.push(element.variable);
      }
    });
  }

  getMissingData(): void {
    this.missingDataDataSource = [];
    this.newDMModel.variable_configurations.forEach(element => {
      this.missingDataDataSource.push(element);
    });
    console.log('missing data: ', this.missingDataDataSource)
  }

  saveOperations(operator, element): void {

    element.missing_data_operation = operator;

    if (operator === 'set_specific') {
      element.missing_data_specific_value = '0';
    } else {
      delete element.missing_data_specific_value;
    }
  }

  specificValueChange(opValue, element): void {
    element.missing_data_specific_value = opValue.value;
  }

  selectDataSet(dataSet): void {
    this.missingDataDataSource = [];
    this.categorigalVariablesDataSource = [];
    dataSet.featureset.variables.forEach(element => {
      this.missingDataDataSource.push({
        encoding_type: element.variable_data_type,
        missing_data_operation: '',
        variable: element
      });
    });

    dataSet.featureset.variables.forEach(element => {
      if (element.variable_data_type === 'categorical') {
        this.categorigalVariablesDataSource.push(element);
      }
    });
  }


}
