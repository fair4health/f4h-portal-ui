import { Component, OnInit } from '@angular/core';
import UseCases from '../../../mocks/data.json';

@Component({
  selector: 'app-use-case-list',
  templateUrl: './use-case-list.component.html',
  styleUrls: ['./use-case-list.component.css']
})
export class UseCaseListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'type', 'created_by', 'creation_time', 'select'];
  dataSource = UseCases.usecases;

  constructor() { }

  ngOnInit(): void {
  }
}


