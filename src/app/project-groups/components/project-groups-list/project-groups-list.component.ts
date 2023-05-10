import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProjectGroup } from '../../models/project-group';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProjectGroupsService } from './project-groups-list.service';

@Component({
  selector: 'project-groups-list',
  templateUrl: './project-groups-list.component.html',
  styleUrls: ['./project-groups-list.component.scss']
})
export class ProjectGroupsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'instructor', 'acceptanceStatus'];
  dataSource!: MatTableDataSource<ProjectGroup>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private projectGroupsService: ProjectGroupsService){}

  ngOnInit(): void {
    this.projectGroupsService.projectGroups$.subscribe(
      projectGroups => this.dataSource = new MatTableDataSource<ProjectGroup>(projectGroups)
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
