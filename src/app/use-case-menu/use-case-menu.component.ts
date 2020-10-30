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

import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { LocalStorageService } from '../core/services/local-storage.service';

import { UseCase } from '../shared/use-case';

@Component({
  selector: 'app-use-case-menu',
  templateUrl: './use-case-menu.component.html',
  styleUrls: ['./use-case-menu.component.css']
})
export class UseCaseMenuComponent implements OnInit {

  useCaseSelectedId: string;
  useCase: UseCase;
  useCaseType: string;
  cols: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    // this.useCaseSelectedId = this.route.snapshot.paramMap.get('useCaseSelectedId');
    this.useCaseSelectedId = this.localStorage.projectId;
    console.log('Load use case: ' + this.useCaseSelectedId);
    this.getUseCase(this.useCaseSelectedId);
  }

  getUseCase(id: string): void {
    this.backendService.getUseCase(id).subscribe(
      (usecase) => {
        console.log(usecase);
        // Array check to work with real service and mock service
        if (Array.isArray(usecase)) {
          this.useCase = usecase[0];
          this.useCaseType = usecase[0].project_type;
        } else {
          this.useCase = usecase;
          this.useCaseType = usecase.project_type;
        }
        if (this.useCaseType === 'prediction') {
          this.cols = 2;
        }else if (this.useCaseType === 'association') {
          this.cols = 3;
        }

        this.localStorage.setProjectId(this.useCaseSelectedId);
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

  onProspectiveStudy(): void {
    console.log('Prospective study selected');
    this.userCommunication.createMessage(this.userCommunication.INFO, 'Prediction Study is not supported yet');
  }
}
