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

import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';


@Component({
  selector: 'app-feature-set-list',
  templateUrl: './feature-set-list.component.html',
  styleUrls: ['./feature-set-list.component.css']
})
export class FeatureSetListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'variables', 'created_by', 'created_on', 'details'];
  dataSource = [];
  usacasename: string;

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private localStorage: LocalStorageService,
    private router: Router,
    public dialog: MatDialog
    ) { }

    ngOnInit(): void {
      this.getFeatureSetList();
      this.usacasename = this.localStorage.projectName;
    }

    getFeatureSetList(): void {
      this.dataSource = [];
      this.backendService.getFeaturesetsList(this.localStorage.projectId).subscribe(
        (featuresetslist) => {
          this.dataSource = featuresetslist;
          console.log('datasource de las listas', this.dataSource)
        },
        (err) => {
          this.backendService.handleError('home', err);
          this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get feature set list operation failed');
        });
    }

    onSelectFeatureSet(selectedFeatureSet): void {
      console.log('The selected feature set is: ', selectedFeatureSet);
      // TO DO Feature set details dialog
     // this.userCommunication.createMessage(this.userCommunication.INFO, 'Not ready yet');
      this.router.navigate(['/fsdetails'], {state: {selectedFeatureSet}});
    }

    createNewFeatureSet(): void {
      const featureSets = this.dataSource;
      this.router.navigate(['/fscreation'], {state: {featureSets}});
    }

    onDelete(element): void{
      const dialogConf = this.dialog.open(DialogConfirmationComponent, {
        width: '600px',
        data: {
                title: 'Delete',
                message:  'Are you sure you want to delete this feature set?' +
                          'This information can not be recovered.',
                cancelButton: 'No, Cancel it',
                acceptButton: 'Yes, remove'
              }
      });

      dialogConf.afterClosed().subscribe(result => {
        if (result) {
          this.backendService.deleteFeatureSet(element.featureset_id).subscribe(
            (data) => {
              console.log('data', data);
              this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Feature set deleted correctly.');
              this.getFeatureSetList();
            },
            (err) => {
              console.log(err);
              this.userCommunication.createMessage(this.userCommunication.ERROR, err.error);
              this.getFeatureSetList();
            }
          );
        }
      });
    }

}
