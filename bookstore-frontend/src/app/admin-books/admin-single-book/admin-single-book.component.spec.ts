import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSingleBookComponent } from './admin-single-book.component';

describe('AdminSingleBookComponent', () => {
  let component: AdminSingleBookComponent;
  let fixture: ComponentFixture<AdminSingleBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSingleBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminSingleBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
