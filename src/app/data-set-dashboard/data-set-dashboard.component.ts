import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { MatTable } from '@angular/material/table';

import { BackendService } from '../core/services/backend.service';
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

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) { }

  ngOnInit(): void {
    this.getDataSetsList();
  }

  getDataSetsList(): void {
    this.backendService.getDataSetsList().subscribe(
      (datasetsList) => {
        console.log(datasetsList);
        datasetsList.forEach(element => {
          let datasetSourcesList = '';
          element.dataset_sources.forEach(innerElement => {
            datasetSourcesList = datasetSourcesList + innerElement.data_source.name + ' ';
          });
          element.dataset = datasetSourcesList;

          if (element.execution_state === 'final') {
            this.dataSourceReady.push(element);
          } else {
            this.dataSourceInProgress.push(element);
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
    console.log('The selected data set is: ' + selectedDataSet);
    // TO DO Feature set details dialog
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Not ready yet');
  }
}
