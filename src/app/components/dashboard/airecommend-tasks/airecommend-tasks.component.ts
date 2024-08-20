import { Component, Inject, EventEmitter, Output  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AiAddTaskComponent } from '../ai-add-task/ai-add-task.component';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-airecommend-tasks',
  templateUrl: './airecommend-tasks.component.html',
  styleUrl: './airecommend-tasks.component.css'
})
export class AIRecommendTasksComponent {
  @Output() taskAdded: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AIRecommendTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tasks: any[], loggedInUserName: string },
    private dialog: MatDialog, private apiService: ApiService
  ) { }

   // Method to view task details
   viewTaskDetails(task: any): void {
    const dialogRef = this.dialog.open(AiAddTaskComponent, {
      width: '600px', 
      height: 'auto',
      data: { taskId: task._id, aiRecommended: true, loggedInUserName: this.data.loggedInUserName }, 
      panelClass: 'task-modal',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.added) {
        console.log('Task added:', task);
        this.addTaskToUser(task);  // Add the task to the user after confirmation
      }
    });
  }

  addTaskToUser(task: any): void {
    if (this.data.loggedInUserName) {
      this.apiService.addUserTask(this.data.loggedInUserName, task).subscribe(
        response => {
          console.log('Task successfully added to the user:', response);
          this.taskAdded.emit(response);
          
          this.dialogRef.close();
          alert('Task added successfully!');
        },
        error => {
          console.error('Error adding task to user:', error);
          alert('Failed to add the task. Please try again later.');
        }
      );
    } else {
      console.error('No username found.');
      alert('User not found. Please log in again.');
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }

}
