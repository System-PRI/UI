import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store';
import { loadUser } from './modules/user/state/user.actions';
import { State } from './app.state';
import { Subject, takeUntil } from 'rxjs';
import { projectAcceptedByStudent } from './modules/user/state/user.selectors';
import { UserState } from './modules/user/state/user.state';
import { UserService } from './modules/user/user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

enum ROLE {
  STUDENT = 'student',
  PROJECT_ADMIN = 'project admin',
  SUPERVISOR = 'supervisor',
  COORDINATOR = 'coordinator'
}

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
  learningMode!: string;
  isModalOpen = false;
  studyYear!: string;
  availableStudyYears!: {text: string, value: string}[]

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher, private store: Store<State>, 
    private userService: UserService,
    private router: Router
    ) {
      
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.store.select('user').subscribe(user => {
      this.user = user;
      if(user){
        this.learningMode = user.actualYear.split('#')[0];
        this.studyYear = user.actualYear;
        this.availableStudyYears = user.studyYears.map(year => {
          return { text: `${year.split('#')[1]} - ${this.translateLearningMode(year.split('#')[0])}`, value: year}
        })
      }
    });
    this.store.dispatch(loadUser());
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
            this.isModalOpen = event.url.includes('modal') && !event.url.includes('redirectTo');
        }
    });
    

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

  navigateTo(page: string, pageQueryParameter?: string){
    this.router.navigate([{outlets: {modal: null}}]).then(
      () => this.router.navigate([page], { queryParams: { 'page': pageQueryParameter } })
    )
  }

  studyYearChanged(event: MatSelectChange){
    this.userService.changeStudyYear(`${this.studyYear}`)
    .pipe(takeUntil(this.unsubscribe$)).subscribe(
      () => window.location.reload()
    )
  }

  get role(): string {
    return ROLE[this.user.role]
  }

  get hasBothLearningModes() {
    return this.user?.studyYears.filter(year => year.split('#')[1] === this.studyYear).length === 2;
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

  translateLearningMode(learningMode: string): string {
    switch(learningMode){
      case 'FULL_TIME': return 'Full time'
      case 'PART_TIME': return 'Part time'
    }
    return '';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
