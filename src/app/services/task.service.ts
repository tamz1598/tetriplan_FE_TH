import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service'

export interface Task {
  _id: string;
  userID: string;
  taskName: string;
  description: string;
  category: string;
  calendar?: string;
  date?: string;
  startTime: string;
  endTime: string;
  duration: number;
  completionStatus: boolean;
  label: string;
  priority: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  private labelsSubject = new BehaviorSubject<string[]>([]);
  categories$ = this.categoriesSubject.asObservable();
  labels$ = this.labelsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getTasks(uid: string): Observable<Task[]> {
    console.log('loading tasks');

    return this.apiService.getUserTasks(uid).pipe(
      map((tasks: any[]) => {
        const mappedTasks = tasks.map((task) => ({
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

  getCalendarEvents(uid: string): Observable<any[]> {
    return this.getTasks(uid).pipe(
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
    const { _id, userID, date, ...rest } = task;
    const taskUpdateData = {
      ...rest,
      calendar: date,
    };

    console.log('Updating task:', taskUpdateData);

    return this.apiService.updateTask(_id, taskUpdateData);
  }

  deleteTask(taskID: string): Observable<any> {
    console.log('Deleting task:', taskID);
    return this.apiService.deleteTask(taskID);
  }
}