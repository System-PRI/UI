import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subject, combineLatest, take, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { getFilters, getProjects } from '../../state/project.selectors';
import { State } from 'src/app/app.state';
import { Router } from '@angular/router';
import { changeFilters, loadProjects } from '../../state/project.actions';
import { Project } from '../../models/project.model';
import { ExternalLinkService } from '../../services/external-link.service';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnDestroy, OnInit{
  @Input() acceptedProjects!: string[];
  @Input() assignedProjects!: string[];
  @Input() page!: string;
  externalLinkColumnHeaders!: string[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columns = ['name'];
  projects!: MatTableDataSource<Project>;
  unsubscribe$ = new Subject();
  loading = true;

  constructor(
    private store: Store<State>,
    private router: Router,
    private externalLinkService: ExternalLinkService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadProjects());

    this.store.select(getFilters).pipe(takeUntil(this.unsubscribe$)).subscribe(
      filters => this.columns = filters.columns
    )

    this.externalLinkService.columnHeaders$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      externalLinkColumnHeaders => this.externalLinkColumnHeaders = externalLinkColumnHeaders
    )

    this.store.select(getProjects).pipe(
      tap(() => this.loading = true),
      takeUntil(this.unsubscribe$)).subscribe(
        projects => {
          this.projects = new MatTableDataSource<Project>(projects);
          this.projects.paginator = this.paginator;
          this.projects.sort = this.sort;
          this.loading = false;
        }
    )
  }

  isProjectAccepted(id: string){
    return this.acceptedProjects.findIndex(projectId => projectId === id) !== -1
  }

  isProjectAssigned(id: string){
    return this.acceptedProjects.findIndex(projectId => projectId === id) === -1 && 
           this.assignedProjects.findIndex(projectId => projectId === id) !== -1 
  }

  navigateToDetails(projectId: string){
    this.router.navigate([{outlets: {modal: `projects/details/${projectId}`}}]) 
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()

    this.store.dispatch(changeFilters({filters: {
      searchValue: '',
      supervisorIndexNumber: undefined,
      acceptanceStatus: undefined,
      columns: ['name', 'supervisorName', 'accepted'],
      criteriaMetStatus: undefined,
    }}))
  }
}
