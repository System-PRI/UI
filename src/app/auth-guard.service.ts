import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, Router, createUrlTreeFromSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { State } from './app.state';
import { getUser } from './modules/user/state/user.selectors';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  return inject(Store<State>)
    .select(getUser)
    .pipe(
      map((user) => {
        return user?.logged ? true : createUrlTreeFromSnapshot(next, ['/', 'login'])
    })
    );
};