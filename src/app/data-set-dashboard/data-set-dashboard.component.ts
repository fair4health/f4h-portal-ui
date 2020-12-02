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

import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';


import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

@Component({
  selector: 'app-data-set-dashboard',
  templateUrl: './data-set-dashboard.component.html',
  styleUrls: ['./data-set-dashboard.component.css']
})
export class DataSetDashboardComponent implements OnInit {

  @ViewChildren(MatTable) table !: QueryList<MatTable<string>>;

  displayedColumns: string[] = ['name', 'description', 'dataset_sources', 'execution_state', 'created_by', 'created_on', 'details'];
  dataSourceReady = [];
  dataSourceInProgress = [];
  usacasename: string;

  constructor(
    private backendService: BackendService,
    private localStorage: LocalStorageService,
    private userCommunication: UserCommunicationService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.usacasename = this.localStorage.projectName;
    this.getDataSetsList();
  }

  getDataSetsList(): void {
    this.backendService.getDataSetsList(this.localStorage.projectId).subscribe(
      (datasetsList) => {
        console.log(datasetsList);
        datasetsList.forEach(element => {
          let datasetSourcesList = '';
          console.log('element.datasources', element.dataset_sources);
          console.log('datasource: ', element);
          element.dataset_sources.forEach(innerElement => {
            console.log('innerElement', innerElement)
           // datasetSourcesList = datasetSourcesList + innerElement.data_source.name + ' ';
          });
          element.dataset = datasetSourcesList;

          if (element.execution_state === 'final') {
            this.dataSourceReady.push(element);
            console.log('datasource: ', this.dataSourceReady);
          } else {
            this.dataSourceInProgress.push(element);
            console.log('datasource: ', this.dataSourceInProgress);
          }
          
          console.log('Source updated in table sources. ' + this.dataSourceReady.length + ' and ' + this.dataSourceInProgress.length + ' rows');
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
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get data sets list operation failed');
      });
  }

  onSelectDataSet(selectedDataSet): void {
    console.log(selectedDataSet);
    // TO DO Feature set details dialog
    // this.userCommunication.createMessage(this.userCommunication.INFO, 'Not ready yet');
    this.router.navigate(['/dsdetails'], {state: {selectedDataSet}});
  }
}
