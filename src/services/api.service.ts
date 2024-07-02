import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://tetriplan.onrender.com/api';

  constructor(private http: HttpClient) {}

   // Method to send the Google token to your backend
   loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/google-login`, { idToken });
  }

  getEndpoints(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  //had to add this to check for users exisitng by email
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users?email=${email}`);
  }

   addUser(userData: { username: string; email: string; fullName: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/${userData.username}`, userData);
  }

  updateUser(username: string, user: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/users/${username}`, user);
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${username}`);
  }

  getTasks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tasks`);
  }

  getTask(taskID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tasks/${taskID}`);
  }

  updateTask(taskID: string, task: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/tasks/${taskID}`, task);
  }

  deleteTask(taskID: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${taskID}`);
  }

  getUserTasks(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${username}/tasks`);
  }

  getUserTasksByCategory(userID: string, category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userID}/tasks/category`, {
      params: { category }
    });
  }

  getUserTasksSortedByDate(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${username}/tasks`, {
      params: { sort_by: 'date' }
    });
  }

  getUserTasksSortedByPriority(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${username}/tasks`, {
      params: { sort_by: 'priority' }
    });
  }

  getRecommendedTasks(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${username}/recommended-tasks`);
  }
}