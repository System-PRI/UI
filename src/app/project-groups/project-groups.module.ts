import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectGroupsRoutingModule } from './project-groups-routing.module';
import { ProjectGroupsListComponent } from './components/project-groups-list/project-groups-list.component';
import { ProjectGroupFormComponent } from './components/project-group-form/project-group-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectGroupDetailsComponent } from './components/project-group-details/project-group-details.component';
import { MatSortModule } from '@angular/material/sort';

import { StoreModule } from '@ngrx/store';
import { projectGroupsReducer } from './state/project-groups.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProjectGroupsEffects } from './state/project-groups.effects';



@NgModule({
  declarations: [
    DashboardComponent,
    ProjectGroupsListComponent,
    ProjectGroupFormComponent,
    ProjectGroupDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProjectGroupsRoutingModule,
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
    StoreModule.forFeature('project-groups', projectGroupsReducer),
    EffectsModule.forFeature([ProjectGroupsEffects])
  ]
})
export class ProjectGroupsModule { }
