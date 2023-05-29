import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SupervisorAvailability } from '../../models/supervisor-availability.model';

@Component({
  selector: 'project-supervisors',
  templateUrl: './project-supervisors.component.html',
  styleUrls: ['./project-supervisors.component.scss']
})
export class ProjectSupervisorsComponent{
  @Input() columns!: string[]
  @Input() supervisorAvailabilities!: MatTableDataSource<SupervisorAvailability>
}
