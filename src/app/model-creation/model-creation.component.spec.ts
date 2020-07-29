import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCreationComponent } from './model-creation.component';

describe('ModelCreationComponent', () => {
  let component: ModelCreationComponent;
  let fixture: ComponentFixture<ModelCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
