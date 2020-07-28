import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-data-set-creation',
  templateUrl: './data-set-creation.component.html',
  styleUrls: ['./data-set-creation.component.css']
})
export class DataSetCreationComponent implements OnInit {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;
  formGroup5: FormGroup;

  constructor(
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.formGroup1 = this.formBuilder.group({
      formGroup1: ['', Validators.required]
    });
    this.formGroup2 = this.formBuilder.group({
      formGroup2: ['', Validators.required]
    });
    this.formGroup3 = this.formBuilder.group({
      formGroup3: ['', Validators.required]
    });
    this.formGroup4 = this.formBuilder.group({
      formGroup4: ['', Validators.required]
    });
    this.formGroup5 = this.formBuilder.group({
      formGroup5: ['', Validators.required]
    });
  }
}
