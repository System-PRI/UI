import { Component, Input } from '@angular/core';
import { ProjectDetails } from '../../../models/project.model';

@Component({
  selector: 'project-title-desc-tech-details',
  templateUrl: './project-title-desc-tech-details.component.html',
  styleUrls: ['./project-title-desc-tech-details.component.scss']
})
export class ProjectTitleDescTechDetailsComponent {
  @Input() projectDetails!: ProjectDetails;
}
