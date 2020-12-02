import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';

@Component({
  selector: 'app-prospective-study',
  templateUrl: './prospective-study.component.html',
  styleUrls: ['./prospective-study.component.css']
})
export class ProspectiveStudyComponent implements OnInit {

  psColumns: string[] = ['name', 'description', 'data_mining_model', 'data_source', 'predictions', 'created_by', 'created_on', 'see_details'];
  dataSource = [];
  useCaseName: string;

  constructor(
    private localStorage: LocalStorageService,
    private backendService: BackendService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.useCaseName = this.localStorage.projectName;
    console.log('Project ID:', this.localStorage.projectId);
    this.getProspectiveStudies();
  }

  getProspectiveStudies(): void {
    this.backendService.getProspectiveStudies().subscribe(
      (data) => {
        console.log(data);
        this.dataSource = data;
      }
    );
  }

  showDetails(row) {
    const prescriptionStudy = row;
    this.router.navigate(['/pscreation'], {state: {prescriptionStudy}});
  }

}
