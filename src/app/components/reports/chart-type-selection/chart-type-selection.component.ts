import { Component, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-chart-type-selection',
  templateUrl: './chart-type-selection.component.html',
  styleUrl: './chart-type-selection.component.css'
})
export class ChartTypeSelectionComponent {
  selectedChartType: string = 'bar'; // Default value

  @Output() chartTypeChanged = new EventEmitter<string>();

  ngOnChanges() {
    this.chartTypeChanged.emit(this.selectedChartType);
  }
}
