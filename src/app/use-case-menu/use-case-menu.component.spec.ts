import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseCaseMenuComponent } from './use-case-menu.component';

describe('UseCaseMenuComponent', () => {
  let component: UseCaseMenuComponent;
  let fixture: ComponentFixture<UseCaseMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseCaseMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseCaseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
