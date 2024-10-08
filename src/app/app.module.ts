import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from './environment/environment'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { FormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DayViewCalendarComponent } from './components/dashboard/day-view-calendar/day-view-calendar.component';
import { TaskDetailsPopupComponent } from './components/dashboard/task-details-pop-up/task-details-pop-up.component';
import { TaskListComponent } from './components/dashboard/task-list/task-list.component';
import { DatePickerComponent } from './components/dashboard/date-picker/date-picker.component';

import { FullCalendarModule } from '@fullcalendar/angular'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskDetailsComponent } from './components/dashboard/task-details/task-details.component';
import { AddTaskComponent } from './components/dashboard/add-task/add-task.component';
import { AIRecommendTasksComponent } from './components/dashboard/airecommend-tasks/airecommend-tasks.component';
import { AiAddTaskComponent } from './components/dashboard/ai-add-task/ai-add-task.component';
import { ReportsComponent } from './components/reports/reports.component';
import { MatRadioModule } from '@angular/material/radio';
import { WidgetModalComponent } from './components/reports/widget-modal/widget-modal.component';
import { ChartTypeSelectionComponent } from './components/reports/chart-type-selection/chart-type-selection.component';
import { DataTypeSelectionComponent } from './components/reports/data-type-selection/data-type-selection.component';
import { MiniComponent } from './components/dashboard/mini/mini.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DayViewCalendarComponent,
    TaskListComponent,
    TaskDetailsComponent,
    AddTaskComponent,
    AIRecommendTasksComponent,
    AiAddTaskComponent,
    ReportsComponent,
    WidgetModalComponent,
    ChartTypeSelectionComponent,
    DataTypeSelectionComponent,
    MiniComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    RouterModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePickerComponent,
    TaskDetailsPopupComponent,
    FullCalendarModule,
    MatRadioModule,
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

