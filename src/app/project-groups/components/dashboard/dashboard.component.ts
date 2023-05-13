import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectGroupFormComponent } from '../project-group-form/project-group-form.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(public dialog: MatDialog){}

  openProjectFormModal(): void {
    const dialogRef = this.dialog.open(ProjectGroupFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    }
}
