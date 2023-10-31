import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeComponent } from './grade.component';
import { GradeRoutingModule } from './grade-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { gradeReducer } from './state/grade.reducer';
import { GradeEffects } from './state/grade.effects';
import { EffectsModule } from '@ngrx/effects';
import { GradeListComponent } from './components/grade-list/grade-list.component';
import { GradeFiltersComponent } from './components/grade-filters/grade-filters.component';
import { GradeDetailsComponent } from './components/grade-details/grade-details.component';

@NgModule({
  declarations: [
    GradeComponent,
    GradeListComponent,
    GradeFiltersComponent,
    GradeDetailsComponent
  ],
  imports: [
    CommonModule,
    GradeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSortModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    StoreModule.forFeature('grade', gradeReducer),
    EffectsModule.forFeature([GradeEffects]),
  ]
})
export class GradeModule { }
