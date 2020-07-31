import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCriteriaparameterDialogComponent } from './new-criteriaparameter-dialog.component';

describe('NewCriteriaparameterDialogComponent', () => {
  let component: NewCriteriaparameterDialogComponent;
  let fixture: ComponentFixture<NewCriteriaparameterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCriteriaparameterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCriteriaparameterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
