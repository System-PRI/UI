import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component} from '@angular/core'
import { Store } from '@ngrx/store';
import { loadUser } from './modules/user/state/user.actions';
import { State } from './app.state';
import { map } from 'rxjs';
import { getUser, isLogged } from './modules/user/state/user.selectors';
import { UserState } from './modules/user/state/user.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appName: string = 'PRI';
  mobileQuery?: MediaQueryList;
  fillerNav: string[] = ['Project Groups', 'External Links'];
  user!: UserState;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private store: Store<State>) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
 
    this.store.select('user').subscribe(user => this.user = user);
  }

  get isLogged() {
    return this.user?.logged
  }

  get isCoordinator() {
    return this.user?.role === 'COORDINATOR'
  }
}
