import { Component } from '@angular/core';

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
    technologies = [
        'JavaScript',
        'Java',
        'Angular',
        'Spring'
    ]
}
