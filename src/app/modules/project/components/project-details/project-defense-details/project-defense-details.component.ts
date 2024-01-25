import { Component, Input } from '@angular/core';
import { ProjectDetails } from '../../../models/project.model';

@Component({
  selector: 'project-defense-details',
  templateUrl: './project-defense-details.component.html',
  styleUrls: ['./project-defense-details.component.scss']
})
export class ProjectDefenseDetailsComponent {
  @Input() projectDetails!: ProjectDetails;
}
