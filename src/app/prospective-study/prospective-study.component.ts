import { Component, OnInit } from '@angular/core';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';

@Component({
  selector: 'app-prospective-study',
  templateUrl: './prospective-study.component.html',
  styleUrls: ['./prospective-study.component.css']
})
export class ProspectiveStudyComponent implements OnInit {

  // variables

  psColumns: string[] = ['name', 'description', 'model', 'data_source', 'n_of_patients', 'created_by', 'creation_time', 'see_details'];
  dataSource = [];
  usecaseName: string;

  constructor(
    private localStorage: LocalStorageService,
    private backendService: BackendService,
  ) { }

  ngOnInit(): void {
    console.log('Project ID:', this.localStorage.projectId);
    this.getProspectiveStudies();
    this.usecaseName = this.localStorage.projectName;
  }

  getProspectiveStudies(): void {
    this.backendService.getProspectiveStudies().subscribe(
      (data) => {
        console.log(data);
      }
    );
  }

}
