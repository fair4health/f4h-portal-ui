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

import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { Dataset } from '../shared/dataset';
import { DataSource } from '../shared/data-source';
import { ElegibilityCriteria } from '../shared/elegibility-criteria';

@Component({
  selector: 'app-data-set-creation',
  templateUrl: './data-set-creation.component.html',
  styleUrls: ['./data-set-creation.component.css']
})
export class DataSetCreationComponent implements OnInit {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  formGroup5: FormGroup;

  // This variable will build the new Data Set accross the steps
  newDataSet: Dataset;
  newElegibilityCriteria: ElegibilityCriteria;
  elegibilityCriteriaList: ElegibilityCriteria[];

  // Feature list
  featureSetsDataSource;
  featureSetsDisplayedColumns: string[] = [' ', 'name', 'description', 'numbervariables', 'created_by', 'created_on', 'select'];
  selectedFeatureSetRow;

  // Data sources
  dataSourcesDataSource = new MatTableDataSource<DataSource>();
  dataSourcesDisplayedColumns: string[] = [' ', 'name', 'description', 'numbervariables', 'created_by', 'created_on', 'select'];
  selectedDataSourcesRows = new SelectionModel<DataSource>(true, []);

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private localStorage: LocalStorageService,
    private userCommunication: UserCommunicationService
    ) {}

  ngOnInit(): void {
    this.newDataSet = new Dataset();
    this.newDataSet.project_id = this.localStorage.projectId;
    this.elegibilityCriteriaList = [];
    this.newDataSet.eligibility_criteria = this.elegibilityCriteriaList;
    this.newElegibilityCriteria = new ElegibilityCriteria();


    this.formGroup1 = this.formBuilder.group({
      formGroup1: ['', Validators.required]
    });
    this.formGroup2 = this.formBuilder.group({
      formGroup2: ['']
    });
    this.formGroup3 = this.formBuilder.group({
      formGroup3: ['']
    });
    this.formGroup4 = this.formBuilder.group({
      formGroup4: ['', Validators.required]
    });
    this.formGroup5 = this.formBuilder.group({
      formGroup5: ['', Validators.required]
    });
  }


  onStepChange(event: any): void {
    // selected index is 0..n
    switch(event.selectedIndex) {
      case 1: {
        console.log('Data set creation step ' + event.selectedIndex + ' requires feautere set list');
        this.getFeatureList();
        break;
      }
      case 2: {
        console.log('Data set creation step ' + event.selectedIndex + ' requires dataset query');
        if (this.isDatasetAlreadyCreated()) {
          // Dataset is already created

        } else {
          // Create dataset with information from previous steps

        }
        break;
      }
      default: {
        console.log('Starting data set creation step ' + event.selectedIndex);
        break;
      }
   }
  }

  moveToStep(index: number): void {
    // selected index is 0..n-1
    this.stepper.selectedIndex = index;
  }

  getFeatureList(): void {
    this.backendService.getFeaturesetsList().subscribe(
      (featurelist) => {
        console.log(featurelist);
        this.featureSetsDataSource = featurelist;
      },
      (err) => {
        this.backendService.handleError('dataset creation', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get feature set list operation failed');
      });
  }

  onSelectFeatureSetDetails(element): void {
    console.log('Selected view details of featureset: ' + JSON.stringify(element));
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Details dialog not implemented yet!');
  }

  onRadioFeatureSetSelected(): void {
    console.log('Selected row: ' + JSON.stringify(this.selectedFeatureSetRow));
    this.newDataSet.featureset = this.selectedFeatureSetRow;
  }

  onAddElegibilityCriteria(): void {
    this.elegibilityCriteriaList.push(this.newElegibilityCriteria);
    this.newElegibilityCriteria = new ElegibilityCriteria();
  }

  isDatasetAlreadyCreated(): boolean {
    return Boolean(this.localStorage.datasetId);
  }

  createDataset(): void {
    this.backendService.postDataSet(this.newDataSet).subscribe(
      (datasetInfo) => {
        console.log(datasetInfo);
        this.data = ;
      },
      (err) => {
        this.backendService.handleError('dataset creation', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Post data set operation failed');
      });
  }

  // Manage checkbox in data sources table
  isAllDataSourcesSelected(): boolean {
    const numSelected = this.selectedDataSourcesRows.selected.length;
    const numRows = this.dataSourcesDataSource.data.length;
    return numSelected === numRows;
  }

  dataSourcesTableMasterToggle(): void {
    this.isAllDataSourcesSelected() ?
        this.selectedDataSourcesRows.clear() :
        this.dataSourcesDataSource.data.forEach(row => this.selectedDataSourcesRows.select(row));
  }

  dataSourcesCheckboxLabel(row?: DataSource): string {
    if (!row) {
      return `${this.isAllDataSourcesSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectedDataSourcesRows.isSelected(row) ? 'deselect' : 'select'} row`;
  }


}
