import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';

import { UseCase } from '../shared/use-case';

@Component({
  selector: 'app-use-case-menu',
  templateUrl: './use-case-menu.component.html',
  styleUrls: ['./use-case-menu.component.css']
})
export class UseCaseMenuComponent implements OnInit {

  @Input() useCaseSelectedId;

  useCase: UseCase;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService
  ) { }

  ngOnInit(): void {
    this.useCaseSelectedId = this.route.snapshot.paramMap.get('useCaseSelectedId');
    console.log('Received: ' + this.useCaseSelectedId);
    this.getUseCase(this.useCaseSelectedId);
  }

  getUseCase(id: string): void {
    this.backendService.getUseCase(id).subscribe(
      (usecase) => {
        console.log(usecase);
        this.useCase = usecase;
      },
      (err) => {
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get use case ' + id + ' operation failed');
      });
  }

  onFeatureMgmt(): void {
    console.log('Feature management');
    this.router.navigate(['/fslist']);
  }

  onDataSetMgmt(): void {
    console.log('Data Set management');
    this.router.navigate(['/dsdashboard']);
  }

  onModelMgmt(): void {
    console.log('Model management');
    this.router.navigate(['/mdashboard']);
  }
}
