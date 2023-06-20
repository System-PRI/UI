import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store';
import { loadUser } from './modules/user/state/user.actions';
import { State } from './app.state';
import { Subject, map, takeUntil } from 'rxjs';
import { getUser, isLogged, projectAcceptedByStudent } from './modules/user/state/user.selectors';
import { UserState } from './modules/user/state/user.state';
import { UserService } from './modules/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit{
  appName: string = 'PRI';
  mobileQuery?: MediaQueryList;
  user!: UserState;
  unsubscribe$ = new Subject();  
  projectId?: string; 

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private store: Store<State>, private userService: UserService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.store.select('user').subscribe(user => {
      this.user = user
    });
    this.store.dispatch(loadUser());
  }

  ngOnInit(): void {
    this.store.select(projectAcceptedByStudent).pipe(takeUntil(this.unsubscribe$)).subscribe(
      projectId => this.projectId = projectId
    )
  }

  logout(){
    this.userService.logout().pipe(takeUntil(this.unsubscribe$)).subscribe( 
      () => {
        window.location.reload()
      }

    );
  }

  get isLogged() {
    return this.user?.logged
  }

  get isCoordinator() {
    return this.user?.role === 'COORDINATOR'
  }

  get showExternalLinks(): boolean {
    return this.projectId !== undefined || this.user?.role === 'COORDINATOR'
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
