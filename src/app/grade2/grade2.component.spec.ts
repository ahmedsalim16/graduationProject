import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grade2Component } from './grade2.component';

describe('Grade2Component', () => {
  let component: Grade2Component;
  let fixture: ComponentFixture<Grade2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Grade2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Grade2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
