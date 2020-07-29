import { Component, OnInit } from '@angular/core';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

@Component({
  selector: 'app-feature-set-list',
  templateUrl: './feature-set-list.component.html',
  styleUrls: ['./feature-set-list.component.css']
})
export class FeatureSetListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'variables', 'created_by', 'created_on', 'details'];
  dataSource = [];

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) { }

    ngOnInit(): void {
      this.getFeatureSetList();
    }

    getFeatureSetList(): void {
      this.backendService.getFeaturesetsList().subscribe(
        (featuresetslist) => {
          console.log(featuresetslist);
          this.dataSource = featuresetslist;
        },
        (err) => {
          this.backendService.handleError('home', err);
          this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get feature set list operation failed');
        });
    }

    onSelectFeatureSet(selectedFeatureSet): void {
      console.log('The selected feature set is: ' + selectedFeatureSet);
      // TO DO Feature set details dialog
      this.userCommunication.createMessage(this.userCommunication.INFO, 'Not ready yet');
    }

}
