import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot, createUrlTreeFromSnapshot,
} from '@angular/router';
import { UserService } from './modules/user/user.service';


export const authGuard = (next: ActivatedRouteSnapshot) => {
  return inject(UserService).isUserLoggedIn ? true : createUrlTreeFromSnapshot(next, ['/', 'login'])
};