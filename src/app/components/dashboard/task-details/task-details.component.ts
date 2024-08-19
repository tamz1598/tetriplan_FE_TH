import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../models/task.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  task: Task | null = null;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {  taskId: string },
    private apiService: ApiService 
  ) { }

  ngOnInit(): void {
    console.log('Received taskId:', this.data.taskId);

    if (this.data.taskId) {
      this.loadTaskDetails(this.data.taskId);
    } else {
      console.log('No taskId provided');
    }
  }

  loadTaskDetails(taskId: string): void {
    console.log('fetching details for taskID', taskId)
    this.apiService.getTask(taskId).subscribe(
      (response: { task: Task }) => {
        this.task = response.task;
        console.log('Task details loaded:', this.task); // Check what’s being loaded
      },
      (error) => {
        console.error('Error fetching task details:', error);
      }
    );
  }

  onCompletionStatusChange(taskId: string | undefined): void {
    if (taskId && this.task) {
      const updatedStatus = !this.task.completionStatus;
      this.apiService.updateTask(taskId, { completionStatus: updatedStatus })
        .subscribe(
          response => {
            console.log('Task completion status updated:', response);
            if (this.task) {
              this.task.completionStatus = updatedStatus; 
            } else {
              console.log("task was null")
            }         
          },
          error => {
            console.error('Error updating task completion status:', error);
          }
        );
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
