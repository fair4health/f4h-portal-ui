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
import { Router } from '@angular/router';

import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { LocalStorageService } from '../core/services/local-storage.service';

import { Variable } from '../shared/variable';
import { FeatureSet } from '../shared/feature-set';
import { NewVariableDialogComponent } from './new-variable-dialog/new-variable-dialog.component';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-feature-set-creation',
  templateUrl: './feature-set-creation.component.html',
  styleUrls: ['./feature-set-creation.component.css']
})
export class FeatureSetCreationComponent implements OnInit {

  name: string;
  description: string;
  newVariable: Variable;
  componentTitle: string;
  componentDirection: string;
  isDisabled: boolean;

  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'description', 'variable_type', 'variable_data_type', 'fhir_query', 'fhir_path', 'delete'];
  dataSource = [];
  usacasename: string;

  constructor(
    private router: Router,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private localStorage: LocalStorageService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.usacasename = this.localStorage.projectName;

    if (history.state.selectedFeatureSet) {
      this.fillFields();
      this.isDisabled = true;
      this.componentTitle = 'Edit feature set';
      this.componentDirection = 'Feature set edition';
    } else {
      this.isDisabled = false;
      this.componentTitle = 'Create a new feature set';
      this.componentDirection = 'Feature set creation';
    }

  }

  fillFields(): void {

    this.name = history.state.selectedFeatureSet.name;
    this.description = history.state.selectedFeatureSet.description ;
    this.dataSource = history.state.selectedFeatureSet.variables;
  }

  onNewVariable(): void {
    this.newVariable = new Variable();
    const dialogRef = this.dialog.open(NewVariableDialogComponent, {
      width: '80%',
      data: {newVariable: this.newVariable }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.newVariable = result;

        if (this.localStorage.projectType === 'association'){
          this.newVariable.variable_type = 'independent';
        }

        delete this.newVariable['newVariable'];
        this.dataSource.push(this.newVariable);
        this.table.renderRows();
      }
    });
  }

  onSave(): void {
    console.log('Saving feature set');
    const newFeatureSet = new FeatureSet();
    newFeatureSet.name = this.name;
    newFeatureSet.description = this.description;
    newFeatureSet.project_id = this.localStorage.projectId;
    newFeatureSet.variables = this.dataSource;
    console.log('Feature set to save: ', newFeatureSet);
    if (history.state.selectedFeatureSet) {
      console.log('Update existent feature set.');
      this.onUpdate(newFeatureSet);
    } else {
      newFeatureSet['created_by'] = this.localStorage.userId;
      this.backendService.saveFeatureSet(newFeatureSet).subscribe(
        (data) => {
          console.log('New feature set creation answer received! ', data);
          this.userCommunication.createMessage('snack-bar-success', 'Data set "' + data.name + '" created successfully')
          this.router.navigate(['/fslist']);
        },
        (err) => {
          this.backendService.handleError('home', err);
          this.userCommunication.createMessage(this.userCommunication.ERROR, 'New feature set creation failed!');
        });
      }
  }

  onCancel(status): void {

    if (status === 'no_saved') {
      const dialogConf = this.dialog.open(DialogConfirmationComponent, {
        width: '500px',
        data: {
                title: 'Are you sure?',
                message: 'The Feature set is not saved, are you sure you want to close?',
                cancelButton: 'Keep here',
                acceptButton: 'Close form'
              }
      });
      dialogConf.afterClosed().subscribe(result => {
        if (result) {
          this.confirmCancel();
        } else {
          console.log('canceled close');
        }
      });
    } else {
      this.confirmCancel();
    }
  }

  confirmCancel(): void {
    this.router.navigate(['/fslist']);
  }

  onDelete(variable): void {
    this.dataSource.forEach((item, index) => {
        if (item === variable) {
          this.dataSource.splice(index, 1);
        }
      });
    this.table.renderRows();
  }

  onUpdate(featureSet): void {
    console.log('update feature set: ', featureSet);
    this.backendService.updateFeatureSet(featureSet).subscribe(
      (data) => {
        console.log('data =>', data);
      },

      (err) => {

      }
    );
  }

}
