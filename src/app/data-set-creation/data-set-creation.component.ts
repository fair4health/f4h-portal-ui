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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { Dataset } from '../shared/dataset';
import { ElegibilityCriteria } from '../shared/elegibility-criteria';
import { of } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FsDetailsDialogComponent } from './fs-details-dialog/fs-details-dialog.component';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';


@Component({
  selector: 'app-data-set-creation',
  templateUrl: './data-set-creation.component.html',
  styleUrls: ['./data-set-creation.component.css']
})
export class DataSetCreationComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;

  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  formGroup5: FormGroup;

  // This variable will build the new Data Set accross the steps
  newDataSet: Dataset;
  newElegibilityCriteria: ElegibilityCriteria;
  elegibilityCriteriaList: ElegibilityCriteria[];
  passTo5Step = false;

  // Get feature list
  featureSetsDataSource;
  featureSetsDisplayedColumns: string[] = [' ', 'name', 'description', 'numbervariables', 'created_by', 'creation_time', 'select'];
  resultsAndStaticsColumns: string[] = [];
  // resultsAndStaticsColumns: string[] = ['state', 'dataSourceId', 'n_records', 'age', 'gender', 'smoking_st', 'heart_f', 'n_drugs'];
  resultsAndStaticsDataSource;

  completedData: string[] = [];
  completeddataTable = new MatTableDataSource(this.completedData);
  selectedFeatureSetRow: any;
  componentDirection: string;
  isDisabled: boolean;
  pattern = '^\/[?a-zA-Z0-9]+?[a-zA-Z0-9._%+-:=]{1,100}$';

  usecasename: string;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private localStorage: LocalStorageService,
    private userCommunication: UserCommunicationService,
    public dialog: MatDialog,
    private router: Router
    ) {}

  ngOnInit(): void {

    this.usecasename = this.localStorage.projectName;
    this.newDataSet = new Dataset();
    this.newDataSet.project_id = this.localStorage.projectId;
    this.elegibilityCriteriaList = [];
    this.newDataSet.eligibility_criteria = this.elegibilityCriteriaList;
    this.newElegibilityCriteria = new ElegibilityCriteria();

    this.formGroup1 = this.formBuilder.group({
    //  formGroup1: ['', Validators.required]
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
      formGroup4: ['', Validators.required]
    });
    this.formGroup5 = this.formBuilder.group({
      formGroup5: ['', Validators.required]
    });

    this.getFeatureList();

    if (history.state.selectedDataSet) {
      this.componentDirection = 'Data Set Cohort';
      this.isDisabled = true;
      this.formGroup1.disable();
      this.formGroup3.disable();
      this.onSeeDataSet();
      setInterval(() => {
        this.refreshDataSet();
      }, 30000);
    } else {
      this.isDisabled = false;
      this.componentDirection = 'Data Set Creation';
    }
  }

  refreshDataSet(): void {
    if (this.newDataSet.execution_state === 'executing') {
      this.onSeeDataSet();
    }
  }

  getFeatureList(): void {
   // this.backendService.getFeatureList().subscribe(
    this.backendService.getFeaturesetsList(this.newDataSet.project_id).subscribe(
      (featurelist) => {
        this.featureSetsDataSource = featurelist;
        if (history.state.selectedDataSet) {
          this.featureSetsDataSource.forEach(element => {

          });
        }
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get feature set list operation failed');
      });
  }

  onSelectFeatureSetDetails(featureSet): void {
    const dialogRef = this.dialog.open(FsDetailsDialogComponent, {
      width: '80%',
      data: featureSet
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  onRadioFeatureSetSelected(): void {
    console.log('Selected row: ' + JSON.stringify(this.selectedFeatureSetRow));
    this.newDataSet.featureset = this.selectedFeatureSetRow;
  }

  onAddElegibilityCriteria(): void {

    // Check if the fields of the form of Elegibility criteria are void
    // if just one is filled, add to the list, if no one is, don't push it to the table
    // Should be both required?
    if (this.newElegibilityCriteria.fhir_query || this.newElegibilityCriteria.fhir_path) {
      this.elegibilityCriteriaList.push(this.newElegibilityCriteria);
    }
    this.newElegibilityCriteria = new ElegibilityCriteria();
  }

  onSeeDataSet(): void {
    this.backendService.getDataSet(history.state.selectedDataSet.dataset_id).subscribe(data => {
      console.log('data: ', data);
      this.newDataSet = data;
      this.formGroup1.get('name').setValue(this.newDataSet.name);
      this.formGroup1.get('description').setValue(this.newDataSet.description);
      this.selectedFeatureSetRow = this.newDataSet.featureset;
      this.elegibilityCriteriaList = this.newDataSet.eligibility_criteria;
      data.dataset_sources.forEach(element => {
        if (element.selection_status === 'selected') {
          this.completedData.push(element);
        }
      });
      data.dataset_sources.forEach(element => {
        if (element.selection_status === '' || !element.selection_status) {
          element.selection_status = 'discarded';
        }
      });

      // if the execution state is ready, go to the 4th step "Results & Statistics"

      this.stepper.selectedIndex = 3;

      data.dataset_sources.forEach(element => {
        if (element.selection_status === 'selected') {
          this.passTo5Step = true;
        }
      });
      this.completeddataTable = new MatTableDataSource(this.completedData);
      this.getDataSource(data.dataset_sources);
    });
  }

  getDataSet(dataSet): any {
    return of(dataSet);
  }

  // extract data sources to set in the table of results and statistics.
  getDataSource(dataSetSources): void {
    this.resultsAndStaticsColumns = this.getColumnsDataSource(); // get columns of table
    this.resultsAndStaticsDataSource = [];
    dataSetSources.forEach(element => {
      this.resultsAndStaticsDataSource.push(element);
    });
    console.log(this.resultsAndStaticsDataSource);
  }

  getColumnsDataSource(): any {
    const variablesStringList = [];
    variablesStringList.push(' ');
    variablesStringList.push('agent');
    variablesStringList.push('# of records');
    this.newDataSet.featureset.variables.forEach(element => {
      variablesStringList.push(element.name);
    });
    return variablesStringList;
  }

  onSaveDataSet(): void {

    const dialogConf = this.dialog.open(DialogConfirmationComponent, {
      width: '500px',
      data: {
              title: 'Save',
              message: 'Are your shore you want to save data set?',
              cancelButton: 'No, I want To cancel the changes',
              acceptButton: 'Yes, I want to save details'
            }
    });

    dialogConf.afterClosed().subscribe(result => {
      if (result) {
        if (history.state.selectedDataSet) {
          this.updateDataSet();
        } else {
          this.saveNewDataSet();
        }
      } else {
        console.log('cancel save, go home');
        this.router.navigate(['/dsdashboard']);
        this.userCommunication.createMessage(this.userCommunication.INFO, 'Data don\'t saved.');
      }
    });

  }

  saveNewDataSet(): void {
    Object.keys(this.formGroup1.controls).forEach(key => {
      this.newDataSet[key] = this.formGroup1.get(key).value;
    });
    // this is a mock of created_by of data set, it will be removed.
    this.newDataSet['created_by'] = this.localStorage.userId;
    this.backendService.saveDataSet(this.newDataSet.project_id, this.newDataSet).subscribe(
      (data) => {
        this.getDataSource(data.dataset_sources);
        this.userCommunication.createMessage('snack-bar-success', 'Data set "' + data.name + '" has been saved.')
        this.router.navigate(['/dsdashboard']);
      },
      (err) => {
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Failed to create Data set.');
      });
  }


  updateDataSet(): void {

    // data from the form to the data Set object.
    Object.keys(this.formGroup1.controls).forEach(key => {
      this.newDataSet[key] = this.formGroup1.get(key).value;
    });

    console.log('updated data set: ', this.newDataSet);

    // check if some agent have not execution_tatus and assignee that with 'discarded' value
    this.newDataSet.dataset_sources.forEach(element => {
      if (!element.execution_status) {
          element.execution_status = 'discarded';
      }
    });
    this.backendService.updateDataSet(this.newDataSet.project_id, this.newDataSet).subscribe( 
      (data) => {
        this.userCommunication.createMessage('snack-bar-success', 'Data set "' + data.name + '" has been updated.');
        this.router.navigate(['/dsdashboard']);
    },
      (err) => {
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Failed to update Data set.');
      }
    );
  }

  selectAgent(checked, element): void {

    this.newDataSet.dataset_sources.forEach(elem => {
      if (element.agent.agent_id === elem.agent.agent_id) {
        if (checked) {
          elem.selection_status = 'selected';
          this.completedData.push(elem);
          this.passTo5Step = true;
          this.table.renderRows();
        } else if (!checked) {
          elem.selection_status = 'discarded';
          const index = this.completedData.indexOf(elem);
          this.completedData.splice(index, 1);
          this.table.renderRows();
        }
      }
    });
    this.completeddataTable = new MatTableDataSource(this.completedData);
    this.passTo5Step = false;
    this.newDataSet.dataset_sources.forEach(element => {
      if (element.selection_status === 'selected') {
        this.passTo5Step = true;
      }
    });
  }

}
