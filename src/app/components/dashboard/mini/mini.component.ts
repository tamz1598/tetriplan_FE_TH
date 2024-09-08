import { Component, Input, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-mini',
  templateUrl: './mini.component.html',
  styleUrl: './mini.component.css'
})
export class MiniComponent implements OnInit, AfterViewInit {
  @Input() loggedInUserName: string | null = null;
  tasks: any[] = [];
  taskDates: Set<string> = new Set(); //store the task dates to highlight for users
  selectedTasks: any[] = [];
  selectedDate: Date | null = null;

  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>; 

  constructor(private apiService: ApiService, private dialog: MatDialog, private renderer: Renderer2,
    private el: ElementRef) {}


  ngOnInit() {
    if (this.loggedInUserName) {
      this.loadTasks();
    }
  }

  ngAfterViewInit() {
    // Highlight task dates once the view has been initialized
    this.highlightTaskDates();
    // Listen to view changes (e.g., when changing months)
    // stateChange is subscribed to calendar
    // ensures highlightTaskDates is all called with every month change
    this.calendar.stateChanges.subscribe(() => {
      setTimeout(() => {
        this.highlightTaskDates();
      }, 0); // Delay to ensure the new month is fully rendered
    });
  }


  private loadTasks() {
    if (this.loggedInUserName) {
      this.apiService.getUserTasks(this.loggedInUserName).subscribe(
        response => {
          this.tasks = response.tasks || [];
          console.log('Tasks fetched:', this.tasks);
          this.extractTaskDates();
          this.highlightTaskDates();
        },
        error => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  private extractTaskDates() {
    this.taskDates.clear(); 
    this.tasks.forEach(task => {
      console.log("task.calendar",task.calendar)
      const date = task.calendar;
      if (date) {
        this.taskDates.add(date); // Store in 'YYYY-MM-DD' format
      }
    });
    console.log('Extracted Task Dates:', Array.from(this.taskDates));
  }

  onDateChange(date: Date | null) {
    this.selectedDate = date;
    if (date) {
      const selectedDateString = date.toLocaleDateString('en-CA'); // Convert date to 'YYYY-MM-DD' format
      this.selectedTasks = this.tasks.filter(task => {
        const taskDate = new Date(task.calendar).toLocaleDateString('en-CA');
        console.log("taskDate, selectedDateString", taskDate, selectedDateString)
        return taskDate === selectedDateString;
      });
      if (this.selectedTasks.length > 0) {
        // Open the task details dialog directly for the first task
        this.onTaskClick(this.selectedTasks[0]);
      } else {
        this.selectedTasks = [];
        console.log('No tasks for selected date:', date);
      }
    } else {
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


  highlightTaskDates() {
    // Select all calendar cells using their class name
    const calendarCells = this.el.nativeElement.querySelectorAll('.mat-calendar-body-cell');
    calendarCells.forEach((cell: HTMLElement) => {
      const cellDateString = cell.getAttribute('aria-label');
      if (cellDateString) {
        const formattedCellDate = new Date(cellDateString).toLocaleDateString('en-CA');
        if (this.taskDates.has(formattedCellDate)) {
          // If the date has a task, add the class or directly set the style
          this.renderer.setStyle(cell, 'background-color', 'rgb(177, 236, 134)');
          this.renderer.setStyle(cell, 'border-radius', '50%');
        }
      }
    });
  }

}
