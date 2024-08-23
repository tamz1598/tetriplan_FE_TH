import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { Chart, ChartType, ChartOptions, registerables, TooltipItem } from 'chart.js';

Chart.register(...registerables);

// Define the DataType type outside the class
type DataType = 'longestTask' | 'mostFrequent' | 'leastFrequent';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  workspaces$ = this.reportService.getWorkspaces();
  currentWorkspace$ = this.reportService.getCurrentWorkspace();
  selectedWorkspace: string = '';

  isModalVisible: boolean = false;
  widgets: Array<{chartType: ChartType, dataType: DataType}> = [];

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

  // logic for widget
  // Open the modal to add a new widget
  openModal() {
    this.isModalVisible = true;
  }
  
  closeModal() {
    this.isModalVisible = false;
  }

  // Handle the confirmation of widget selection
  onWidgetConfirmed(event: { chartType: ChartType, dataType: DataType }) {
    // Ensure event.chartType is a valid ChartType
    this.widgets.push(event);
    this.isModalVisible = false;
    this.renderWidgets();
  }

  // Method to render all widgets
  renderWidgets() {
    // Clear existing widgets
    const widgetContainer = document.querySelector('.widget-container');
    if (widgetContainer) {
      widgetContainer.innerHTML = '';
    }

    // Render each widget
    this.widgets.forEach(widget => {
      const widgetElement = document.createElement('div');
      widgetElement.className = 'widget-item';

      // Create a canvas element for the chart
      const canvas = document.createElement('canvas');
      canvas.className = 'chart-canvas'; 
      widgetElement.appendChild(canvas);

      // Render the chart
      this.renderChart(canvas, widget.chartType, widget.dataType);

      // Append the widget element to the container
      if (widgetContainer) {
        widgetContainer.appendChild(widgetElement);
      }
    });
  }

  // Method to render a chart based on type and data
  renderChart(canvas:  HTMLCanvasElement, chartType: ChartType, dataType: DataType) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Sample data fetching (replace with actual data fetching logic)
    const data = this.fetchChartData(dataType);

    // Use Chart.js or any other library to render the chart
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: data.labels,
        datasets: [{
          label: data.label,
          data: data.values,
          backgroundColor: chartType === 'pie' ? this.generateColors(data.values.length) : 'rgba(75, 192, 192, 0.2)',
          borderColor: chartType === 'pie' ? 'rgba(75, 192, 192, 1)' : 'rgba(75, 192, 192, 1)',
          borderWidth: chartType === 'pie' ? 1 : 1
        }]
      },
      options: this.getChartOptions()
    });
  }

  // Sample method to fetch chart data based on data type
  fetchChartData(dataType: DataType) {
    // Replace this with actual logic to fetch and prepare data
    const dataMap = {
      longestTask: {
        labels: ['Task 1', 'Task 2', 'Task 3'],
        label: 'Task Duration',
        values: [120, 90, 60]
      },
      mostFrequent: {
        labels: ['Category 1', 'Category 2', 'Category 3'],
        label: 'Task Frequency',
        values: [15, 25, 5]
      },
      leastFrequent: {
        labels: ['Category 1', 'Category 2', 'Category 3'],
        label: 'Task Frequency',
        values: [5, 10, 25]
      }
    };
    return dataMap[dataType] || { labels: [], label: '', values: [] };
  }

  // Generate colors for pie chart segments
  generateColors(count: number) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`);
    }
    return colors;
  }

  getChartOptions(): ChartOptions {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem: TooltipItem<'bar' | 'pie'>) {
              // Get the label and value from the tooltip item
              const label = tooltipItem.label || '';
              const value = tooltipItem.raw;
              return `${label}: ${value}`;
            }
          }
        }
      }
    };
  }
}