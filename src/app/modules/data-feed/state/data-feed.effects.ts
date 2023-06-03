import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { DataFeedService } from '../data-feed.service';
import { uploadStudents, uploadStudentsFailure, uploadStudentsSuccess } from './data-feed.actions';

@Injectable()
export class ProjectEffects {

    constructor(
        private actions$: Actions,
        private dataFeedService: DataFeedService,
    ) { }

    uploadStudents$ = createEffect(() => this.actions$
        .pipe(
            ofType(uploadStudents),
            mergeMap((action) => this.dataFeedService.uploadStudents(action.studentsFile)
                .pipe(
                    map(() => uploadStudentsSuccess()),
                    catchError(error => of(uploadStudentsFailure({ error })))
                )
            )
        )
    )
}