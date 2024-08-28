import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatCalendar, MatCalendarHeader } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';

@Component({
  selector: 'app-mini',
  templateUrl: './mini.component.html',
  styleUrl: './mini.component.css'
})
export class MiniComponent implements OnInit {
  @Input() loggedInUserName: string | null = null;
  tasks: any[] = [];
  taskDates: Set<string> = new Set(); //store the task dates to highlight for users
  selectedTasks: any[] = [];
  selectedDate: Date | null = null;

  constructor(private apiService: ApiService, private dialog: MatDialog) {}


  ngOnInit() {
    if (this.loggedInUserName) {
      this.loadTasks();
    }
  }

  private loadTasks() {
    if (this.loggedInUserName) {
      this.apiService.getUserTasks(this.loggedInUserName).subscribe(
        response => {
          this.tasks = response.tasks || [];
          console.log('Tasks fetched:', this.tasks);
          this.extractTaskDates();
        },
        error => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  private extractTaskDates() {
    this.tasks.forEach(task => {
      console.log("task.calendar",task.calendar)
      const date = (task.calendar);
      if (date) {
        this.taskDates.add(date); // Store in 'YYYY-MM-DD' format
      }
    });
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;
    if (date) {
      const selectedDateString = date.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
      this.selectedTasks = this.tasks.filter(task => {
        const taskDate = task.calendar;
        return taskDate === selectedDateString;
      });
      console.log('Selected date:', date);
      console.log('Tasks for selected date:', this.selectedTasks);
    } else {
      this.selectedTasks = [];
      console.log('No date selected.');
    }
  }


  onTaskClick(task: any) {
    this.dialog.open(TaskDetailsComponent, {
      width: '600px', 
      height: 'auto', 
      data: { taskId: task._id }, 
      panelClass: 'task-modal', 
      autoFocus: false
    });
  }

   // Custom method to check if a date has tasks
   dateClass() {
    return (date: Date): string => {
      const dateString = date.toISOString().split('T')[0];
      return this.taskDates.has(dateString) ? 'has-task' : '';
    };
  }
}
