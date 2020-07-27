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
  displayedColumns: string[] = ['name', 'description', 'type', 'created_by', 'creation_time', 'select'];

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) { }

  ngOnInit(): void {
    this.onHttpGet();
  }

  onHttpGet(): void {
    this.backendService.getUseCaseList().subscribe(
      (usecaselist) => {
        console.log(usecaselist);
        this.dataSource = usecaselist;
        this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Http obtained successfully');
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Http operation failed');
      });
  }
}


