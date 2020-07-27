import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-use-case-menu',
  templateUrl: './use-case-menu.component.html',
  styleUrls: ['./use-case-menu.component.css']
})
export class UseCaseMenuComponent implements OnInit {

  name = 'Discovery of disease association patterns in comorbid patients';
  description = 'Translates into economic saving related to the reduction of efforts in parallel research, and impacts on health outcomes related to the managements of this kind of patients.';
  constructor() { }

  ngOnInit(): void {
  }

}
