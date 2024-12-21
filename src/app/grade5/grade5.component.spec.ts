import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grade5Component } from './grade5.component';

describe('Grade5Component', () => {
  let component: Grade5Component;
  let fixture: ComponentFixture<Grade5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Grade5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Grade5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
