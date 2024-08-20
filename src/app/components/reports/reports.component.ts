import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  workspaces$ = this.reportService.getWorkspaces();
  currentWorkspace$ = this.reportService.getCurrentWorkspace();
  selectedWorkspace: string = '';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.currentWorkspace$.subscribe(workspace => {
      if (workspace) {
        this.selectedWorkspace = workspace.name;
      }
    });
  }

  addWorkspace(): void {
    const workspaceName = prompt('Enter workspace name:');
    if (workspaceName) {
      this.reportService.addWorkspace(workspaceName);
    }
  }

  selectWorkspace(workspaceName: string): void {
    this.reportService.getWorkspaces().subscribe(workspaces => {
      const selected = workspaces.find(ws => ws.name === workspaceName);
      if (selected) {
        this.reportService.setCurrentWorkspace(selected);
      }
    });
  }

  addBoard(): void {
    const boardName = prompt('Enter board name:');
    if (boardName) {
      this.reportService.addBoardToCurrentWorkspace(boardName);
    }
  }
}
