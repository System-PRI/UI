import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupervisorAvailability} from '../../models/supervisor-availability.model';
import { Subject, takeUntil} from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { UserState } from 'src/app/modules/user/state/user.state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectDetails } from '../../models/project.model';

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  projectDetails!: ProjectDetails;
  user!: UserState;
  unsubscribe$ = new Subject();
 
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
    private _snackbar: MatSnackBar,
  ){}
   
  ngOnInit(): void {
    this.scrollToTop();

    this.activatedRoute.data.subscribe(({projectDetails, supervisorAvailability, evaluationCards}) => {
      this.projectDetails = projectDetails;
  
      if(evaluationCards.status === 204){
        this.projectDetails.evaluationCards = undefined;
        this._snackbar.open('Evaluation cards are locked at the moment', 'close');
      } else {
        this.projectDetails.evaluationCards = evaluationCards.body;
      }

      let projectSupervisorAvailability = supervisorAvailability.find(
        (availability: SupervisorAvailability) => availability.supervisor.indexNumber === this.projectDetails.supervisor?.indexNumber
      )

      this.projectDetails.maxAvailabilityFilled = projectSupervisorAvailability?.assigned === projectSupervisorAvailability?.max;
    })

    this.store.select('user').pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
    });
  }

  scrollToTop(){
    document.getElementsByClassName('mat-drawer-content')[0].scrollTo(0, 0);
  }

  navigateBack(){
    this.router.navigate([{outlets: {modal: null}}]);
  }

  get showExternalLinks(): boolean{
    return  this.user.acceptedProjects.includes(this.projectDetails.id!) || 
            this.user.role === 'COORDINATOR' || 
            this.user.role === 'SUPERVISOR'
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
