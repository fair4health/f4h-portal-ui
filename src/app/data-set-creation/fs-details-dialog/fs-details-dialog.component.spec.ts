import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FsDetailsDialogComponent } from './fs-details-dialog.component';

describe('FsDetailsDialogComponent', () => {
  let component: FsDetailsDialogComponent;
  let fixture: ComponentFixture<FsDetailsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FsDetailsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FsDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
