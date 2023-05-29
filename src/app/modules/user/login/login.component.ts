import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../state/user.state';
import { loadUser } from '../state/user.actions';
import { getUser } from '../state/user.selectors';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  form = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });

  hide: boolean = true;

  constructor(private fb: FormBuilder, private store: Store<State>, private router: Router){}

  ngOnInit(): void {
    this.store.select(getUser).subscribe(user => {
      if(user.logged){
        this.router.navigateByUrl('/home');
      }
    });
  }

  onSubmit(): void {
    if(this.form.valid){
      this.store.dispatch(loadUser())
    }
  }

  getErrorMessage(): string {
    return 'You must enter a value';
  }
}
