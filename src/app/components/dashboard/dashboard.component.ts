import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  loggedInUserName: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    console.log(currentUserEmail)
    if (currentUserEmail) {
      this.apiService.getUserByEmail(currentUserEmail).subscribe(
        response => {
          console.log('Response from API:', response);

          if (response && response.users) {
            const user = response.users.find((u: any) => u.email === currentUserEmail);

            if (user) {
              this.loggedInUserName = `Hello ${user.fullName}`;
              console.log(user)
              console.log(user.fullName)
            } else {
              console.error('User not found in backend for email:', currentUserEmail);
            }
          } else {
              console.error('Unexpected response format:', response);
          }
          },
          error => {
          console.error('Error fetching user details from backend:', error);
          }
      );
    }
  }
}

