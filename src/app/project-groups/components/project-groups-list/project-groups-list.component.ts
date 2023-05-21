import {  Component, OnInit, ViewChild } from '@angular/core';
import { ProjectGroup } from '../../models/project-group';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProjectGroupsListService } from './project-groups-list.service';
import { tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProjectGroupDetailsComponent } from '../project-group-details/project-group-details.component';

@Component({
  selector: 'project-groups-list',
  templateUrl: './project-groups-list.component.html',
  styleUrls: ['./project-groups-list.component.scss']
})
export class ProjectGroupsListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'instructor', 'acceptanceStatus'];
  dataSource = new MatTableDataSource<ProjectGroup>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private projectGroupsListService: ProjectGroupsListService,
    public dialog: MatDialog
    ){}

  ngOnInit(): void {
    this.projectGroupsListService.projectGroupsSubject$.pipe(
      tap(projectGroups => this.dataSource = new MatTableDataSource<ProjectGroup>(projectGroups))
    ).subscribe(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  openProjectDetailsModal(): void {
    const dialogRef = this.dialog.open(ProjectGroupDetailsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    }
}
