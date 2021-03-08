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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UseCase } from '../shared/use-case';
import {MatTableDataSource} from '@angular/material/table';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';

// to know user role
import { AuthService } from '../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-use-case-list',
  templateUrl: './use-case-list.component.html',
  styleUrls: ['./use-case-list.component.css']
})
export class UseCaseListComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['name', 'description', 'project_type', 'created_by', 'created_on', 'delete', 'select'];

  constructor(
    public auth: AuthService,
    private router: Router,
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private localStorage: LocalStorageService,
    public dialog: MatDialog
    ) { }

    ngOnInit(): void {
    this.getUseCaseList();
    this.localStorage.reset();
  }

  /* Set filter after the view init */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   getUseCaseList(): void {
    this.backendService.getUseCaseList().subscribe(
      (usecaselist) => {
        console.log(usecaselist);
        this.dataSource = new MatTableDataSource(usecaselist);
        // if clinical role show 'prection' use case
        if (this.auth.isLoggedIn()) {
          if (this.auth.role === 'Healthcare professional') {
            this.dataSource.filterPredicate = this.createFilter();
            this.dataSource.filter = 'prediction';
          }
        }
      },
      (err) => {
        console.log('error: ', err);
        this.backendService.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get use case list operation failed');
      });
  }

  // Filter to filter by specifique column
  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = function(data, filter: string): boolean {
      return data.project_type.toLowerCase().indexOf(filter) !== -1;
    };
    return filterFunction;
  }

  onCreateNewUseCase(): void {
    this.router.navigate(['/uccreation']);
  }

  onUseCaseSelected(useCaseSelected: UseCase): void {
    console.log('Use case is selected ' + JSON.stringify(useCaseSelected));
    if (useCaseSelected.project_type === 'association') {
      this.localStorage.setProjectId(useCaseSelected.project_id);
      this.localStorage.setProjectName(useCaseSelected.name);
      this.localStorage.setProjectType(useCaseSelected.project_type);
      this.router.navigate(['/ucmenu']);
    } else if (useCaseSelected.project_type === 'prediction') {
      this.localStorage.setProjectId(useCaseSelected.project_id);
      this.localStorage.setProjectName(useCaseSelected.name);
      this.router.navigate(['/ucmenu']);
      this.localStorage.setProjectType(useCaseSelected.project_type);
    } else {
      console.log('Project type does not match association nor prediction');
      this.userCommunication.createMessage(this.userCommunication.ERROR, 'Project type does not match association nor prediction');
    }
  }

  onDelete(element): void {

    const dialogConf = this.dialog.open(DialogConfirmationComponent, {
      width: '600px',
      data: {
              title: 'Delete',
              message:  'If you delete this use case all FeatureSet, Data mining Model' +
                        'and Prospective Studies assoiated will be removed as well. This' +
                        'information can not be recovered',
              cancelButton: 'No, Cancel it',
              acceptButton: 'Yes, remove this use case and its information'
            }
    });

    dialogConf.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteUseCase(element.project_id).subscribe(
          (data) => {
            this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Use case deleted correctly.');
            this.router.navigate(['/uclist']);
          },
          (err) => {
            console.log(err);
            this.userCommunication.createMessage(this.userCommunication.ERROR, 'Error deleting use case.');
          }
        );
      }
    });
  }

}
