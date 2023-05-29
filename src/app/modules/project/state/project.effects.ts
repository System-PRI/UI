import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { filterProjects, loadProjects, loadProjectsFailure, loadProjectsSuccess } from './project.actions';
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
            mergeMap(() => this.projectService.loadProjects()
                .pipe(
                    map(projects => loadProjectsSuccess({projects})),
                    catchError(error => of(loadProjectsFailure({ error })))
                )
            )
        )
    );
}