import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent {

  constructor(public dialog: MatDialog) { }

  openProjectFormModal(): void {
    const dialogRef = this.dialog.open(ProjectFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
