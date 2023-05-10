import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectGroupsRoutingModule } from './project-groups-routing.module';
import { ProjectGroupsListComponent } from './components/project-groups-list/project-groups-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    DashboardComponent,
    ProjectGroupsListComponent
  ],
  imports: [
    CommonModule,
    ProjectGroupsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule
  ]
})
export class ProjectGroupsModule { }
