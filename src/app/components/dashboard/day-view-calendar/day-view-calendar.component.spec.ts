import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayViewCalendarComponent } from './day-view-calendar.component';

describe('DayViewCalendarComponent', () => {
  let component: DayViewCalendarComponent;
  let fixture: ComponentFixture<DayViewCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DayViewCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayViewCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
