import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { MatTable } from '@angular/material/table';

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
    private userCommunication: UserCommunicationService
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
        this.table.first.renderRows();
        this.table.last.renderRows();
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get feature set list operation failed');
      });
  }

  onSelectModel(selectedModel): void {
    console.log('The selected model is: ' + selectedModel);
    // TO DO Feature set details dialog
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Not ready yet');
  }
}
