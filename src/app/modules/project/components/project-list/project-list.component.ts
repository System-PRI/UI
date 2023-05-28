import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../models/project';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProjectListService } from './project-list.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { Supervisor } from '../../models/supervisor';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../../state/project.state';
import { getProjects } from '../../state/project.selectors';
import { loadProjects } from '../../state/project.actions';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'supervisor', 'acceptance status'];
  allColumns: string[] = ['name', 'supervisor', 'acceptance status']
  dataSource = new MatTableDataSource<Project>([]);
  searchValue: string = '';
  selectedSupervisor?: string;
  selectedStatus?: boolean;
  projects: Project[] = [];
  supervisors$!: Observable<Supervisor[]>
  unsubscribe$ = new Subject()

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectsListService: ProjectListService,
    public dialog: MatDialog,
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.store.select(getProjects).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (projects) => {
        this.projects = projects;
        this.dataSource.data = projects;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createSearchFilter();
      }
    )

    this.store.dispatch(loadProjects());

    this.supervisors$ = this.projectsListService.supervisors$;
  }

  openProjectDetailsModal(): void {
    const dialogRef = this.dialog.open(ProjectDetailsComponent);

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

  onFiltersChange() {
    this.dataSource.data = this.projects.slice().filter(
      project =>
        (this.selectedSupervisor === undefined || project.supervisor === this.selectedSupervisor) &&
        (this.selectedStatus === undefined || project.acceptanceStatus === this.selectedStatus)
    )
  }

  createSearchFilter(): (data: Project, filter: string) => boolean {
    return (data, filter): boolean =>
      (data.name?.toLowerCase().indexOf(filter.toLowerCase()) !== -1) ||
      (data.supervisor?.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
