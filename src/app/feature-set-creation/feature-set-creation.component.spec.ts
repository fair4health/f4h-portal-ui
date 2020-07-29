import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureSetCreationComponent } from './feature-set-creation.component';

describe('FeatureSetCreationComponent', () => {
  let component: FeatureSetCreationComponent;
  let fixture: ComponentFixture<FeatureSetCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureSetCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureSetCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
