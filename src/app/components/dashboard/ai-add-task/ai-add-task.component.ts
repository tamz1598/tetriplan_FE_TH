import { Component, Inject, OnInit  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../models/task.model';
import { ApiService } from '../../../services/api.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-ai-add-task',
  templateUrl: './ai-add-task.component.html',
  styleUrl: './ai-add-task.component.css'
})
export class AiAddTaskComponent {
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
  };;

  constructor(
    public dialogRef: MatDialogRef<AiAddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {  taskId: string, aiRecommended: boolean, loggedInUserName: string },
    private apiService: ApiService, private taskService: TaskService,
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

  addTask(): void {
    if (!this.task) {
      console.error('No task details available.');
      return;
    }
    console.log("this.task", this.task, "username", this.data.loggedInUserName)

    this.apiService.getUserById(this.data.loggedInUserName).subscribe(
      (response) => {
        const userID = response.user._id;
        console.log(userID);
        
        if (userID) {
        // Clean up the task object by removing unnecessary fields
        const taskToSend = {
          taskName: this.task.taskName,
          description: this.task.description,
          category: this.task.category,
          startTime: this.task.startTime,
          endTime: this.task.endTime,
          duration: this.task.duration,
          label: this.task.label,
          priority: this.task.priority,
          calendar: "",
          completionStatus: this.task.completionStatus,
          userID: userID,
          __v: this.task.__v,
        };

        console.log('Task to send:', taskToSend);

          this.apiService.addUserTask(this.data.loggedInUserName, taskToSend).subscribe(
            (response) => {
              console.log('Task successfully added:', response);
              this.dialogRef.close({ added: true });
              // Refresh the page
              window.location.reload();
              alert(`new task added`)
            },
            (error) => {
              console.error('Error adding task:', error.message, error);
            }
          );
        } else {
          console.error('Task or userID is missing.');
        }
      },
      (error) => {
        console.error('Error fetching user ID:', error);
        alert(`Failed to fetch user ID: ${error.message}`);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
