import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State, UserState } from '../state/user.state';
import { getUser, isLogged } from '../state/user.selectors';
import { Router } from '@angular/router';
import { accessTokenRefresh, accessTokenRefreshFailure, accessTokenRefreshSuccess, authenticate, loadUser } from '../state/user.actions';
import { UserService } from '../user.service';
import { Actions, ofType } from '@ngrx/effects';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });

  showForm: boolean = false;

  hide: boolean = true;

  constructor(private fb: FormBuilder, private store: Store<State>, private router: Router, private userService: UserService, private actions$: Actions) { }

  ngOnInit(): void {
    this.store.select(isLogged).pipe().subscribe((isLogged: boolean) => {
      if (isLogged) {
        this.router.navigateByUrl('/projects');
      } else {
        this.store.dispatch(accessTokenRefresh())
      }
    });

    this.actions$.pipe(
      ofType(accessTokenRefreshSuccess),
    ).subscribe(() => {
      this.store.dispatch(loadUser())
    });

    this.actions$.pipe(
      ofType(accessTokenRefreshFailure),
    ).subscribe(() => {
      this.showForm = true;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.store.dispatch(authenticate({ login: this.form.controls.login.value!, password: this.form.controls.password.value! }))
    }
  }

  getErrorMessage(): string {
    return 'You must enter a value';
  }
}
