import { Component, ViewChild, AfterViewInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../../services/task.service'
import { Task } from '../../../models/task.model'; 
import { TaskDetailsPopupComponent } from '../task-details-pop-up/task-details-pop-up.component'; 
import { ApiService } from '../../../services/api.service';
import { TaskDetailsComponent } from '../task-details/task-details.component';


@Component({
  selector: 'app-day-view-calendar',
  templateUrl: './day-view-calendar.component.html',
  styleUrls: ['./day-view-calendar.component.css'],
})
export class DayViewCalendarComponent implements AfterViewInit, OnChanges {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @Input() isExpanded: boolean = false; // Example input for expansion control
  @Input() loggedInUserName: string | null = null;
  private draggedTaskId: string | null = null; 

  isLoading = true;
  calendarOptions: CalendarOptions = {
    plugins: [timeGridPlugin,
       interactionPlugin],
    initialView: 'timeGridDay',
    timeZone: 'local',
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
    eventTimeFormat: { // Add this configuration for 24-hour format
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Ensures 24-hour format
    },
    drop: this.handleDrop.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
    eventDragStop: this.handleEventDragStop.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog, private apiService: ApiService) {}

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
    const username = this.loggedInUserName;
    if (!username) {
      console.log("log in please to view tasks", username)
      this.isLoading = false;
      return;
    }

    // Example: Fetch events from the task service
     this.taskService.getUserTasks(username).subscribe(
      (tasks: Task[]) => {
        const events = tasks.map((task) => ({
          id: task._id,
          title: task.taskName,
          start: `${task.calendar}T${task.startTime}`, 
          end: `${task.calendar}T${task.endTime}`, 
          description: task.description,
          category: task.category,
          date: task.calendar, 
          duration: task.duration,
          completionStatus: task.completionStatus,
          label: task.label,
          priority: task.priority,
        }));
        console.log("task after loading", tasks)
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

    console.log('Clicked task ID:', taskId);
    // Example: Open a dialog to display task details
    
    if (taskId) {
      // Fetch the latest task details from the backend to ensure you have the updated information
      this.taskService.getUserTasks(this.loggedInUserName!).subscribe(
        (tasks: Task[]) => {
          const task = tasks.find(task => task._id === taskId);
          if (task) {
            const dialogRef = this.dialog.open(TaskDetailsComponent, {
              width: '600px',
              data: { taskId } // Pass the task with the updated information
            });
            dialogRef.afterClosed().subscribe(() => {
              console.log('The dialog was closed');
            });
          }
        },
        (error) => {
          console.error('Error fetching task details:', error);
        }
      );
    }
  }

  handleEventDrop(info: any): void {
    //Update task details after event drop
    const taskId = info.event.id;
    const newStart = info.event.start;
    const newEnd = info.event.end;

    console.log('Event dropped:', info);
    console.log('taskId', taskId, "newStart", newStart, "newEnd", newEnd);

     // Ensure newStart and newEnd are defined
    if (!newStart || !newEnd) {
      console.error('Invalid event start or end time');
      return;
    }

    // Extract startTime in "HH:mm" format
    const sthours = newStart.getHours().toString().padStart(2, '0');
    const stminutes = newStart.getMinutes().toString().padStart(2, '0');
    const startTime = `${sthours}:${stminutes}`;

    // Extract endTime in "HH:mm" format
    const ehours = newEnd.getHours().toString().padStart(2, '0');
    const eminutes = newEnd.getMinutes().toString().padStart(2, '0');
    const endTime = `${ehours}:${eminutes}`;

    this.taskService.getUserTasks(this.loggedInUserName!).subscribe(
      (tasks: Task[]) => {
        // Find the task that was dragged
        const taskToUpdate = tasks.find(task => task._id === taskId);

        if (taskToUpdate) {

          const updatedTask: Task = {
            ...taskToUpdate,
            startTime: startTime, 
            endTime: endTime,
            calendar: newStart.toISOString().split('T')[0],
          };
          console.log("handleEventDrop task", updatedTask)

          this.taskService.updateTask(updatedTask).subscribe(
            (response) => {
              console.log('Task updated successfully:', response);
              this.loadCalendarEvents(); 
            },
            (error) => {
              console.error('Error updating task:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  handleEventResize(info: any): void {
    const taskId = info.event.id;
    const newStart = info.event.start;
    const newEnd = info.event.end; 
    //Update task details after event resize
    console.log('Event resized:', info);
    //Implement logic to update task on the server
    if (taskId) {
      this.taskService.getUserTasks(this.loggedInUserName!).subscribe(
        (tasks: Task[]) => {
          // Find the task by ID
          const taskToUpdate = tasks.find(task => task._id === taskId);
          if (taskToUpdate) {
            // Create the updated task object
            const updatedTask: Task = {
              ...taskToUpdate, // Includes all the original task properties
              startTime: newStart.toISOString(), // Update only the changed properties
              endTime: newEnd ? newEnd.toISOString() : taskToUpdate.endTime,
              duration: newEnd ? Math.round((newEnd.getTime() - newStart.getTime()) / 60000) : taskToUpdate.duration, // Duration in minutes
            };
  
            // Call the update service method with the complete task object
            this.taskService.updateTask(updatedTask).subscribe(
              (response) => {
                console.log('Task updated successfully:', response);
                // Optionally, refresh or update the calendar view
                this.loadCalendarEvents();
              },
              (error) => {
                console.error('Error updating task:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }


  handleDrop(event: any): void {

    if (!event.dataTransfer) {
      console.error('DataTransfer is undefined');
      return;
    }

    console.log('Drop event:', event);
    console.log('DataTransfer:', event.dataTransfer);

    // Attempt to retrieve data
    const taskId = event.dataTransfer.getData('text/plain');
    console.log('Extracted taskId:', taskId);

    // Implement logic to process dropped item
    if (taskId) {
      this.taskService.getUserTasks(this.loggedInUserName!).subscribe(
        (tasks: Task[]) => {
          const taskToUpdate = tasks.find(task => task._id === taskId);
          console.log(taskToUpdate)
          if (taskToUpdate) {
            // Grab the startTime
            const calendarApi = this.calendarComponent.getApi();
            const currentDate = calendarApi.getCurrentData().currentDate;
        
            // Convert currentDate to local time and remove 1 hour (3600000 milliseconds), because Date keeps causing issues
            const adjustedDate = new Date(currentDate.getTime() - 3600000);
        
            console.log("adjustedTime -->", adjustedDate)
        
            // Define the duration of the task in minutes to find endTime
            const durationInMinutes = taskToUpdate.duration;
            const newStart = adjustedDate;
            const newEnd = new Date(newStart.getTime() + durationInMinutes * 60000);

            // Format start and end times to "HH:mm"
            const formatTime = (date: Date): string => {
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              return `${hours}:${minutes}`;
            };

            const startTime = formatTime(newStart); 
            const endTime = formatTime(newEnd); 

            const updatedTask: Task = {
              ...taskToUpdate,
              calendar: newStart.toISOString().split('T')[0],
              startTime: startTime,
              endTime: endTime,
            };
            console.log("after added st and et", updatedTask)

            // Update the task on the server
            this.taskService.updateTask(updatedTask).subscribe(
              (response) => {
                console.log('Task updated successfully:', response);
                this.loadCalendarEvents();
              },
              (error) => {
                console.error('Error updating task:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  handleEventDragStop(info: any): void {
    const taskId = info.event.id;
    const newStart = info.event.start;
    const newEnd = info.event.end; 

    if (!newStart || !newEnd) {
      console.error('Invalid event start or end time');
      return;
    }

    // Convert times to ISO format
    const newStartIso = newStart.toISOString();
    const calendarDate = newStartIso.split('T')[0];

    console.log('Event drag stopped:', info);
    
    // Find the task by ID and update its start and end times
    this.taskService.getUserTasks(this.loggedInUserName!).subscribe(
      (tasks: Task[]) => {
          // Find the task by ID
          const taskToUpdate = tasks.find(task => task._id === taskId);

          if (taskToUpdate) {
             // Calculate the new end time based on the duration
            const durationInMinutes = taskToUpdate.duration; // Duration should be in minutes
            const updatedEnd = new Date(newStart.getTime() + durationInMinutes * 60000); // Adding duration to new start time
            const newEndIso = updatedEnd.toISOString();
              // Create the updated task object
              const updatedTask: Task = {
                  ...taskToUpdate, // Include all original task properties
                  startTime: newStartIso, // Update start time
                  endTime: newEndIso, // Calculate and update end time
                  calendar: calendarDate, // Update calendar date to the new start date
              };

              console.log("updatedtask in handleEventDragStop", updatedTask)
  
            // Call the update service method with the complete task object
            this.taskService.updateTask(updatedTask).subscribe(
              (response) => {
                  console.log('Task updated successfully:', response);
                  // Optionally, refresh or update the calendar view
                  this.loadCalendarEvents();
              },
              (error) => {
                  console.error('Error updating task:', error);
                  // Optionally, notify the user about the error
              }
            );
          }
      },
      (error) => {
          console.error('Error fetching tasks:', error);
      }
    );
    
   this.draggedTaskId = null;
  }
  allowDrop(event: DragEvent): void {
    event.preventDefault(); // Necessary to allow drop
  }
}
