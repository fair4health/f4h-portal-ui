import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectiveStudyComponent } from './prospective-study.component';

describe('ProspectiveStudyComponent', () => {
  let component: ProspectiveStudyComponent;
  let fixture: ComponentFixture<ProspectiveStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectiveStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectiveStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
