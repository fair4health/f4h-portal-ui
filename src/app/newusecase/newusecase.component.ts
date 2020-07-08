import { Component } from '@angular/core';



@Component({
  selector: 'app-newusecase',
  templateUrl: './newusecase.component.html',
  styleUrls: ['./newusecase.component.css']
})

export class NewusecaseComponent {
  selectedType = '?';
  types: string[] = ['Prediction', 'Association'];
}
