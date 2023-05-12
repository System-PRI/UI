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
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    DashboardComponent,
    ProjectGroupsListComponent,
    ProjectGroupFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectGroupsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule, 
    MatAutocompleteModule,
    MatSelectModule,
    MatChipsModule
  ]
})
export class ProjectGroupsModule { }
