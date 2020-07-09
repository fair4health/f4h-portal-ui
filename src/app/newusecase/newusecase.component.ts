import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-newusecase',
  templateUrl: './newusecase.component.html',
  styleUrls: ['./newusecase.component.css']
})

export class NewusecaseComponent {
  selectedType: string;
  types: string[] = ['Prediction', 'Association'];
}

