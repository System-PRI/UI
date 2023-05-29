import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectDetails } from '../../models/project';
import { ProjectService } from '../../project.service';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { State } from 'src/app/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss'],
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  projectDetails!: ProjectDetails;
  isProjectAdmin!: boolean;
  projectButtonText: string = '';
  
  constructor(public dialog: MatDialog, private projectService: ProjectService, private store: Store<State>) {}

  ngOnInit(): void {
    this.store.select('user').pipe(
      takeUntil(this.unsubscribe$),
      switchMap(user => {
        this.isProjectAdmin = user.role === 'PROJECT_ADMIN';
        let isStudent = user.role === 'STUDENT';

        if(this.isProjectAdmin){
          this.projectButtonText = 'Edit project';
          let projectId = user.acceptedProjects[0];
          return this.projectService.getProjectDetails(projectId);
        } else if(isStudent) {
          this.projectButtonText = 'Add project';
        }
        return EMPTY
      })
    ).subscribe(projectDetails => {
      this.projectDetails = projectDetails
    })
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

    dialogRef?.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
