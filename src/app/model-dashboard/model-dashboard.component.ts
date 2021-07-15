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

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';

import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-model-dashboard',
  templateUrl: './model-dashboard.component.html',
  styleUrls: ['./model-dashboard.component.css']
})
export class ModelDashboardComponent implements OnInit {

  @ViewChildren(MatTable) table !: QueryList<MatTable<string>>;

  displayedColumns: string[] = ['name', 'description', 'algorithms', 'dataset_sources', 'execution_state', 'created_by', 'created_on', 'details'];
  dataSourceReady = [];
  dataSourceInProgress = [];
  useCaseName: string;

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private router: Router,
    private localStorage: LocalStorageService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    if (!this.localStorage.projectId) {
      this.userCommunication.createMessage(this.userCommunication.ERROR, 'Use case is not selected, come back and select one.');
    } else {
      this.useCaseName = this.localStorage.projectName;
      this.getModelsList();
    }
  }

  getModelsList(): void {

    this.dataSourceInProgress = [];
    this.dataSourceReady = [];

    this.backendService.getModels(this.localStorage.projectId).subscribe(
      (modelslist) => {
        modelslist.forEach(element => {
          let algorithmsList = '';
          element.algorithms.forEach(innerElement => {
            algorithmsList = algorithmsList + innerElement.name + ' ';
          });
          element.algorithms = algorithmsList;

          let datasetSourcesList = '';
          element.dataset.dataset_sources.forEach(innerElement => {
            if (innerElement.selection_status === 'selected') {
              datasetSourcesList = datasetSourcesList + '\u2022 ' + innerElement.agent.name + '\n';
            }
           
          });
          element.dataset = datasetSourcesList;

          if (element.data_mining_state === 'final') {
            this.dataSourceReady.push(element);
          } else {
            this.dataSourceInProgress.push(element);
          }
        });
        
        if (this.table.first) {
          this.table.first.renderRows();
        }
        if (this.table.last) {
          this.table.last.renderRows();
        }
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get models list operation failed');
      });
  }

  onSelectModel(selectedModel): void {
    console.log('The selected model is: ', selectedModel);
    // TO DO Feature set details dialog
    this.router.navigate(['/mcreation'], {state: {selectedModel}});
  }

  /**
   * 
   * @param element model to delete
   */
   onDelete(element): void {
    console.log('element to delete: ', element);

    const dialogConf = this.dialog.open(DialogConfirmationComponent, {
      width: '600px',
      data: {
              title: 'Delete',
              message:  'Are you sure you want to delete this Model? \n' +
                        'This information can not be recovered.',
              cancelButton: 'No, Cancel it',
              acceptButton: 'Yes, remove'
            }
    });

    dialogConf.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteModel(element.model_id).subscribe(
          (data) => {
            console.log('data', data);
            this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Model set deleted correctly.');
            this.getModelsList();
          },
          (err) => {
            console.log(err);
            this.userCommunication.createMessage(this.userCommunication.ERROR, err.error);
            this.getModelsList();
          }
        );
      }
    });
  }

}
