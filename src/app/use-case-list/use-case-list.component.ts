import { Component, OnInit } from '@angular/core';
import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

@Component({
  selector: 'app-use-case-list',
  templateUrl: './use-case-list.component.html',
  styleUrls: ['./use-case-list.component.css']
})
export class UseCaseListComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['name', 'description', 'type', 'created_by', 'created_on', 'select'];

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) { }

  ngOnInit(): void {
    this.onGetUseCaseList();
  }

  onGetUseCaseList(): void {
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
}


