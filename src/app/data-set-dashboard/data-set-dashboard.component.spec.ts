import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSetDashboardComponent } from './data-set-dashboard.component';

describe('DataSetDashboardComponent', () => {
  let component: DataSetDashboardComponent;
  let fixture: ComponentFixture<DataSetDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSetDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
