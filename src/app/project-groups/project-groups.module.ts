import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectGroupsRoutingModule } from './project-groups-routing.module';
import { ProjectGroupsListComponent } from './project-groups-list/project-groups-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
  declarations: [
    DashboardComponent,
    ProjectGroupsListComponent
  ],
  imports: [
    CommonModule,
    ProjectGroupsRoutingModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class ProjectGroupsModule { }
