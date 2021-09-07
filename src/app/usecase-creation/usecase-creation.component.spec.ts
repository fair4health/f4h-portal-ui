import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseCreationComponent } from './usecase-creation.component';

describe('UsecaseCreationComponent', () => {
  let component: UseCaseCreationComponent;
  let fixture: ComponentFixture<UseCaseCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseCaseCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
