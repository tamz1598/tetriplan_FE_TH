import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service'
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  private labelsSubject = new BehaviorSubject<string[]>([]);
  categories$ = this.categoriesSubject.asObservable();
  labels$ = this.labelsSubject.asObservable();

  constructor(private apiService: ApiService) {}

   // New method to get username from userID
   getUsernameFromUserID(userID: string): Observable<string> {
    return this.apiService.getUserById(userID).pipe(
      map(user => user.username)
    );
  }

  getUserTasks(username: string): Observable<Task[]> {
    console.log('loading tasks');

    return this.apiService.getUserTasks(username).pipe(
      map((response: {tasks: Task[]}) => {
        console.log('Raw tasks from API:', response);
        const mappedTasks = response.tasks.map((task: Task) => ({
          ...task,
          date: task.calendar,
        }));

        const categories: string[] = [...new Set(mappedTasks.map((task) => task.category))];
        this.categoriesSubject.next(categories);

        const labels: string[] = [...new Set(mappedTasks.map((task) => task.label))];
        this.labelsSubject.next(labels);

        return mappedTasks;
      })
    );
  }

  getCalendarEvents(username: string): Observable<any[]> {
    return this.getUserTasks(username).pipe(
      map((tasks) => {
        const events = tasks.map((task) => ({
          id: task._id,
          title: task.taskName,
          date: task.calendar,
          start: `${task.calendar}T${task.startTime}`,
          end: `${task.calendar}T${task.endTime}`,
          description: task.description,
          category: task.category,
          duration: task.duration,
          completionStatus: task.completionStatus,
          label: task.label,
          priority: task.priority,
        }));
        console.log('FullCalendar events:', events);
        return events;
      })
    );
  }

  updateTask(task: Task): Observable<any> {
    const { _id, userID, calendar, ...rest } = task;

    // Ensure _id is not undefined before proceeding
  if (!_id) {
    console.error('Task ID (_id) is undefined. Cannot update task.');
    throw new Error('Task ID (_id) is undefined. Cannot update task.');
  }
    const taskUpdateData = {
      ...rest,
      calendar: calendar,
    };

    console.log('Updating task:', taskUpdateData);

    return this.apiService.updateTask(_id, taskUpdateData);
  }

  deleteTask(taskID: string): Observable<any> {
    console.log('Deleting task:', taskID);
    return this.apiService.deleteTask(taskID);
  }

  addTask(username: string, task: Task): Observable<any> {
    return this.apiService.addUserTask(username, task);
  }
}