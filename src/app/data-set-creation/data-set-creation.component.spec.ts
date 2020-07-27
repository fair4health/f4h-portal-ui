import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSetCreationComponent } from './data-set-creation.component';

describe('DataSetCreationComponent', () => {
  let component: DataSetCreationComponent;
  let fixture: ComponentFixture<DataSetCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSetCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSetCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
