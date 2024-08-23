import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Workspace, Board, DataType } from '../models/report.model'; 
import { ChartType } from 'chart.js'; 



@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private workspacesSubject = new BehaviorSubject<Workspace[]>([]);
  private currentWorkspaceSubject = new BehaviorSubject<Workspace | null>(null);

  constructor() { 
    // Optionally, initialize with some data
    const initialWorkspaces: Workspace[] = [
      { name: 'Workspace 1', boards: [{ name: 'Board 1', charts: [], widgets: [] }] }
    ];
    this.workspacesSubject.next(initialWorkspaces);
    this.currentWorkspaceSubject.next(initialWorkspaces[0]);
  }

  addWorkspace(name: string): void {
    const workspaces = this.workspacesSubject.value;
    workspaces.push({ name, boards: [] });
    this.workspacesSubject.next(workspaces);
  }

  getWorkspaces(): Observable<Workspace[]> {
    return this.workspacesSubject.asObservable();
  }

  setCurrentWorkspace(workspace: Workspace): void {
    this.currentWorkspaceSubject.next(workspace);
  }

  getCurrentWorkspace(): Observable<Workspace | null> {
    return this.currentWorkspaceSubject.asObservable();
  }

  addBoardToCurrentWorkspace(boardName: string): void {
    const workspace = this.currentWorkspaceSubject.getValue();
    if (workspace) {
      workspace.boards.push({ name: boardName, charts: [], widgets: [] });
      this.workspacesSubject.next(this.workspacesSubject.value);
      this.currentWorkspaceSubject.next(workspace);
    }
  }

  saveBoardToWorkspace(workspaceName: string, boardName: string, charts: any[], widgets: Array<{ chartType: ChartType, dataType: DataType }>) {
    const workspaces = this.workspacesSubject.value;
    const workspace = workspaces.find(ws => ws.name === workspaceName);
    if (workspace) {
      const board = workspace.boards.find(b => b.name === boardName);
      if (board) {
        board.widgets = widgets;
      } else {
        workspace.boards.push({ name: boardName, charts, widgets });
      }
      this.workspacesSubject.next(workspaces);
    }
  }

  loadBoardFromWorkspace(workspaceName: string, boardName: string): Observable<Array<{ chartType: ChartType, dataType: DataType }>> {
    const workspace = this.workspacesSubject.value.find(ws => ws.name === workspaceName);
    if (workspace) {
      const board = workspace.boards.find(b => b.name === boardName);
      if (board) {
        return of(board.widgets);
      }
    }
    return of([]);
  }

  updateWorkspace(updatedWorkspace: Workspace): void {
    const workspaces = this.workspacesSubject.getValue().map(ws => 
      ws.name === updatedWorkspace.name ? updatedWorkspace : ws
    );
    this.workspacesSubject.next(workspaces);
  }
  
}