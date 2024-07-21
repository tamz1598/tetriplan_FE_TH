import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsPopupComponent } from '../task-details-pop-up/task-details-pop-up.component';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Input() loggedInUserName: string | null = null; // Input to receive logged-in username
  tasks: any[] = [];
  currentEditingTaskId: string | null = null;

  constructor(private apiService: ApiService, private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("TaskListComponent initialized with loggedInUserName:", this.loggedInUserName);
    if (this.loggedInUserName) {
      console.log("this is the user before tasks", this.loggedInUserName)
      // Fetch user tasks based on the received username
      this.loadTasks();
    }
  }

  editTask(task: any): void {
    this.currentEditingTaskId = task._id; 
    const dialogRef = this.dialog.open(TaskDetailsPopupComponent, {
      width: '600px', // Adjust width as needed
      height: 'auto', // Adjust height to fit content
      data: task,
      panelClass: 'task-modal', // Add a custom class for styling
      autoFocus: false ,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.currentEditingTaskId = null; // Reset after modal closes
      if (result) {
        // Refresh the task list if needed
        this.loadTasks();
      }
    });
  }


  deleteTask(taskId: string): void {
    console.log('Deleting task with ID:', taskId);
    if (confirm('Are you sure you want to delete this task?')) {
      this.apiService.deleteTask(taskId).subscribe(
        (response) => {
          console.log('Task deleted successfully:', response);
          // Remove the task from this.tasks array
          this.tasks = this.tasks.filter(task => task._id !== taskId);
        },
        (error) => {
          console.error('Error deleting task:', error);
          // Handle error deleting task
        }
      );
    }
  }

  loadTasks(): void {
    if (this.loggedInUserName) {
      this.apiService.getUserTasks(this.loggedInUserName).subscribe(
        (response) => {
          this.tasks = response.tasks;
        },
        (error) => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }
}


