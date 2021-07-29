import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { BackendService } from '../core/services/backend.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { UserCommunicationService } from '../core/services/user-communication.service';
import { UseCase } from '../shared/use-case';

@Component({
  selector: 'app-usecase-creation',
  templateUrl: './usecase-creation.component.html',
  styleUrls: ['./usecase-creation.component.css']
})
export class UseCaseCreationComponent implements OnInit {

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private service: BackendService,
              private userCommunication: UserCommunicationService,
              private localStorage: LocalStorageService,
              private auth: AuthService
              ) { }

  formGroup1: FormGroup;

  useCaseForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    project_type: new FormControl('prediction', Validators.required)
  });
  required = {
    name: true,
    description: true
  }

  ngOnInit(): void {

    if (this.auth.role === 'Healthcare professional') {
      this.router.navigate(['/uclist']);
    }
    this.formGroup1 = this.formBuilder.group({
      formGroup1: ['', Validators.required]
    });
  }

  /**
   * Call the service to save.
   * Get the data from the form
   */
  onSave(): void {
    const newUseCase = new UseCase();

    Object.keys(this.useCaseForm.controls).forEach(key => {
      newUseCase[key] = this.useCaseForm.get(key).value;
    });

    newUseCase.created_by = this.localStorage.userId;

    if (this.useCaseForm.valid) {
      
    
      this.service.saveUseCase(newUseCase).subscribe(
        (useCase) => {
        this.userCommunication.createMessage(this.userCommunication.SUCCESS, 'The use case "' + useCase.name + ' has been created successfully!');
        this.router.navigate(['/uclist']);
      },
      (err) => {
        this.service.handleError('home', err);
        this.userCommunication.createMessage(this.userCommunication.ERROR, 'New feature set creation failed!');
      });
    }else {
      this.userCommunication.createMessage(this.userCommunication.ERROR, 'The fields "Use case name" and "Description" are required');
      this.useCaseForm.get('name').markAsTouched();
      this.useCaseForm.get('description').markAsTouched();
      this.required.name = this.useCaseForm.get('name').valid
      this.required.description = this.useCaseForm.get('description').valid
    }
  }

  /**
   * Cancel button: go back and no save.
   */
  onCancel(): void {
    this.router.navigate(['/uclist']);
  }

}
