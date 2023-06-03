import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { uploadStudents, uploadStudentsFailure, uploadStudentsSuccess } from './data-feed.actions';
import { DataFeedService } from '../data-feed.service';

@Injectable()
export class ProjectEffects {

    constructor(
        private actions$: Actions,
        private dataFeedService: DataFeedService
    ) { }

    uploadStudents$ = createEffect(() => this.actions$
        .pipe(
            ofType(uploadStudents),
            mergeMap((action) => this.dataFeedService(action.students)
                .pipe(
                    map(() => uploadStudentsSuccess({project})),
                    catchError(error => of(uploadStudentsFailure({ error })))
                )
            )
    )
)

    

}