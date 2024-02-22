import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SupervisorAvailability } from '../../models/supervisor-availability.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { Subject, takeUntil } from 'rxjs';
import { getSupervisorAvailability } from '../../state/project.selectors';
import { loadSupervisorAvailability, updateSupervisorAvailability, updateSupervisorAvailabilitySuccess } from '../../state/project.actions';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'supervisor-availability-list',
  templateUrl: './supervisor-availability-list.component.html',
  styleUrls: ['./supervisor-availability-list.component.scss']
})
export class SupervisorAvailabilityListComponent implements OnDestroy, OnInit {
  @Input() editMaxAvailability?: boolean = false;
  columns: string[] = ['name', 'availability'];
  supervisorAvailability!: SupervisorAvailability[];
  form = this.fb.group({
    availability: this.fb.array([]),
  });
  unsubscribe$ = new Subject();
  editFormShown = false;

  constructor(
    private store: Store<State>,
    private fb: FormBuilder,
    private _snackbar: MatSnackBar,
    private actions$: Actions,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadSupervisorAvailability());

    this.store.select(getSupervisorAvailability).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (supervisorAvailability) => {
        this.supervisorAvailability = supervisorAvailability;
        supervisorAvailability.forEach((availability: SupervisorAvailability) => {
          this.availability.push(this.fb.group({
            supervisor: [availability.supervisor],
            assigned: [availability.assigned],
            max: [availability.max, [Validators.required]]
          }))
        })  
      }
    )
  }

  onSubmit(): void {
    if(this.form.valid){
      this.editFormShown = false;

      let updatedSupervisorAvailability: SupervisorAvailability[] = [] 
      this.availability.controls.forEach((control: any) => {
        updatedSupervisorAvailability.push({
          supervisor: control.controls.supervisor.value,
          assigned: control.controls.assigned.value,
          max: control.controls.max.value
        })
      })

      this.store.dispatch(updateSupervisorAvailability({supervisorAvailability: updatedSupervisorAvailability}))
      this.actions$.pipe(ofType(updateSupervisorAvailabilitySuccess),takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this._snackbar.open('Supervisors availability successfully updated', 'close');
        });
    }
  }

  getMaxFormControl(availability: AbstractControl): FormControl {
    return  availability.get('max') as FormControl
  }

  get availability(): FormArray {
    return this.form.get('availability') as FormArray
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
