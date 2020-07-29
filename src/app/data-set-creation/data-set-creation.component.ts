import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

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

  // Get feture list
  dataSource;
  displayedColumns: string[] = ['name', 'description', 'numbervariables', 'created_by', 'creation_time', 'select'];

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) {}

  ngOnInit(): void {
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

    this.onGetFeatureList();
  }
  onGetFeatureList(): void {
    this.backendService.getFeatureList().subscribe(
      (featurelist) => {
        console.log(featurelist);
        this.dataSource = featurelist;
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get feature list operation failed');
      });
  }

  onCreateNewUseCase(): void {
    // TO DO
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Not ready yet');
  }
}
