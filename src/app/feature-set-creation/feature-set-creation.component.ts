import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { BackendService } from '../core/services/backend.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { LocalStorageService } from '../core/services/local-storage.service';

import { Variable } from '../shared/variable';
import { NewVariableDialogComponent } from './new-variable-dialog/new-variable-dialog.component';

@Component({
  selector: 'app-feature-set-creation',
  templateUrl: './feature-set-creation.component.html',
  styleUrls: ['./feature-set-creation.component.css']
})
export class FeatureSetCreationComponent implements OnInit {

  name: string;
  description: string;
  newVariable: Variable;

  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = ['name', 'description', 'variable_type', 'variable_data_type', 'fhir_query', 'fhir_path'];
  dataSource = [];

  constructor(
    private backendService: BackendService,
    private userCommunication: UserCommunicationService,
    private localStorage: LocalStorageService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  onNewVariable(): void {
    const dialogRef = this.dialog.open(NewVariableDialogComponent, {
      width: '250px',
      data: {newVariable: this.newVariable}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.newVariable = result;
        this.dataSource.push(this.newVariable);
        this.table.renderRows();
      }
    });
  }

  onSave(): void {
    console.log('Saving feature set');
    console.log('Variable to save: ' + JSON.stringify(this.newVariable));
  }

  onCancel(): void {
    console.log('Cancel feature set creation');
  }

}
