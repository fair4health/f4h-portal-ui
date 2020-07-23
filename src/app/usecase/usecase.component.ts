import { Component, OnInit } from '@angular/core';
import { BackendService } from '../core/services/backend.service';

@Component({
  selector: 'app-usecase',
  templateUrl: './usecase.component.html',
  styleUrls: ['./usecase.component.css']
})
export class UsecaseComponent implements OnInit {

  message;

  constructor(
    private backendService: BackendService
    ) { }

  ngOnInit(): void {
    this.onHttpGet();
  }

  onHttpGet(): void {
    this.backendService.getMessage().subscribe(
      (data) => {
      console.log(data);
      this.message = data;
      },
      (err) => {
        this.backendService.handleError('home', err);
      });
  }

}
