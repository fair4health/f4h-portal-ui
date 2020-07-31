import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { DmModel } from '../shared/dm-model';

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

  datasetSelectionDisplayedColumns: string[] = ['name', 'description', 'data_sources', 'created_by', 'creation_time', 'details'];
  datasetSelectionDataSource;

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.newDMModel = new DmModel();
    this.getDataSets();

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
    this.formGroup6 = this.formBuilder.group({
      formGroup5: ['', Validators.required]
    });
  }

  getDataSets(): void {
    this.backendService.getDataSetsList().subscribe(
      (datasets) => {
        console.log(datasets);
        this.datasetSelectionDataSource = datasets;
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get datasets list operation failed');
      });
  }
}
