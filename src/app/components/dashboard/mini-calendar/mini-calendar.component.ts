import { Component, Input, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventContentArg, EventClickArg  } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model'

@Component({
  selector: 'app-mini-calendar',
  template: '<full-calendar [options]="calendarOptions"></full-calendar>',
  styleUrls: ['./mini-calendar.component.css'],
  standalone: true,
  imports: [FullCalendarModule, MatDialogModule]
})
export class MiniCalendarComponent implements OnInit {
  @Input() loggedInUserName: string | null = null;
  tasks: any[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    events: [],
    eventContent: this.renderEventContent.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(private taskService: TaskService,  private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  //loadTask calls endpoint getUserTasks
  //check if array structure due to response
  loadEvents(): void {
    if (this.loggedInUserName) {
      this.taskService.getUserTasks(this.loggedInUserName).subscribe(
        (tasks: Task[] | any) => {
          console.log('Fetched tasks:', tasks); 
          
          if (Array.isArray(tasks)) {
            this.calendarOptions.events = tasks.map((task: Task) => ({
              title: task.taskName,
              start: task.calendar,
              end: task.calendar,
              allDay: true,
              extendedProps: {
                description: task.description,
                taskDetails: task //added so that when it loads then task can be grabbed from extended props
              }
            }));
          } else {
            console.error('Expected an array of tasks but got:', tasks);
          }
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  renderEventContent(eventInfo: EventContentArg) {
    return {
      html: `<div style="
      width: 25px !important;
      height: 25px !important;
      background-color: #3ab399;
      border-radius: 100% !important;
      margin: 0 auto !important;
      cursor: pointer;
    "></div>`
    };
  }

  // when click on task card
  // load the task
  // if task found then open taskDetails
  handleEventClick(info: EventClickArg) {
    const taskId = info.event._def.extendedProps['taskDetails']._id;

    console.log('taskId in mini', taskId);
    console.log('Event clicked:', info.event);
    console.log('Extended Props:', info.event.extendedProps);

    const task = info.event.extendedProps['taskDetails'];
    if (task) {
      this.dialog.open(TaskDetailsComponent, {
        width: '600px', 
        height: 'auto', 
        data: { taskId }, 
        panelClass: 'task-modal', 
        autoFocus: false
      });
    } else {
      console.error('Task details not found in event properties.');
    }
  }
}
