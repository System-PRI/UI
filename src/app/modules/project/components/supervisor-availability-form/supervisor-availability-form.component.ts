import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../project.service';
import { SupervisorAvailability } from '../../models/supervisor-availability.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supervisor } from 'src/app/modules/user/models/supervisor.model';

@Component({
  selector: 'app-supervisor-availability-form',
  templateUrl: './supervisor-availability-form.component.html',
  styleUrls: ['./supervisor-availability-form.component.scss']
})
export class SupervisorAvailabilityFormComponent implements OnInit{

  form = this.fb.group({
    availabilities: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data?: SupervisorAvailability[]
  ) { }

  ngOnInit(): void {
    console.log(this.data)
   this.data?.forEach(availability => {
    this.availabilities.push(this.fb.group({
      supervisor: [availability.supervisor],
      assigned: [availability.assigned],
      max: [availability.max, [Validators.required]]
    }))
   }) 
  }

  getErrorMessage(): string {
      return 'You must enter a value';
  }

  getAvailabilityData(availability: AbstractControl): { supervisor: Supervisor, max: FormControl } {
    return {
      supervisor: availability.get('supervisor')?.value,
      max: availability.get('max') as FormControl
    }
  }

  onSubmit(): void {
    
  }

  get availabilities(): FormArray {
    return this.form.get('availabilities') as FormArray
  }

}
