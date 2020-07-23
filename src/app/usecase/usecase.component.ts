import { Component, OnInit } from '@angular/core';
import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

@Component({
  selector: 'app-usecase',
  templateUrl: './usecase.component.html',
  styleUrls: ['./usecase.component.css']
})
export class UsecaseComponent implements OnInit {

  message;

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
    ) { }

  ngOnInit(): void {
    this.onHttpGet();
  }

  onHttpGet(): void {
    this.backendService.getMessage().subscribe(
      (data) => {
      console.log(data);
      this.message = data;
      this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Http obtained successfully');
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Http operation failed');
      });
  }

}
