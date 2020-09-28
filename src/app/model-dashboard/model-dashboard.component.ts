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
import { UserCommunicationService } from '../core/services/user-communication.service';

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

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getModelsList();
  }

  getModelsList(): void {
    this.backendService.getModelsList().subscribe(
      (modelslist) => {
        console.log(modelslist);
        modelslist.forEach(element => {
          let algorithmsList = '';
          element.algorithms.forEach(innerElement => {
            algorithmsList = algorithmsList + innerElement.name + ' ';
          });
          element.algorithms = algorithmsList;

          let datasetSourcesList = '';
          element.dataset.dataset_sources.forEach(innerElement => {
            datasetSourcesList = datasetSourcesList + innerElement.data_source.name + ' ';
          });
          element.dataset = datasetSourcesList;

          if (element.execution_state === 'final') {
            this.dataSourceReady.push(element);
          } else {
            this.dataSourceInProgress.push(element);
          }
          console.log('Model updated in table sources. ' + this.dataSourceReady.length + ' and ' + this.dataSourceInProgress.length + ' rows');
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
}
