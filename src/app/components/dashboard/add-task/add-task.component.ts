import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  task: Task = {
    taskName: '',
    description: '',
    category: '',
    startTime: '',
    endTime: '',
    duration: 0,
    label: '',
    priority: '',
    calendar:'',
    completionStatus: false,
    __v: 0,
  };

  constructor(
    private taskService: TaskService,
    private dialogRef: MatDialogRef<AddTaskComponent>, @Inject(MAT_DIALOG_DATA) public data: { username: string } 
  ) {
    console.log("this is data", this.data)
    console.log("this is username", this.data.username)
  }
  
  onSubmit() {
    if (!this.data.username) {
      console.error('No username available');
      return;
    }

    this.taskService.addTask(this.data.username, this.task).subscribe(
      (response) => {
        console.log('Task added successfully:', response);
        this.dialogRef.close();
      },
      error => {
        console.error('Error adding task:', error);
      }
    );
  }
  onCancel(): void {
    this.dialogRef.close(); // Close the modal without returning data
  }

}
