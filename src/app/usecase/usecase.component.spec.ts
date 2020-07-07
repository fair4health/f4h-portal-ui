import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsecaseComponent } from './usecase.component';

describe('MenuComponent', () => {
  let component: UsecaseComponent;
  let fixture: ComponentFixture<UsecaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsecaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsecaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
