import { Component, EventEmitter, Inject, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'; 
import { MatIconModule } from '@angular/material/icon';


import { TaskService } from '../../../services/task.service'; 
import { Task } from '../../../models/task.model'
import { TaskRefreshService } from '../../../services/task-refresh.service'; 
import { ExampleHeader } from '../example-header/example-header.component'; 


@Component({
  selector: 'app-task-details-popup',
  templateUrl: './task-details-pop-up.component.html',
  styleUrls: ['./task-details-pop-up.component.css'],
  animations: [
    trigger('transitionMessages', [
      state('void', style({
        transform: 'translateY(-100%)',
        opacity: 0
      })),
      transition(':enter', [
        animate('300ms ease-out', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({
          transform: 'translateY(-100%)',
          opacity: 0
        }))
      ])
    ])
  ],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsPopupComponent {
  isEditing = false;
  editableTask: Task;
  categories: string[] = [];
  labels: string[] = [];

  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() completeTask: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private taskService: TaskService,
    private taskRefreshService: TaskRefreshService,
    public dialogRef: MatDialogRef<TaskDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    // Initialize editableTask with a copy of the data received
    this.editableTask = { ...data };
    console.log(this.editableTask);
  }

  ngOnInit(): void {
    this.taskService.categories$.subscribe((categories) => {
      this.categories = categories;
      console.log('Task categories:', this.categories);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveTask(): void {
    // Extract calendar from editableTask and prepare data for update
    const { calendar, ...rest } = this.editableTask;
    const taskUpdateData = {
      ...rest,
      calendar: calendar, 
    };

    // Call updateTask method from TaskService to update the task
    this.taskService.updateTask(taskUpdateData).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.taskRefreshService.triggerReloadTasks();
        this.isEditing = false;
        this.closeDialog();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  handleTaskCompleted(): void {
    // Toggle the task's completion status
    this.editableTask.completionStatus = !this.editableTask.completionStatus;

    // Update task's completion status using TaskService
    this.taskService.updateTask(this.editableTask).subscribe(
      (response) => {
        console.log('Task completion status updated:', response);
        this.completeTask.emit(this.editableTask.completionStatus);
        this.taskUpdated.emit(this.editableTask);
        this.taskRefreshService.triggerReloadTasks();
        this.closeDialog();
      },
      (error) => {
        console.error('Error updating task completion status:', error);
      }
    );
  }

  readonly exampleHeader = ExampleHeader;
}

