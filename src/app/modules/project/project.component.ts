import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { Project, ProjectDetails } from './models/project';
import { ProjectService } from './project.service';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { State } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { loadProjects } from './state/project.actions';
import { getFilteredProjects } from './state/project.selectors';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { MatTableDataSource } from '@angular/material/table';
import { SupervisorAvailability } from './models/supervisor-availability.model';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  displayedProjectListColumns: string[] = ['name', 'supervisorName', 'accepted'];
  allProjectListColumns: string[] = ['name', 'supervisorName', 'accepted'];

  supervisorListColumns: string[] = ['name', 'availability'];
  supervisorAvailabilities!: MatTableDataSource<SupervisorAvailability>;

  projects!: MatTableDataSource<Project>;
  projectDetails!: ProjectDetails;
  projectButtonText: string = '';
  isProjectAdmin!: boolean;

  unsubscribe$ = new Subject();

  constructor(
      public dialog: MatDialog, 
      private projectService: ProjectService, 
      private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.checkUserRoleAndAssociatedProject();
    this.observeProjectsStateToUpdateView();
    this.getSupervisorAvailabilities();
    this.store.dispatch(loadProjects());
  }

  checkUserRoleAndAssociatedProject(): void{
    this.store.select('user').pipe(
      takeUntil(this.unsubscribe$),
      switchMap(user => {
        switch(user.role){
          case 'PROJECT_ADMIN':
            this.isProjectAdmin = true;
            this.projectButtonText = 'Edit project';
            let projectId = user.acceptedProjects[0];
            return this.projectService.getProjectDetails(projectId);
          case 'STUDENT': 
            this.projectButtonText = 'Add project';
            break;
        }
        return EMPTY
      })
    ).subscribe(projectDetails => {
      this.projectDetails = projectDetails
    })
  }

  observeProjectsStateToUpdateView(){
    this.store.select(getFilteredProjects).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(projects => {
      let mappedProjects = projects.map((project) => {
        return {
            ...project,
            supervisorName: project.supervisor.name, 
        }
      })
      this.projects = new MatTableDataSource<Project>(mappedProjects)
    })
  }

  getSupervisorAvailabilities(){
    this.projectService.supervisorsAvailabilities$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((supervisorsAvailabilities) => 
      this.supervisorAvailabilities = new MatTableDataSource<SupervisorAvailability>(supervisorsAvailabilities)
    )
  }

  openProjectFormModal(): void {
    let dialogRef;
    if(this.isProjectAdmin){
      dialogRef = this.dialog.open(ProjectFormComponent, {
        data: this.projectDetails
      });
    } else {
      dialogRef = this.dialog.open(ProjectFormComponent);
    }

    dialogRef?.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onOpenProjectDetails(): void {
    const dialogRef = this.dialog.open(ProjectDetailsComponent);

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
