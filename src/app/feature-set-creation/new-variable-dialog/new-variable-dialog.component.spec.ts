import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVariableDialogComponent } from './new-variable-dialog.component';

describe('NewVariableDialogComponent', () => {
  let component: NewVariableDialogComponent;
  let fixture: ComponentFixture<NewVariableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVariableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVariableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
