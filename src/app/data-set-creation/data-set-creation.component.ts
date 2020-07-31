import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCriteriaparameterDialogComponent } from './new-criteriaparameter-dialog/new-criteriaparameter-dialog.component';
import { CriteriaParameter } from '../shared/criteriaparameters';


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
  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'description', 'numbervariables', 'created_by', 'created_on', 'select'];

  displayedColumnscriteria: string[] = ['resource', 'parameter', 'operation', 'value', 'fhir_path', 'delete'];
  dataSourcecriteria = [];

  name: string;
  description: string;
  newCriteria: CriteriaParameter;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    public dialog: MatDialog
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
    this.backendService.getFeaturesetsList().subscribe(
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

  onNewCriteria(): void {
    const dialogRef = this.dialog.open(NewCriteriaparameterDialogComponent, {
      width: '80%',
      data: {newCriteria: this.newCriteria}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log('if result');
        this.newCriteria = result;
        this.dataSourcecriteria.push(this.newCriteria);
        console.log(this.newCriteria);
        console.log(this.dataSourcecriteria);
        this.table.renderRows();
      }
    });
  }
  onCancel(): void {
    console.log('Cancel feature set creation');
    this.router.navigate(['/fslist']);
  }

  onDelete(variable): void {
    this.dataSourcecriteria.forEach((item, index) => {
        if (item === variable) {
          this.dataSourcecriteria.splice(index, 1);
        }
      });
    this.table.renderRows();
  }
}
