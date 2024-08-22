import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


interface Board {
  name: string;
  charts: any[]; // This can be any type of chart or widget
}

interface Workspace {
  name: string;
  boards: Board[];
}


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private workspaces = new BehaviorSubject<Workspace[]>([]);
  private currentWorkspace = new BehaviorSubject<Workspace | null>(null);

  constructor() { 
    // Optionally, initialize with some data
    const initialWorkspaces: Workspace[] = [
      { name: 'Workspace 1', boards: [{ name: 'Board 1', charts: [] }] }
    ];
    this.workspaces.next(initialWorkspaces);
    this.currentWorkspace.next(initialWorkspaces[0]);
  }

  addWorkspace(name: string): void {
    const newWorkspace: Workspace = { name, boards: [] };
    const updatedWorkspaces = [...this.workspaces.getValue(), newWorkspace];
    this.workspaces.next(updatedWorkspaces);
  }

  getWorkspaces(): Observable<Workspace[]> {
    return this.workspaces.asObservable();
  }

  setCurrentWorkspace(workspace: Workspace): void {
    this.currentWorkspace.next(workspace);
  }

  getCurrentWorkspace(): Observable<Workspace | null> {
    return this.currentWorkspace.asObservable();
  }

  addBoardToCurrentWorkspace(boardName: string): void {
    const workspace = this.currentWorkspace.getValue();
    if (workspace) {
      workspace.boards.push({ name: boardName, charts: [] });
      this.updateWorkspace(workspace);
    }
  }

  updateWorkspace(updatedWorkspace: Workspace): void {
    const workspaces = this.workspaces.getValue().map(ws => 
      ws.name === updatedWorkspace.name ? updatedWorkspace : ws
    );
    this.workspaces.next(workspaces);
  }
  
}