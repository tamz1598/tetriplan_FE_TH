import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChartType } from 'chart.js';

// Define DataType type as a placeholder
type DataType = 'longestTask' | 'mostFrequent' | 'leastFrequent';

@Component({
  selector: 'app-widget-modal',
  templateUrl: './widget-modal.component.html',
  styleUrl: './widget-modal.component.css'
})
export class WidgetModalComponent {
  @Input() isVisible: boolean = false;
  @Output() widgetConfirmed = new EventEmitter<{chartType: ChartType, dataType: DataType}>();

  chartTypes: ChartType[] = ['bar', 'pie', 'line'];
  dataTypes: DataType[] = ['longestTask', 'mostFrequent', 'leastFrequent'];

  chartType: ChartType = 'bar';
  dataType: DataType = 'longestTask';

  confirm() {
    this.widgetConfirmed.emit({
      chartType: this.chartType,
      dataType: this.dataType
    });
  }

  closeModal() {
    this.isVisible = false;
  }

  //could be potentially null so checks added
  onChartTypeChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && this.chartTypes.includes(target.value as ChartType)) {
      this.chartType = target.value as ChartType;
    }
  }

  onDataTypeChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && this.dataTypes.includes(target.value as DataType)) {
      this.dataType = target.value as DataType;
    }
  }

  confirmSelection() {
    this.widgetConfirmed.emit({
      chartType: this.chartType,
      dataType: this.dataType
    });
    this.closeModal();
  }
}

