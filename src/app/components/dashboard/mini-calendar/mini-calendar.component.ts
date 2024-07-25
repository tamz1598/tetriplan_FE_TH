import { Component, Input, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { TaskService } from '../../../services/task.service'

@Component({
  selector: 'app-mini-calendar',
  template: '<full-calendar [options]="calendarOptions"></full-calendar>',
  styleUrls: ['./mini-calendar.component.css'],
  standalone: true,
  imports: [FullCalendarModule]
})
export class MiniCalendarComponent implements OnInit {
  @Input() loggedInUserName: string | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    events: []
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    if (this.loggedInUserName) {
      this.taskService.getUserTasks(this.loggedInUserName).subscribe(tasks => {
        this.calendarOptions.events = tasks.map(task => ({
          title: task.taskName,
          start: task.calendar,
          end: task.calendar,
          allDay: true
        }));
      });
    }
  }
}
