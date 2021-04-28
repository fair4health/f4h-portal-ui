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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from '../core/services/local-storage.service';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { DmModel } from '../shared/dm-model';
import { Algorithm } from '../shared/algorithm';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatStepper } from '@angular/material/stepper';

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
  formGroup7: FormGroup;

  newDMModel: DmModel;
  selectedDatasetRow;

  datasetSelectionDisplayedColumns: string[] = ['select', 'name', 'description', 'data_sources', 'status', 'created_by'];
  datasetSelectionDataSource = new MatTableDataSource();

  categorialVariablesColumns: string[] = ['name', 'fhir_path', 'fhir_query', 'variable_type'];
  categorigalVariablesDataSource;

  missingDataColumns: string[] = ['name', 'variable_type', 'operation', 'value'];
  missingDataDataSource; // for the table
  missingVariables: any[] = []; // save missing variables in the model body
  operations: any[] = [
    {value: 'not_specified', viewValue: ''},
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
  isDisabled: boolean;
  selectedAlgorithm = new Algorithm();
  usecaseType: string;
  useCaseName: string;
  selectedDataSet: any;

  algorithmParameterForm: any = [];
  algorithmsList: any = [];

  statistics: any;
  statisticsColumns: string[] = ['statistics', 'results'];

  algorithms = [];
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private backendService: BackendService,
    private localStorage: LocalStorageService,
    private userCommunication: UserCommunicationService,
    private formBuilder: FormBuilder,
    private router: Router,
    ) {}


    /**
     * TODO: methods to get data in the sections:
     *  3 - Categorial variables.
     *  4 - Missing data.
     *  5 - Algorithm selection.
     */
  ngOnInit(): void {

    this.useCaseName = this.localStorage.projectName;
    this.newDMModel = new DmModel();
    this.getDataSets();

    this.formGroup1 = this.formBuilder.group({
      // formGroup1: ['', Validators.required]
      name: ['',  Validators.required],
      description: ['',  Validators.required],
    });
    this.formGroup2 = this.formBuilder.group({
      dataset: ['', Validators.required]
    });
    this.formGroup3 = this.formBuilder.group({
      formGroup3: ['', Validators.required]
    });
    this.formGroup4 = this.formBuilder.group({
      missing_data_operation: [''],

    });
    this.formGroup5 = this.formBuilder.group({
    });
    this.formGroup7 = this.formBuilder.group({
      formGroup7: ['', Validators.required]
    });
    this.formGroup6 = this.formBuilder.group({
      training_size: [80, Validators.required],
      test_size: [20],
      validation_size: ['']
    });

    if (history.state.selectedModel) {

      this.onSeeModel();
      this.formGroup1.disable();
      this.formGroup5.disable();
      this.isDisabled = true;
      this.componentDirection = 'Model Edition';

    } else {
      this.isDisabled = false;
      this.componentDirection = 'Model Creation';
    }

    this.getUseCaseType(this.localStorage.projectId);
    this.getAlgoritms();
  }

  getDataSets(): void {

    const dataSets = [];
    this.backendService.getDataSetsList(this.localStorage.projectId).subscribe(
      (datasets) => {

        datasets.forEach(element => {
          if (element.execution_state === 'final') {
            dataSets.push(element);
          }
        });

        this.datasetSelectionDataSource = new MatTableDataSource(dataSets);

      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get datasets list operation failed');
      });
  }

  onSeeModel(): void {

    this.backendService.getModel(history.state.selectedModel.model_id).subscribe(
      (data) => {
        console.log('EXISTING MODEL -->', data);
        this.selectedDataSet = data.dataset;
        this.newDMModel = data;
        this.formGroup1.get('name').setValue(this.newDMModel.name);
        this.formGroup1.get('description').setValue(this.newDMModel.description);
        this.formGroup6.get('training_size').setValue(this.newDMModel.training_size * 100);
        this.formGroup6.get('test_size').setValue(this.newDMModel.test_size * 100);
        this.algorithmsList = data.algorithms;
        this.getCategorialVariables();

        if (this.newDMModel.variable_configurations) {
          this.getMissingData(); // variable_configurations
        } else {
          this.getNumericVariables();
        }

        if (this.newDMModel['data_mining_state'] === 'ready' || this.newDMModel['data_mining_state'] === 'final') {
          this.getStatistics();
        }
        console.log('step: ', this.stepper.selectedIndex);
        this.stepper.selectedIndex = 6;
      },
      (err) => {
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get Model list operation failed');
      }
    );

  }

  getStatistics(): void {
    console.log(this.newDMModel['boosted_models']);
    this.newDMModel['boosted_models'].forEach(element => {
      this.statistics = element.calculated_test_statistics;
      console.log(this.statistics);
    });
  }

  selectBostedModel(boostedModels): void {
    console.log(boostedModels);
    // bustedModel['selection_status'] = 'selected'
    this.newDMModel['boosted_models'].forEach(element => {
      if (boostedModels === element) {
        element['selection_status'] = 'selected';
      } else {
        element['selection_status'] = 'discarded';
      }
    });

    this.backendService.updateModel(this.newDMModel['model_id'], this.newDMModel).subscribe(
      (data) => {
          console.log(data);
          this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Model updated successfully');
          this.router.navigate(['/mdashboard']);
       },
      (err) => {
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error updating model.');
      }
    );
  }

  changeTraining(event): void {
    let testValue: number;
    testValue = 100 - event.value;
    this.formGroup6.controls.test_size.setValue(testValue);
  }

  getNumericVariables(): void {
    this.missingDataDataSource = [];
    this.newDMModel.dataset.featureset.variables.forEach(element => {
      if (element.variable_data_type === 'numeric') {
        this.missingDataDataSource.push({
          name: element.name,
          variable_data_type: element.variable_data_type
        });
      }
    });
  }

  getCategorialVariables(): void {
    this.categorigalVariablesDataSource = [];

    this.newDMModel.dataset.featureset.variables.forEach(element => {
      if (element.variable_data_type === 'categorical') {
        this.categorigalVariablesDataSource.push(element);
      }
    });
  }

  getMissingData(): void {
    this.missingDataDataSource = [];
    this.newDMModel.variable_configurations.forEach(element => {

      this.missingDataDataSource.push({
        name: element.variable.name,
        variable_data_type: element.variable.variable_data_type,
        missing_data_operation: element.missing_data_operation,
        missing_data_specific_value: element.missing_data_specific_value
      });
    });
  }

  saveOperations(operator, element): void {

    console.log('operator', operator);
    console.log('element', element);
    console.log('le cac de pierre: ', this.missingVariables)
    // console.log('Caca de perro: ', this.missingDataDataSource.find(mds => this.missingDataDataSource === element));
    this.missingVariables.forEach(elem => {
      if (elem.variable === element) {
        console.log('selected variable: ', elem);
        elem.missing_data_operation = operator
      }

    });
    element.missing_data_operation = operator;

    

    if (operator === 'set_specific') {
      element.missing_data_specific_value = '0';
    } else {
      delete element.missing_data_specific_value;
    }

    console.log('missing variable after operator: ', this.missingVariables)
  }

  specificValueChange(opValue, element): void {
    element.missing_data_specific_value = opValue.value;

    console.log('opValue: ', opValue);
    console.log('element: ', element);

    this.missingVariables.forEach(elem => {
      if (elem.variable === element) {
        console.log('selected variable: ', elem);
        elem.missing_data_specific_value = opValue
      }
    });

    this.missingDataDataSource.forEach(elem => {
      if (elem.name === element.name) {
        console.log('selected variable: ', elem);
        elem.missing_data_specific_value = opValue
      }
    });

    console.log('missing variables after: ',this.missingVariables);
    console.log('missing variables data source after: ',this.missingDataDataSource);

    
  }

  selectDataSet(dataSet): void {
    this.formGroup2.get('dataset').setValue(dataSet);
    this.missingDataDataSource = [];
    this.categorigalVariablesDataSource = [];

    dataSet.featureset.variables.forEach(element => {
      this.missingDataDataSource.push(element);
      this.missingVariables.push({
        variable: element, //revistar si esta bien
        encoding_type: '',
        missing_data_operation: '',
        missing_data_specific_value: ''
      });
    });

    console.log('missing variables: ', this.missingDataDataSource);

    dataSet.featureset.variables.forEach(element => {
      if (element.variable_data_type === 'categorical') {
        this.categorigalVariablesDataSource.push(element);
      }
    });
  }

  getUseCaseType(id: string): void {
    this.backendService.getUseCase(id).subscribe(
      (usecase) => {
        this.usecaseType = usecase.project_type;
      },
      (err) => {
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error getting Use case.');
      }
    );
  }

  onSave(): void {

    Object.keys(this.formGroup1.controls).forEach(key => {
      this.newDMModel[key] = this.formGroup1.get(key).value;
    });
    this.newDMModel.dataset = this.formGroup2.get('dataset').value;
    this.newDMModel.algorithms = [];
    this.newDMModel.algorithms = this.algorithmsList;
    this.newDMModel.created_by = this.localStorage.userId;
    this.newDMModel.project_id = this.localStorage.projectId;
    this.newDMModel.training_size = this.formGroup6.get('training_size').value / 100;
    this.newDMModel.test_size = this.formGroup6.get('test_size').value / 100;
    this.newDMModel.validation_size = 1;
    this.newDMModel.variable_configurations = this.missingVariables;

    console.log('new model: ', this.newDMModel);

    this.backendService.saveModel(this.newDMModel).subscribe(
      (response) => {
        this.userCommunication.createMessage('snack-bar-success', 'Model "' + response.name + '" created successfully');
        this.newDMModel = response;
        this.router.navigate['/mdashboard'];
      },

      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'New model creation failed!');
      }
    ); 
  }

  onChangeAlgorithm(algorithm): void {
    this.selectedAlgorithm = new Algorithm();
    this.algorithmParameterForm = algorithm.parameters;
    this.algorithmParameterForm.forEach(element => {
      this.formGroup5.addControl(element.name, new FormControl(element.value, Validators.required));
    });
    this.selectedAlgorithm = algorithm;
  }

  addAlgorithm(): void {

    this.selectedAlgorithm.parameters.forEach(element => {
      element.value = this.formGroup5.get(element.name).value;
    });

    this.algorithmsList.push(this.selectedAlgorithm);
    delete this.selectedAlgorithm;

  }

  getAlgoritms(): void {
    this.backendService.getAlgorithms().subscribe(
      (data) => {
        console.log('algorithms:',data)
        const x = [];
        x.push(data);
        if (this.usecaseType === 'prediction') {
          x[0].forEach(element => {
            if (element.name.startsWith('classification')) {
              this.algorithms.push(element);
            }
          });
        } else if (this.usecaseType === 'association') {
          x[0].forEach(element => {
            if (element.name === 'arl_fpgrowth') {
              this.algorithms.push(element);
            }
          });
        }
      },
      (err) => {
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error getting algorithms');
      }
    );
  }

}
