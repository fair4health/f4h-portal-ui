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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { Dataset } from '../shared/dataset';
import { ElegibilityCriteria } from '../shared/elegibility-criteria';
import { of } from 'rxjs';

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

  // Get feature list
  featureSetsDataSource;
  featureSetsDisplayedColumns: string[] = [' ', 'name', 'description', 'numbervariables', 'created_by', 'creation_time', 'select'];
  selectedFeatureSetRow;

  componentDirection: string;

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
        this.componentDirection = 'Data set edition';
        this.onSeeDataSet();
    } else {
      this.componentDirection = 'Data set creation';
    }
  }

  getFeatureList(): void {
   // this.backendService.getFeatureList().subscribe(
    this.backendService.getFeaturesetsList(this.newDataSet.project_id).subscribe(
      (featurelist) => {
        this.featureSetsDataSource = featurelist;

        if (history.state.selectedDataSet) {
          this.featureSetsDataSource.forEach(element => {
            // tslint:disable-next-line: no-string-literal
            if (element.featureset_id === this.newDataSet.featureset['featureset_id']) {
              this.selectedFeatureSetRow = element;
            }
          });
        }
      },
      (err) => {
        this.backendService.handleError('home', err);
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

  onSeeDataSet(): void {
    this.getDataSet(history.state.selectedDataSet).subscribe(x => {
      this.newDataSet = x;
      this.formGroup1.get('name').setValue(this.newDataSet.name);
      this.formGroup1.get('description').setValue(this.newDataSet.description);
      this.selectedFeatureSetRow = this.newDataSet.featureset;
      this.elegibilityCriteriaList = this.newDataSet.eligibility_criteria;
    });
  }

  getDataSet(dataSet): any {
    return of(dataSet);
  }

}
