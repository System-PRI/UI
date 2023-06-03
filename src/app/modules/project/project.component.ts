import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { Project, ProjectDetails, ProjectFormData } from './models/project';
import { ProjectService } from './project.service';
import { EMPTY, Subject, switchMap, take, takeUntil } from 'rxjs';
import { State } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { addProject, addProjectSuccess, loadProjects, loadSupervisorAvailability, updateProject } from './state/project.actions';
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

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  displayedProjectListColumns: string[] = ['name', 'supervisorName', 'accepted'];
  allProjectListColumns: string[] = ['name', 'supervisorName', 'accepted'];
  supervisors: Supervisor[] = [];
  students: Student[] = [];
  user!: User;
  supervisorListColumns: string[] = ['name', 'availability'];
  supervisorAvailability!: SupervisorAvailability[];
  supervisorAvailabilityDataSource!: MatTableDataSource<SupervisorAvailability>;
  projects!: MatTableDataSource<Project>;
  projectDetailsForEdit?: ProjectDetails;
  projectButtonText: string = '';
  isProjectAdmin?: boolean;
  isCoordinator?: boolean;
  unsubscribe$ = new Subject();

  constructor(
      public dialog: MatDialog, 
      private projectService: ProjectService, 
      private store: Store<State>,
      private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.checkUserRoleAndAssociatedProject();
    this.observeProjectsState();
    this.observeSupervisorAvailabilityState();
    this.store.dispatch(loadProjects());
    this.store.dispatch(loadSupervisorAvailability());
    this.projectService.students$.pipe(takeUntil(this.unsubscribe$)).subscribe(students => this.students = students)
    this.projectService.supervisors$.pipe(takeUntil(this.unsubscribe$)).subscribe(supervisors => this.supervisors = supervisors)
    this.actions$.pipe(
      ofType(addProjectSuccess),
      takeUntil(this.unsubscribe$)
    ).subscribe((project) => {
      this.store.dispatch(changeStudentRoleToProjectAdmin({projectId: project.project.id!}))
    });
  }

  checkUserRoleAndAssociatedProject(): void{
    this.store.select('user').pipe(
      takeUntil(this.unsubscribe$),
      switchMap(user => {
        this.user = user;

        console.log(this.user)

        switch(user.role){
          case 'PROJECT_ADMIN':
            this.isProjectAdmin = true;
            this.projectButtonText = 'Edit project';
            let projectId = user.acceptedProjects[0];
            return this.projectService.getProjectDetails(projectId);
          case 'STUDENT': 
            this.projectButtonText = 'Add project';
            break;
          case 'COORDINATOR': 
            this.isCoordinator = true;
            break;
        }
        return EMPTY
      })
    ).subscribe(projectDetails => {
      this.projectDetailsForEdit = projectDetails
    })
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

  openProjectForm(): void {
    let data: ProjectFormData = {
      supervisors: this.supervisors,
      students: this.students,
      user: this.user
    }
    if(this.isProjectAdmin){
     data.projectDetails = this.projectDetailsForEdit
    } 
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      data
    });

    dialogRef?.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe(projectDetails => {
      if(projectDetails){
        if(this.isProjectAdmin){
          this.store.dispatch(updateProject({project: projectDetails}))
        } else {
          this.store.dispatch(addProject({project: projectDetails}))
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
    let columns = ['name', 'email', 'role']
    if(this.isCoordinator || this.isProjectAdmin){
      columns.push('admin')
    }
    dialogRef = this.dialog.open(ProjectDetailsComponent, {
      data: { projectDetails, columns}
    });
    dialogRef?.afterClosed()!.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      // todo
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
