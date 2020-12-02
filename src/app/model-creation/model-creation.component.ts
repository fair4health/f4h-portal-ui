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
import { Algorithm } from '../shared/algorithm';
import { Router } from '@angular/router';

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
  isDisabled: boolean;
  selectedAlgorithm = new Algorithm();
  usecaseType: string;
  useCaseName: string;

  algorithmParameterForm: any = [];
  algorithmsList: any = [];

  algorithms: any[] = [
    {value: 'arl_prefix_span', viewValue: 'Prefix Span Algorithm', type: ''},
    {value: 'arl_fpgrowth', viewValue: 'Frequent Pattern Tree Association Rule Algorithm', type: ''},
    {value: 'classification_svm', viewValue: 'Support Vector Machine Classification Algorithm', type: 'SVM'},
    {value: 'classification_logistic_regression', viewValue: 'Logistic Regression Classification Algorithm', type: 'logistic_regression'},
    {value: 'classification_decision_tree', viewValue: 'Decision Tree Classification Algorithm', type: 'decision_tree'},
    {value: 'classification_gbt', viewValue: 'Gradient Boosted Tree Classification Algorithm', type: 'GBT'},
    {value: 'classification_naive_bayes', viewValue: 'Naive Bayes Classification Algorithm', type: ''},
    {value: 'regression_linear', viewValue: 'Linear Regression Algorithm', type: ''},
    {value: 'regression_decision_tree', viewValue: 'Decision Tree Regression Algorithm', type: 'decision_tree'},
    {value: 'regression_random_forest', viewValue: 'Random Forest Regression  Algorithm', type: 'random_forest'},
    {value: 'regression_gbt', viewValue: 'Gradient Boosted Tree Regression Algorithm', type: 'GBT'}
  ];


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
      // formGroup4: ['', Validators.required]
      missing_data_operation: ['']
    });
    this.formGroup5 = this.formBuilder.group({

    });
    this.formGroup6 = this.formBuilder.group({
      formGroup6: ['', Validators.required]
    });

    if (history.state.selectedModel) {
      this.onSeeModel();
      this.formGroup1.disable();
      this.formGroup5.disable();
      this.isDisabled = true;
      this.componentDirection = 'Model edition';
    } else {
      this.isDisabled = false;
      this.componentDirection = 'Model creation';
      this.getUseCaseType(this.localStorage.projectId);
    }

  }

  getDataSets(): void {
    this.backendService.getDataSetsList(this.localStorage.projectId).subscribe(
      (datasets) => {
        this.datasetSelectionDataSource = datasets;

      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get datasets list operation failed');
      });
  }

  onSeeModel(): void {

    this.backendService.getModel(history.state.selectedModel.model_id).subscribe(
      data => {
        console.log('EXISTING MODEL -->', data)
        this.newDMModel = data;
        this.formGroup1.get('name').setValue(this.newDMModel.name);
        this.formGroup1.get('description').setValue(this.newDMModel.description);
        this.algorithmsList = data.algorithms;
        this.getCategorialVariables();
        this.getMissingData();
      }
    );

  }

  getCategorialVariables(): void {
    this.categorigalVariablesDataSource = [];
  /*  this.newDMModel.variable_configurations.forEach(element => {
      if (element.variable.variable_data_type === 'categorical') {
        this.categorigalVariablesDataSource.push(element.variable);
      }
    });*/

    this.newDMModel.dataset.featureset.variables.forEach(element => {
      if (element.variable_data_type === 'categorical') {
        this.categorigalVariablesDataSource.push(element);
      }
    });
  }

  getMissingData(): void {
    this.missingDataDataSource = [];
    this.newDMModel.dataset.featureset.variables.forEach(element => {
      this.missingDataDataSource.push(element);
    });
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
    this.formGroup2.get('dataset').setValue(dataSet);
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

  getUseCaseType(id: string): void {
    this.backendService.getUseCase(id).subscribe(
      (usecase) => {
        this.usecaseType = usecase.project_type;
      });
  }

  onSave(): void {

    Object.keys(this.formGroup1.controls).forEach(key => {
      this.newDMModel[key] = this.formGroup1.get(key).value;
    });

    this.newDMModel.dataset = this.formGroup2.get('dataset').value;
    this.newDMModel.algorithms = [];
    // this.newDMModel.algorithms.push(this.selectedAlgorithm);
    this.newDMModel.algorithms = this.algorithmsList;
    this.newDMModel.created_by = '1903';
    this.newDMModel.project_id = this.localStorage.projectId;
    this.newDMModel.training_size = 0.7;
    this.newDMModel.test_size = 0.3;

    console.log('new model: ', this.newDMModel);

    this.backendService.saveModel(this.newDMModel).subscribe(
      (response) => {
        this.userCommunication.createMessage('snack-bar-success', 'Model "' + response.name + '" created successfully');
        this.router.navigate(['/mdashboard']);
      },

      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'New model creation failed!');
      }
    );
  }

  onChangeAlgorithm(algorithm): void {
    this.selectedAlgorithm = new Algorithm();
    this.selectedAlgorithm.name = algorithm.value;
    this.formGroup5.reset();
    this.algorithmParameterForm = [];
    this.algorithmParameterForm = [
      {name: 'num_folds', label: 'Value of k in k-fold Cross validation'},
      {name: 'max_parallelism', label: 'The maximum level of parallelism to evaluate models in parallel.'},
      {name: 'metric', label: 'Metric to use on Cross validation'},
    ];

    if (algorithm.type === 'logistic_regression') {
      this.algorithmParameterForm.push(
        {name: 'threshold', label: 'Threshold'},
        {name: 'max_iter', label: 'Maximum number of iterations'},
        {name: 'reg_param', label: 'Regularization parameter'},
        {name: 'elasticnet_param', label: 'ElasticNet mixing parameter'},
      );
    } else if (algorithm.type === 'SVM'){
      this.algorithmParameterForm.push(
        {name: 'max_iter', label: 'Maximum number of iterations'},
        {name: 'reg_param', label: 'Regularization parameter'}
      );
    } else if (algorithm.type === 'decision_tree'){
      this.algorithmParameterForm.push(
        {name: 'max_depth', label: 'Maximum depth of a tree'},
        {name: 'min_info_gain', label: 'For a node to be split further, the split must improve at least this much r'},
        {name: 'impurity', label: 'The node impurity is a measure of the homogeneity of the labels at the node'},
        );
    } else if (algorithm.type === 'GBT'){
      this.algorithmParameterForm.push(
        {name: 'max_iter', label: 'Maximum number of iterations'},
        {name: 'max_depth', label: 'Maximum depth of a tree'},
        {name: 'min_info_gain', label: 'For a node to be split further, the split must improve at least this much r'},
        {name: 'feature_subset_strategy', label: 'Number of features to use as candidates for splitting at each tree node. '},
        );
    } else if (algorithm.type === 'random_forest'){
      this.algorithmParameterForm.push(
        {name: 'max_depth', label: 'Maximum depth of a tree'},
        {name: 'min_info_gain', label: 'For a node to be split further, the split must improve at least this much r'},
        {name: 'min_info_gain', label: 'For a node to be split further, the split must improve at least this much r'},
        {name: 'impurity', label: 'The node impurity is a measure of the homogeneity of the labels at the node'},
        {name: 'num_trees', label: 'Number of trees in the forest. '},
        {name: 'feature_subset_strategy', label: 'Number of features to use as candidates for splitting at each tree node.'},
      );
    }

    this.algorithmParameterForm.forEach(element => {
      this.formGroup5.addControl(element.name, new FormControl('', Validators.required));
    });

  }

  addAlgorithm(): void {
    this.selectedAlgorithm.parameters = [];

    this.algorithmParameterForm.forEach(element => {
      this.selectedAlgorithm.parameters.push(
        {
          name: element.name,
          data_type: 'string',
          value: this.formGroup5.get(element.name).value,
        }
      );
    });

    this.algorithmsList.push(this.selectedAlgorithm);
  }

}
