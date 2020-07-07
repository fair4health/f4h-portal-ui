import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  f1: string;
  f2: string;
  f3: string;
  f4: string;
  f5: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {f1: '30 days...', f2: 'Can be used real time...', f3: 'Precition', f4: 'admin', f5: '2020..'},
  {f1: 'discovery of disease...', f2: 'Translate...', f3: 'Asociation', f4: 'admin', f5: '2020..'}
];

@Component({
  selector: 'app-usecase',
  templateUrl: './usecase.component.html',
  styleUrls: ['./usecase.component.css']
})
export class UsecaseComponent  {
  displayedColumns: string[] = ['f1', 'f2', 'f3', 'f4', 'f5'];
  dataSource = ELEMENT_DATA;

}
