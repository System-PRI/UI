import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component} from '@angular/core'
import { Store } from '@ngrx/store';
import { loadUser } from './modules/user/state/user.actions';
import { State } from './app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  appName: string = 'PRI';
  mobileQuery?: MediaQueryList;
  fillerNav: string[] = ['Project Groups', 'External Links']

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private store: Store<State>) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    
    this.store.dispatch(loadUser())
  }
}
