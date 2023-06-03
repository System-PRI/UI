import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { addProject, addProjectSuccess, addProjectFailure, loadProjects, loadProjectsFailure, loadProjectsSuccess, loadSupervisorAvailability, loadSupervisorAvailabilityFailure, loadSupervisorAvailabilitySuccess, updateProject, updateProjectSuccess, updateProjectFailure, updateSupervisorAvailability, updateSupervisorAvailabilityFailure, updateSupervisorAvailabilitySuccess } from './project.actions';
import { ProjectService } from '../project.service';
import { changeStudentRoleToProjectAdmin } from '../../user/state/user.actions';

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

    addProject$ = createEffect(() => this.actions$
        .pipe(
            ofType(addProject),
            mergeMap((action) => this.projectService.addProject(action.project)
                .pipe(
                    map((project) => addProjectSuccess({project})),
                    catchError(error => of(addProjectFailure({ error })))
                )
            )
        )
    )

    updateProject$ = createEffect(() => this.actions$
        .pipe(
            ofType(updateProject),
            mergeMap((action) => this.projectService.updateProject(action.project)
                .pipe(
                    map(() => updateProjectSuccess({project: action.project})),
                    catchError(error => of(updateProjectFailure({ error })))
                )
            )
        )
    )

}