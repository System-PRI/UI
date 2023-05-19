import { Component } from '@angular/core';

@Component({
  selector: 'project-group-details',
  templateUrl: './project-group-details.component.html',
  styleUrls: ['./project-group-details.component.scss']
})
export class ProjectGroupDetailsComponent {

  technologies = [
    'JavaScript',
    'Java',
    'Angular',
    'Spring'
  ]
}
