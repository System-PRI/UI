import { Component, Input } from '@angular/core';
import { ExternalLink } from '../../../models/external-link.model';

@Component({
  selector: 'project-external-links',
  templateUrl: './project-external-links.component.html',
  styleUrls: ['./project-external-links.component.scss']
})
export class ProjectExternalLinksComponent {
  @Input() externalLinks!: ExternalLink[];
}
