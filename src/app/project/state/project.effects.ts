import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { ProjectListService } from '../components/project-list/project-list.service';
import { loadProjects, loadProjectsFailure, loadProjectsSuccess } from './project.actions';

@Injectable()
export class ProjectEffects {

    constructor(
        private actions$: Actions,
        private projectListService: ProjectListService
    ) { }

    loadProjects$ = createEffect(() => this.actions$
        .pipe(
            ofType(loadProjects),
            mergeMap(() => this.projectListService.loadProjects()
                .pipe(
                    map(projects => loadProjectsSuccess({ projects })),
                    catchError(error => of(loadProjectsFailure({ error })))
                )
            )
        )
    );
}