import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grade3Component } from './grade3.component';

describe('Grade3Component', () => {
  let component: Grade3Component;
  let fixture: ComponentFixture<Grade3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Grade3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Grade3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
