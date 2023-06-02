import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { loadProjects, loadProjectsFailure, loadProjectsSuccess, loadSupervisorAvailability, loadSupervisorAvailabilityFailure, loadSupervisorAvailabilitySuccess, updateSupervisorAvailability, updateSupervisorAvailabilityFailure, updateSupervisorAvailabilitySuccess } from './project.actions';
import { ProjectService } from '../project.service';

@Injectable()
export class ProjectEffects {

    constructor(
        private actions$: Actions,
        private projectService: ProjectService
    ) { }

    loadProjects$ = createEffect(() => this.actions$
        .pipe(
            ofType(loadProjects),
            mergeMap(() => this.projectService.projects$
                .pipe(
                    map(projects => loadProjectsSuccess({projects})),
                    catchError(error => of(loadProjectsFailure({ error })))
                )
            )
        )
    );

    loadSupervisorAvailability$ = createEffect(() => this.actions$
        .pipe(
            ofType(loadSupervisorAvailability),
            mergeMap(() => this.projectService.supervisorsAvailability$
                .pipe(
                    map(supervisorAvailability => loadSupervisorAvailabilitySuccess({supervisorAvailability})),
                    catchError(error => of(loadSupervisorAvailabilityFailure({ error })))
                )
            )
        )
    );

    updateSupervisorAvailability$ = createEffect(() => this.actions$
        .pipe(
            ofType(updateSupervisorAvailability),
            mergeMap((action) => this.projectService.updateSupervisorAvailability(action.supervisorAvailability)
                .pipe(
                    map(() => updateSupervisorAvailabilitySuccess({supervisorAvailability: action.supervisorAvailability})),
                    catchError(error => of(updateSupervisorAvailabilityFailure({ error })))
                )
            )
        )
    )  

}