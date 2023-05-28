import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectDetails } from '../../models/project';
import { ProjectService } from '../../project.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss'],
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  projectDetails!: ProjectDetails;

  constructor(public dialog: MatDialog, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjectDetails('1').pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(projectDetails => this.projectDetails = projectDetails)
  }

  openProjectFormModal(type: string): void {
    let dialogRef;
    if(type === 'edit'){
      dialogRef = this.dialog.open(ProjectFormComponent, {
        data: this.projectDetails
      });
    } else if (type === 'create') {
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
