import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';


import { CommonModule } from '@angular/common';
import { ExampleHeader } from '../example-header/example-header.component';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, ExampleHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {}