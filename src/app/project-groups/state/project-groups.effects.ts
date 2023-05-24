import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { ProjectGroupsListService } from '../components/project-groups-list/project-groups-list.service';
import * as ProjectGroupsActions from './project-groups.actions';

@Injectable()
export class ProjectGroupsEffects {

    constructor(
        private actions$: Actions,
        private projectGroupsListService: ProjectGroupsListService
    ) { }

    loadProjectGroups$ = createEffect(() => this.actions$
        .pipe(
            ofType(ProjectGroupsActions.loadProjectGroups),
            mergeMap(() => this.projectGroupsListService.projectGroups$
                .pipe(
                    map(projectGroups => ProjectGroupsActions.loadProjectGroupsSuccess({ projectGroups })),
                    catchError(error => of(ProjectGroupsActions.loadProjectGroupsFailure({ error })))
                )
            )
        )
    );
}