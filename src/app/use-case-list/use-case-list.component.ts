import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { UseCase } from '../shared/use-case';

@Component({
  selector: 'app-use-case-list',
  templateUrl: './use-case-list.component.html',
  styleUrls: ['./use-case-list.component.css']
})
export class UseCaseListComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['name', 'description', 'project_type', 'created_by', 'created_on', 'select'];

  constructor(
    private router: Router,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) { }

  ngOnInit(): void {
    this.getUseCaseList();
  }

  getUseCaseList(): void {
    this.backendService.getUseCaseList().subscribe(
      (usecaselist) => {
        console.log(usecaselist);
        this.dataSource = usecaselist;
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get use case list operation failed');
      });
  }

  onCreateNewUseCase(): void {
    // TO DO
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Not ready yet');
  }

  onUseCaseSelected(useCaseSelected: UseCase): void {
    console.log('Use case is selected ' + JSON.stringify(useCaseSelected));
    if (useCaseSelected.project_type === 'association') {
      console.log('Association use case selected!');
      this.router.navigate(['/ucmenu', {useCaseSelectedId: useCaseSelected.project_id}]);
    } else if (useCaseSelected.project_type === 'prediction') {
      console.log('Prediction use case selected!');
      // TO DO prediction use case navigation
      this.userCommunication.createMessage(this.userCommunication.INFO, 'Prediction use case is not supported yet');
    } else {
      console.log('Project type does not match association nor prediction');
      this.userCommunication.createMessage(this.userCommunication.ERROR, 'Project type does not match association nor prediction');
    }
  }
}


