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

  onClose(): void {
    this.dialogRef.close();
  }
}
