import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { AIRecommendTasksComponent } from './airecommend-tasks/airecommend-tasks.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  loggedInUserName: string | null = null;
  userLoaded: boolean = false;
  welcomeMessage: string | null = null;
  taskMessage: string | null = null;
  recommendedTasks: any[] = []; // To store recommended tasks
  tasks: any[] = [];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    console.log('Current user email:', currentUserEmail);
    
    if (currentUserEmail) {
      this.apiService.getUserByEmail(currentUserEmail).subscribe(
        response => {
          console.log('Response from API:', response);

          if (response && response.users) {
            const user = response.users.find((u: any) => u.email === currentUserEmail);

            if (user) {
              this.loggedInUserName = `${user.username}`;
              this.welcomeMessage = `Hello ${this.loggedInUserName}`
              this.taskMessage = `task for ${this.loggedInUserName}`
              console.log('User found:', user);
              console.log('User full name:', user.fullName);
              this.userLoaded = true; 
            } else {
              console.error('User not found in backend for email:', currentUserEmail);
              this.userLoaded = true;
            }
          } else {
            console.error('Unexpected response format:', response);
            this.userLoaded = true;
          }
        },
        error => {
          console.error('Error fetching user details from backend:', error);
          this.userLoaded = true;
        }
      );
    }
  }

   // Method to fetch recommended tasks
   fetchRecommendedTasks(): void {
    if (this.loggedInUserName) {
      this.apiService.getRecommendedTasks(this.loggedInUserName).subscribe(
        response => {
          const tasks = response.recommendedTasks || []; 
          console.log("this is the tasks for AI", response.recommendedTasks)
            // Open the modal with the recommended tasks
          const dialogRef = this.dialog.open(AIRecommendTasksComponent, {
            width: '600px',
            data: { tasks, loggedInUserName: this.loggedInUserName  } // Pass the tasks to the modal
          });
          dialogRef.afterClosed().subscribe(selectedTask => {
            if (selectedTask) {
              // Open task details for the selected task
              this.viewTaskDetails(selectedTask);
            }
          });
        },
        error => {
          console.error('Error fetching recommended tasks:', error);
        }
      );
    }
  }

  fetchTasks(): void {
    if (this.loggedInUserName) {
      this.apiService.getUserTasks(this.loggedInUserName).subscribe(
        response => {
          this.tasks = response.tasks || [];
          console.log('Tasks fetched:', this.tasks);
        },
        error => {
          console.error('Error fetching tasks:', error);
        }
      );
    }
  }

  // Method to view task details
  viewTaskDetails(task: any): void {
    const taskId = task._id;
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '600px', 
      height: 'auto',
      data: {  }, 
      
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any result if needed, nothing right now
    });
  }

  openAddTaskModal(): void {
    if (!this.loggedInUserName) {
      console.error('No username available to pass to the modal');
      return;
    }

    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '600px',
      data: {username: this.loggedInUserName}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle the result here if needed
    });
  }


}