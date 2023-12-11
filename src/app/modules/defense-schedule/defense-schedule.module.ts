import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { DefenseScheduleComponent } from './defense-schedule.component';
import { DefenseDateRangeSelectionComponent } from './components/defense-date-range-selection/defense-date-range-selection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { DefenseScheduleRoutingModule } from './defense-schedule-routing.module';
import { MatInputModule } from '@angular/material/input';
import { DefenseTimeSlotsSelectionComponent } from './components/defense-time-slots-selection/defense-time-slots-selection.component';
import { DefenseCommittySelectionComponent } from './components/defense-committy-selection/defense-committy-selection.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DefenseScheduleComponent,
    DefenseDateRangeSelectionComponent,
    DefenseTimeSlotsSelectionComponent,
    DefenseCommittySelectionComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    DefenseScheduleRoutingModule,
    MatInputModule
  ]
})
export class DefenseScheduleModule { }