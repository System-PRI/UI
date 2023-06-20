import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { State } from 'src/app/app.state';
import { userRole } from '../user/state/user.selectors';

@Component({
  selector: 'external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.scss']
})
export class ExternalLinkComponent implements OnInit, OnDestroy {
  role!: string;
  unsubscribe$ = new Subject;

  constructor(private store: Store<State>){}

  ngOnInit(): void {
    this.store.select(userRole).pipe(takeUntil(this.unsubscribe$)).subscribe(role => {
      this.role = role;
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null)
    this.unsubscribe$.complete()
  }

  get showForm(): boolean {
    return this.role === 'STUDENT' || this.role === 'PROJECT_ADMIN'
  }

  get isFormDisabled(): boolean {
    return this.role === 'STUDENT'
  }

  get showFilters(): boolean {
    return this.role === 'COORDINATOR'
  }

  get showList(): boolean {
    return this.role === 'SUPERVISOR' || this.role === 'COORDINATOR'
  }
}
