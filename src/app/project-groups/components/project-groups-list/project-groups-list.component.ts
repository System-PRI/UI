import {  Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectGroup } from '../../models/project-group';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProjectGroupsListService } from './project-groups-list.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectGroupDetailsComponent } from '../project-group-details/project-group-details.component';
import { Supervisor } from '../../models/supervisor';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'project-groups-list',
  templateUrl: './project-groups-list.component.html',
  styleUrls: ['./project-groups-list.component.scss']
})
export class ProjectGroupsListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'supervisor', 'acceptanceStatus'];
  dataSource = new MatTableDataSource<ProjectGroup>([]);
  searchValue: string = '';
  selectedSupervisor?: string;
  selectedStatus?: boolean;
  projectGroups: ProjectGroup[] = [];
  supervisors$!: Observable<Supervisor[]>
  unsubscribe$ = new Subject()

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectGroupsListService: ProjectGroupsListService,
    public dialog: MatDialog
    ){}

  ngOnInit(): void {
    this.projectGroupsListService.projectGroupsSubject$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (projectGroups) => {
      this.projectGroups = projectGroups;
      this.dataSource.data = projectGroups;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.createSearchFilter();
    })

    this.supervisors$ = this.projectGroupsListService.supervisors$;
  }

  openProjectDetailsModal(): void {
    const dialogRef = this.dialog.open(ProjectGroupDetailsComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  applySearchFilter() {
    this.dataSource.filter = this.searchValue.trim().toLowerCase();
   
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFiltersChange(){
    this.dataSource.data = this.projectGroups.slice().filter(
      projectGroup => 
        (this.selectedSupervisor === undefined || projectGroup.supervisor === this.selectedSupervisor) && 
        (this.selectedStatus === undefined || projectGroup.acceptanceStatus === this.selectedStatus)
    )
  }

  createSearchFilter(): (data: ProjectGroup, filter: string) => boolean {
    return (data, filter): boolean => 
        (data.name?.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
        (data.supervisor?.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
  }

  isAnyFilterActivated(): boolean {
    return this.searchValue !== '' || this.selectedStatus !== undefined || this.selectedSupervisor !== undefined
  }

  resetFilters(){
    this.searchValue = '';
    this.selectedSupervisor = undefined;
    this.selectedStatus = undefined;
    this.onFiltersChange()
    this.applySearchFilter()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
