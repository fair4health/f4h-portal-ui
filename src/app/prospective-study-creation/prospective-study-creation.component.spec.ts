import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectiveStudyCreationComponent } from './prospective-study-creation.component';

describe('ProspectiveStudyCreationComponent', () => {
  let component: ProspectiveStudyCreationComponent;
  let fixture: ComponentFixture<ProspectiveStudyCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectiveStudyCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectiveStudyCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
