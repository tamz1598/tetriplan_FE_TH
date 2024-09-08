import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { AIRecommendTasksComponent } from './airecommend-tasks/airecommend-tasks.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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

  constructor(private apiService: ApiService, private dialog: MatDialog, private afAuth: AngularFireAuth,
    private router: Router) {}

  ngOnInit() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    console.log('Current user email:', currentUserEmail);

    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('Authenticated user:', user);
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        console.log('Current user email:', currentUserEmail);
        
        if (currentUserEmail) {
          this.apiService.getUserByEmail(currentUserEmail).pipe(
            retry(3), // Retry the request up to 3 times
            catchError(error => {
              console.error('Error fetching user details from backend:', error);
              this.userLoaded = true; // Indicate user load attempt even on failure
              return of(null); // Return an empty observable to handle the error gracefully
            })
          ).subscribe(
            response => {
              console.log('Response from API, the user:', response);

              if (response && response.users) {
                const user = response.users.find((u: any) => u.email === currentUserEmail);
                console.log("user:", user)

                if (user) {
                  this.loggedInUserName = `${user.username}`;
                  this.welcomeMessage = `Hello ${this.loggedInUserName}`
                  this.taskMessage = `Tasks for ${this.loggedInUserName}`
                  console.log('User found:', user);
                  console.log('User full name:', user.fullName);
                  this.userLoaded = true; 
                } else {
                  console.error('User not found in backend for email:', currentUserEmail);
                  this.userLoaded = true;
                  this.router.navigate(['/login']);
                }
              } else {
                console.error('Unexpected response format or empty response:', response);
                this.userLoaded = true;
              }
            });
        } else {
          console.error('No email found for the current user, redirecting to login.');
          this.router.navigate(['/login']);
        }
      } else {
        console.log('No authenticated user found. Redirecting to login page.');
        this.router.navigate(['/login']);
      }
    });
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