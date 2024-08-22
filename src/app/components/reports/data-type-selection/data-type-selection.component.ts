import { Component, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-data-type-selection',
  templateUrl: './data-type-selection.component.html',
  styleUrl: './data-type-selection.component.css'
})
export class DataTypeSelectionComponent {
  selectedDataType: string = 'longestTask'; // Default value

  @Output() dataTypeChanged = new EventEmitter<string>();

  ngOnChanges() {
    this.dataTypeChanged.emit(this.selectedDataType);
  }
}
