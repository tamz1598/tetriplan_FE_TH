import { Component, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskService } from '../../../services/task.service'
import { Task } from '../../../models/task.model'; 
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsPopupComponent } from '../../../task-details-pop-up/task-details-pop-up.component'; 

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements AfterViewInit, OnChanges {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @Input() isExpanded: boolean = false; // Example input for expansion control

  isLoading = true;
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin,
       interactionPlugin],
    initialView: 'timeGridDay',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek',
    },
    events: [],
    allDaySlot: false,
    height: 'auto',
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    nowIndicator: true,
    editable: true,
    droppable: true,
    eventColor: '#3ab399',
    drop: this.handleDrop.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventDragStop: this.handleEventDragStop.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    // Optionally perform actions after view initialization
    this.loadCalendarEvents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isExpanded']) {
      this.updateCalendarView();
    }
  }

  updateCalendarView(): void {
    if (this.calendarComponent && this.calendarComponent.getApi) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.changeView(this.isExpanded ? 'timeGridWeek' : 'timeGridDay');
    }
  }

  loadCalendarEvents(): void {
    this.isLoading = true;
    // Example: Fetch events from the task service
    this.taskService.getTasks().subscribe(
      (tasks: Task[]) => {
        const events = tasks.map((task) => ({
          id: task._id,
          title: task.taskName,
          start: task.startTime, // Adjust as per your task model
          end: task.endTime, // Adjust as per your task model
          description: task.description,
          category: task.category,
          date: task.dateAdded, // Adjust as per your task model
          duration: task.duration,
          completionStatus: task.completionStatus,
          label: task.label,
          priority: task.priority,
        }));
        this.calendarOptions.events = events;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        this.isLoading = false;
      }
    );
  }

  handleEventClick(arg: any): void {
    const taskId = arg.event.id;
    // Example: Open a dialog to display task details
    if (taskId) {
      const dialogRef = this.dialog.open(TaskDetailsPopupComponent, {
        width: '600px',
        data: { taskId } // Adjust as per your task details
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        // Implement logic after dialog closes if needed
      });
    }
  }

  handleEventDrop(info: any): void {
    const taskId = info.event.id;
    // Example: Update task details after event drop
    console.log('Event dropped:', info);
    // Implement logic to update task on the server
  }

  handleEventResize(info: any): void {
    const taskId = info.event.id;
    // Example: Update task details after event resize
    console.log('Event resized:', info);
    // Implement logic to update task on the server
  }

  handleDrop(info: any): void {
    // Example: Handle drop of external items into the calendar
    console.log('Dropped:', info);
    // Implement logic to process dropped item
  }
}