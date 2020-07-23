import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureSetListComponent } from './feature-set-list.component';

describe('FeatureSetListComponent', () => {
  let component: FeatureSetListComponent;
  let fixture: ComponentFixture<FeatureSetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureSetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
