import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionDialogComponent } from './distribution-dialog.component';

describe('DistributionDialogComponent', () => {
  let component: DistributionDialogComponent;
  let fixture: ComponentFixture<DistributionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
