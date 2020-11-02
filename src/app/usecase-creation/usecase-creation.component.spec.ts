import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsecaseCreationComponent } from './usecase-creation.component';

describe('UsecaseCreationComponent', () => {
  let component: UsecaseCreationComponent;
  let fixture: ComponentFixture<UsecaseCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsecaseCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsecaseCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
