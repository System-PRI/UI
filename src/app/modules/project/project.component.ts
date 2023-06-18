import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { Project, ProjectDetails, ProjectFormData } from './models/project';
import { ProjectService } from './project.service';
import { EMPTY, Subject, map, switchMap, takeUntil } from 'rxjs';
import { State } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { acceptProject, addProject, addProjectSuccess, loadProjects, loadSupervisorAvailability, updateProject, updateProjectSuccess } from './state/project.actions';
import { getFilteredProjects, getSupervisorAvailability } from './state/project.selectors';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { MatTableDataSource } from '@angular/material/table';
import { SupervisorAvailability } from './models/supervisor-availability.model';
import { SupervisorAvailabilityFormComponent } from './components/supervisor-availability-form/supervisor-availability-form.component';
import { Supervisor } from '../user/models/supervisor.model';
import { Student } from '../user/models/student.model';
import { User } from '../user/models/user.model';
import { Actions, ofType } from '@ngrx/effects';
import { changeStudentRoleToProjectAdmin } from '../user/state/user.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  projectListColumns: string[] = ['name', 'supervisorName', 'accepted'];
  supervisors: Supervisor[] = [];
  students: Student[] = [];
  user!: User;
  supervisorListColumns: string[] = ['name', 'availability'];
  supervisorAvailability!: SupervisorAvailability[];
  supervisorAvailabilityDataSource!: MatTableDataSource<SupervisorAvailability>;
  projects!: MatTableDataSource<Project>;
  projectDetailsForEdit?: ProjectDetails;
  projectButtonText!: string;
  projectId?: string;
  isProjectAdmin?: boolean;
  isCoordinator?: boolean;
  unsubscribe$ = new Subject();

  constructor(
      public dialog: MatDialog, 
      private projectService: ProjectService, 
      private store: Store<State>,
      private actions$: Actions,
      private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkUserRoleAndAssociatedProject();
    this.observeProjectsState();
    this.observeSupervisorAvailabilityState();
    this.store.dispatch(loadProjects());
    this.store.dispatch(loadSupervisorAvailability());
    this.projectService.students$.pipe(takeUntil(this.unsubscribe$)).subscribe(students => this.students = students)
    this.projectService.supervisors$.pipe(takeUntil(this.unsubscribe$)).subscribe(supervisors => this.supervisors = supervisors)
  }

  checkUserRoleAndAssociatedProject(): void{
    this.store.select('user').pipe(
      takeUntil(this.unsubscribe$),
      map(user => {
        this.user = user;
        switch(user.role){
          case 'PROJECT_ADMIN':
            this.isProjectAdmin = true;
            this.projectButtonText = 'Edit project';
            this.projectId = user.acceptedProjects[0];
            break;
          case 'STUDENT': 
            this.projectButtonText = 'Add project';
            break;
          case 'COORDINATOR': 
            this.isCoordinator = true;
            break;
        }
        return EMPTY
      })
    ).subscribe()
  }

  observeProjectsState(){
    this.store.select(getFilteredProjects).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (projects) => {
      let mappedProjects = projects.map((project) => {
        return {
            ...project,
            supervisorName: project.supervisor.name, 
        }
      })
      this.projects = new MatTableDataSource<Project>(mappedProjects)
    })
  }

  observeSupervisorAvailabilityState(){
    this.store.select(getSupervisorAvailability).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (supervisorAvailability) => {
        this.supervisorAvailability = supervisorAvailability;
        this.supervisorAvailabilityDataSource = new MatTableDataSource<SupervisorAvailability>(supervisorAvailability);
      }
    )
  }

  onUpdateDisplayedColumns(columns: string[]){
    this.projectListColumns = columns;
  }

  openProjectForm(): void {
    let data: ProjectFormData = {
      supervisors: this.supervisors,
      students: this.students,
      user: this.user
    }
    let dialogRef;
    if(this.isProjectAdmin){
      this.projectService.getProjectDetails(this.projectId!).pipe(takeUntil(this.unsubscribe$)).subscribe(
        (projectDetails) => {
          data.projectDetails = projectDetails;
          dialogRef = this.dialog.open(ProjectFormComponent, {
            data
          });      
        }
      )
    } else {
      dialogRef = this.dialog.open(ProjectFormComponent, {
        data
      });  
    }
   
    dialogRef?.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(projectDetails => {
      if(projectDetails){
        if(this.isProjectAdmin){
          this.store.dispatch(updateProject({project: projectDetails}))
          this.actions$.pipe(ofType(updateProjectSuccess),takeUntil(this.unsubscribe$)).subscribe(() => {
            this._snackbar.open('Project successfully updated', 'close');
          });
        } else {
          this.store.dispatch(addProject({project: projectDetails}))
          this.actions$.pipe(ofType(addProjectSuccess),takeUntil(this.unsubscribe$)).subscribe((project) => {
            this._snackbar.open('Project successfully created', 'close');
            this.store.dispatch(changeStudentRoleToProjectAdmin({projectId: project.project.id!}))
          });
        }
      }
    });
  }

  openSupervisorAvailabilityForm(): void {
    if(this.isCoordinator){
      let dialogRef;
      dialogRef = this.dialog.open(SupervisorAvailabilityFormComponent, {
        data: this.supervisorAvailability
      });
      
      dialogRef?.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  getProjectDetailsAndOpenModal(id: string){
    this.projectService.getProjectDetails(id).pipe(takeUntil(this.unsubscribe$)).subscribe(
      projectDetails => {
        this.showProjectDetails(projectDetails)
      }
    );
  }

  showProjectDetails(projectDetails: ProjectDetails): void {
    let dialogRef;
    dialogRef = this.dialog.open(ProjectDetailsComponent, {
      data: { projectDetails, user: this.user}
    });
    dialogRef?.afterClosed()!.pipe(takeUntil(this.unsubscribe$)).subscribe((accept) => {
      if(accept){
        this.store.dispatch(acceptProject({projectId: projectDetails.id!, role: this.user.role}))
      }
    });
  }

  showProjectButton(){
    return (this.user.role === 'STUDENT' && this.user.acceptedProjects.length === 0) || (this.user.role === 'PROJECT_ADMIN')
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
