import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-prospective-study',
  templateUrl: './prospective-study.component.html',
  styleUrls: ['./prospective-study.component.css']
})
export class ProspectiveStudyComponent implements OnInit {

  psColumns: string[] = [ 'name', 'description', 'data_mining_model', 'data_source',
                          'predictions', 'created_by', 'created_on', 'delete', 'see_details'];
  dataSource = [];
  useCaseName: string;
  isLoading = false;

  constructor(
    private localStorage: LocalStorageService,
    private backendService: BackendService,
    private router: Router,
    public userCommunication: UserCommunicationService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.useCaseName = this.localStorage.projectName;
    console.log('Project ID:', this.localStorage.projectId);
    this.getProspectiveStudies();
  }

  getProspectiveStudies(): void {
    this.isLoading = true;
    this.dataSource = [];
    this.backendService.getProspectiveStudies(this.localStorage.projectId).subscribe(
      (data) => {
        console.log(data);
        this.dataSource = data;
        this.isLoading = false;
      },
      (err) => {
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'Get Prospective Studies list operation failed');
        this.isLoading = false;
      }
    );
  }

  showDetails(row): void {
    const prescriptionStudy = row;
    this.router.navigate(['/pscreation'], {state: {prescriptionStudy}});
  }

  onDelete(element): void {
    console.log('element to delete: ', element);

    const dialogConf = this.dialog.open(DialogConfirmationComponent, {
      width: '600px',
      data: {
              title: 'Delete',
              message:  'Are your sure you want to delete ' + element.name + ' prospective study?',
              cancelButton: 'No, Cancel it',
              acceptButton: 'Yes, remove it permanently'
            }
    });

    dialogConf.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteProspectiveStudy(element.prospective_study_id).subscribe(
          (data) => {
            this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'Use case deleted correctly.');
            this.getProspectiveStudies();
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
