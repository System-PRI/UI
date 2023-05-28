import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { loadUser, loadUserFailure, loadUserSuccess } from './user.actions';
import { UserService } from './user.service';

@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService
    ) { }

    loadUserInfo$ = createEffect(() => this.actions$
        .pipe(
            ofType(loadUser),
            mergeMap(() => this.userService.loadUser()
                .pipe(
                    map(user => loadUserSuccess({ user })),
                    catchError(error => of(loadUserFailure({ error })))
                )
            )
        )
    );
}