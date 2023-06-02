import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SupervisorAvailability } from '../../models/supervisor-availability.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supervisor } from 'src/app/modules/user/models/supervisor.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { updateSupervisorAvailability } from '../../state/project.actions';

@Component({
  selector: 'app-supervisor-availability-form',
  templateUrl: './supervisor-availability-form.component.html',
  styleUrls: ['./supervisor-availability-form.component.scss']
})
export class SupervisorAvailabilityFormComponent implements OnInit{

  form = this.fb.group({
    availability: this.fb.array([]),
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data?: SupervisorAvailability[],
  ) { }

  ngOnInit(): void {
   this.data?.forEach(availability => {
    this.availability.push(this.fb.group({
      supervisor: [availability.supervisor],
      assigned: [availability.assigned],
      max: [availability.max, [Validators.required]]
    }))
   }) 
  }

  getErrorMessage(): string {
      return 'You must enter a value';
  }

  getFormControl(availability: AbstractControl): { supervisor: Supervisor, max: FormControl } {
    return {
      supervisor: availability.get('supervisor')?.value,
      max: availability.get('max') as FormControl
    }
  }

  onSubmit(): void {
    if(this.form.valid){
      let updatedSupervisorAvailability: SupervisorAvailability[] = [] 
      this.availability.controls.forEach((control: any) => {
        updatedSupervisorAvailability.push({
          supervisor: control.controls.supervisor.value,
          assigned: control.controls.assigned.value,
          max: control.controls.max.value
        })
      })

      this.store.dispatch(updateSupervisorAvailability({supervisorAvailability: updatedSupervisorAvailability}))
    }
  }

  get availability(): FormArray {
    return this.form.get('availability') as FormArray
  }

}
