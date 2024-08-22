import { Injectable } from '@angular/core'; 
import { BehaviorSubject, Observable, of  } from 'rxjs';
import { Workspace } from '../models/workplace.model';

@Injectable({
    providedIn: 'root'
})

export class WorkspaceService {

    private workspaces: Workspace[] = [];
    private workspacesSubject = new BehaviorSubject<Workspace[]>(this.workspaces);
    private currentWorkspaceSubject = new BehaviorSubject<Workspace | null>(null);
    
    workspaces$ = this.workspacesSubject.asObservable();
    currentWorkspace$ = this.currentWorkspaceSubject.asObservable();

constructor() {}


    addWorkspace(workspace: Workspace): Observable<void> {
    this.workspaces.push({ ...workspace, id: this.generateId() });
    this.workspacesSubject.next(this.workspaces);
    return of();
    }

    getWorkspaces(): Observable<Workspace[]> {
        return this.workspaces$;
    }

    selectWorkspace(workspaceName: string): Observable<void> {
        const workspace = this.workspaces.find(ws => ws.name === workspaceName);
        if (workspace) {
        this.currentWorkspaceSubject.next(workspace);
        }
        return of();
    }

    updateWorkspace(workspaceName: string, updateData: Partial<Workspace>): Observable<void> {
        const workspace = this.workspaces.find(ws => ws.name === workspaceName);
        if (workspace) {
        Object.assign(workspace, updateData);
        this.workspacesSubject.next(this.workspaces);
        }
        return of();
    }
    

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}