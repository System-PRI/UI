import {  Component, OnInit, ViewChild } from '@angular/core';
import { ProjectGroup } from '../../models/project-group';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProjectGroupsListService } from './project-groups-list.service';
import { take, tap } from 'rxjs';

@Component({
  selector: 'project-groups-list',
  templateUrl: './project-groups-list.component.html',
  styleUrls: ['./project-groups-list.component.scss']
})
export class ProjectGroupsListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'instructor', 'acceptanceStatus'];
  dataSource = new MatTableDataSource<ProjectGroup>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private projectGroupsListService: ProjectGroupsListService){}

  ngOnInit(): void {
    this.projectGroupsListService.projectGroupsSubject$.pipe(
      tap(projectGroups => this.dataSource = new MatTableDataSource<ProjectGroup>(projectGroups))
    ).subscribe(() => this.dataSource.paginator = this.paginator)
  }
}
