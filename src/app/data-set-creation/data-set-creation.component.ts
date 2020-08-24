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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { Dataset } from '../shared/dataset';

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

  // Get feature list
  featureSetsDataSource;
  featureSetsDisplayedColumns: string[] = ['name', 'description', 'numbervariables', 'created_by', 'creation_time', 'select'];

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) {}

  ngOnInit(): void {
    this.newDataSet = new Dataset();

    this.formGroup1 = this.formBuilder.group({
      formGroup1: ['', Validators.required]
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
  }

  getFeatureList(): void {
    this.backendService.getFeatureList().subscribe(
      (featurelist) => {
        console.log(featurelist);
        this.featureSetsDataSource = featurelist;
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

}
