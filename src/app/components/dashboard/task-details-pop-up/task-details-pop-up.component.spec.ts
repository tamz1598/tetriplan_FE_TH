import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsPopupComponent } from './task-details-pop-up.component';

describe('TaskDetailsPopUpComponent', () => {
  let component: TaskDetailsPopupComponent;
  let fixture: ComponentFixture<TaskDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
