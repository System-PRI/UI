import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from './project.service';
import { EMPTY, Subject, map, takeUntil } from 'rxjs';
import { State } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { Supervisor } from '../user/models/supervisor.model';
import { Student } from '../user/models/student.model';
import { User } from '../user/models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { ExternalLinkService } from './services/external-link.service';
import { ProjectDetails } from './models/project.model';
import { AreYouSureDialogComponent } from '../shared/are-you-sure-dialog/are-you-sure-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  supervisors: Supervisor[] = [];
  students: Student[] = [];
  user!: User;
  projectDetailsForEdit?: ProjectDetails;
  projectButtonText!: string;
  projectId?: string;
  isProjectAdmin?: boolean;
  isCoordinator?: boolean;
  acceptedProjects: string[] = [];
  assignedProjects: string[] = [];
  unsubscribe$ = new Subject();
  externalLinkColumnHeaders: string[] = [];

  constructor(
      public dialog: MatDialog, 
      private projectService: ProjectService, 
      private userService: UserService, 
      private store: Store<State>,
      private _snackbar: MatSnackBar,
      private router: Router,
      private externalLinkService: ExternalLinkService,
  ) {}

  ngOnInit(): void {
    this.checkUserRoleAndAssociatedProject();
    this.userService.students$.pipe(takeUntil(this.unsubscribe$)).subscribe(students => this.students = students)
    this.userService.supervisors$.pipe(takeUntil(this.unsubscribe$)).subscribe(supervisors => this.supervisors = supervisors)

    this.externalLinkService.columnHeaders$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(externalLinkColumnHeaders => this.externalLinkColumnHeaders = externalLinkColumnHeaders)
  }

  checkUserRoleAndAssociatedProject(): void{
    this.store.select('user').pipe(
      takeUntil(this.unsubscribe$),
      map(user => {
        this.user = user;
        this.acceptedProjects = user.acceptedProjects;
        this.assignedProjects = user.projects;
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
            this.projectButtonText = 'Add project';
            break;
        }
        return EMPTY
      })
    ).subscribe()
  }

  openProjectForm(): void {
    if(this.isProjectAdmin){
      this.router.navigate([{outlets: {modal: `projects/form/${this.projectId}`}}]);
    } else {
      this.router.navigate([{outlets: {modal: `projects/form`}}]);
    }
  }

  openAreYouSureDialog(action: string): void {
    const actionMap: {[key: string]: { name: string, action: Function}} = {
      'publish': {
        name: 'publish all projects, evaluation cards will be available for students to view.',
        action: this.publishAllProjects.bind(this),
      },
      'activateSecondSemester': {
        name: 'activate the evaluation card for the second semester, the entire evaluation process will start from the beginning for the second semester.',
        action: this.activateSecondSemester.bind(this),
      }
    }

    const dialogRef = this.dialog.open(AreYouSureDialogComponent, {
      data: { actionName: actionMap[action].name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        actionMap[action].action()
      }
    });
  }

  openSupervisorAvailabilityForm(): void {
    if(this.isCoordinator){
      this.router.navigate([{outlets: {modal: `projects/availability`}}]) 
    }
  }

  publishAllProjects(): void{
    this.projectService.publishAllProjects().pipe(takeUntil(this.unsubscribe$)).subscribe(
      () => window.location.reload(),
      () =>  this._snackbar.open('A problem occured, projects were not published', 'close')
    )
  }

  activateSecondSemester(): void{
    this.projectService.activateSecondSemester().pipe(takeUntil(this.unsubscribe$)).subscribe(
      () => window.location.reload(),
      () =>  this._snackbar.open('A problem occured, second semester was not activated', 'close')
    )
  }

  get showEditOrAddProjectButton(){
    return (this.user.role === 'STUDENT' && this.user.acceptedProjects.length === 0) || (this.user.role === 'PROJECT_ADMIN') || (this.user.role === 'COORDINATOR') 
  }

  get showExternalLinkColumns(){
    return this.user.role === 'COORDINATOR' || this.user.role === 'SUPERVISOR'
  }

  get showPublishAllButton(){
    return this.user.role === 'COORDINATOR'
  }

  get showActivateSecondSemesterButton(){
    return this.user.role === 'COORDINATOR'
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
