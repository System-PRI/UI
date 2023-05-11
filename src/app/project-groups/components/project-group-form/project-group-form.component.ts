import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'project-group-form',
  templateUrl: './project-group-form.component.html',
  styleUrls: ['./project-group-form.component.scss']
})
export class ProjectGroupFormComponent {
  constructor(private fb: FormBuilder){}

  projectGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    members: this.fb.array([]),
    technologies: this.fb.array([]),
    instructor: ['', Validators.required]
  });
}
