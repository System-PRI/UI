import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { authenticate, authenticateSuccess, loadUser, loadUserFailure, loadUserSuccess } from './user.actions';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UserEffects {

    constructor(
        private actions$: Actions,
        private userService: UserService,
        private cookieService: CookieService
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

    authenticate$ = createEffect(() => this.actions$
        .pipe(
            ofType(authenticate),
            mergeMap((action) => this.userService.authenticate(action.login, action.password)
                .pipe(
                    map(response => {
                        this.cookieService.set('token', response.token, 1);
                        return authenticateSuccess({ user: response.user, token: response.token })
                    }),
                    catchError(error => of(loadUserFailure({ error })))
                )
            )
        )
    );
}