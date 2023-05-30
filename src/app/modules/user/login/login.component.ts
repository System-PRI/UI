import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State, UserState } from '../state/user.state';
import { getUser } from '../state/user.selectors';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { authenticate, loadUser } from '../state/user.actions';

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

  hide: boolean = true;

  constructor(private fb: FormBuilder, private store: Store<State>, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.store.select(getUser).subscribe((user: UserState) => {
      if (user?.logged) {
        this.router.navigateByUrl('/projects');
      } else {
        if (this.cookieService.get('token')) {
          console.log('elo')
          this.store.dispatch(loadUser())
        }
      }
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
