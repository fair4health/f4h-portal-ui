import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewusecaseComponent } from './newusecase.component';

describe('NewusecaseComponent', () => {
  let component: NewusecaseComponent;
  let fixture: ComponentFixture<NewusecaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewusecaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewusecaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
