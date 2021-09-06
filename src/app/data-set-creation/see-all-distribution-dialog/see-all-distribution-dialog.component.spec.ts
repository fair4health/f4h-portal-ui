import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAllDistributionDialogComponent } from './see-all-distribution-dialog.component';

describe('SeeAllDistributionDialogComponent', () => {
  let component: SeeAllDistributionDialogComponent;
  let fixture: ComponentFixture<SeeAllDistributionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeAllDistributionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeAllDistributionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
