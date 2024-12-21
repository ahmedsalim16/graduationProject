import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grade1Component } from './grade1.component';

describe('Grade1Component', () => {
  let component: Grade1Component;
  let fixture: ComponentFixture<Grade1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Grade1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Grade1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
