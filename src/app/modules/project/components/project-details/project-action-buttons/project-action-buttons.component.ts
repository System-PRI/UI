import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ProjectDetails } from '../../../models/project.model';
import { User } from 'src/app/modules/user/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ProjectRemoveDialogComponent } from '../project-remove-dialog/project-remove-dialog.component';
import { acceptProject, removeProject,unacceptProject, updateGradingPhase } from '../../../state/project.actions';
import { Subject, takeUntil } from 'rxjs';
import { AreYouSureDialogComponent } from 'src/app/modules/shared/are-you-sure-dialog/are-you-sure-dialog.component';
import { GradeService } from '../../../services/grade.service';
import { PhaseChangeResponse } from '../../../models/grade.model';
import { acceptProjectSuccess, removeProjectSuccess, unacceptProjectSuccess } from '../../../state/project-api.actions';

@Component({
  selector: 'project-action-buttons',
  templateUrl: './project-action-buttons.component.html',
  styleUrls: ['./project-action-buttons.component.scss']
})
export class ProjectActionButtonsComponent implements OnDestroy {
  @Input() projectDetails!: ProjectDetails;
  @Input() user!: User;
  unsubscribe$ = new Subject();

  constructor(
    private store: Store<State>,
    private _snackbar: MatSnackBar,
    private router: Router,
    private actions$: Actions,
    private dialog: MatDialog,
    private gradeService: GradeService
  ){}

  editProject(){
    this.router.navigate([{outlets: {modal: `projects/form/${this.projectDetails.id}`}}], { queryParams: {comingFromDetailsPage: true} });
  }
  
  acceptProject(): void {
    this.store.dispatch(acceptProject({projectId: this.projectDetails.id!, role: this.user.role}))
    this.actions$.pipe(ofType(acceptProjectSuccess),takeUntil(this.unsubscribe$),).subscribe(() => {
      this.projectDetails.members = this.projectDetails.members?.map(member => {
        if(member.indexNumber === this.user.indexNumber){
          member.accepted = true;
        } 
        return member
      });
      this._snackbar.open('Project successfully accepted', 'close');
    });
  }

  unacceptProject(): void {
    this.store.dispatch(unacceptProject({projectId: this.projectDetails.id!, role: this.user.role}))
    this.actions$.pipe(ofType(unacceptProjectSuccess),takeUntil(this.unsubscribe$),).subscribe(() => {
      this.projectDetails.members = this.projectDetails.members?.map(member => {
        if(member.indexNumber === this.user.indexNumber){
          member.accepted = false;
        } 
        return member
      });
      this._snackbar.open('Project successfully unaccepted', 'close');
    })
  }

  openAreYouSureDialog(action: string): void {
    const actionMap: {[key: string]: { name: string, action: Function}} = {
      'publish': {
        name: 'publish evaluation cards and unlock them for students to view.',
        action: this.publishGrades.bind(this)
      },
      'retake': {
        name: `activate retake's evaluation card`,
        action: this.openRetakePhase.bind(this)
      },
      'freeze': {
        name: `block the semester's evaluation card and activate the defense's evaluation card, evaluation cards won't be available for students to view until they are published`,
        action: this.freezeGrading.bind(this)
      }
    }

    const dialogRef = this.dialog.open(AreYouSureDialogComponent, {
      data: { actionName: actionMap[action].name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        actionMap[action].action()
      }
    });
  }

  freezeGrading(){
    this.gradeService.freezeGrading(this.projectDetails.id!).pipe(takeUntil(this.unsubscribe$),).subscribe(
        (response: PhaseChangeResponse) => {
          this._snackbar.open('Successful freeze', 'close');
          this.projectDetails.freezeButtonShown = false;
          this.projectDetails.publishButtonShown = true;
          this.projectDetails.evaluationCards = response.evaluationCards;
          this.store.dispatch(updateGradingPhase({projectId: this.projectDetails.id!, phase: response.phase }))
        }
    );
  }

  
  openRetakePhase(){
    this.gradeService.openRetakePhase(this.projectDetails.id!).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: PhaseChangeResponse) => {
        this._snackbar.open('Successful retake phase opening', 'close');
        this.projectDetails.retakeButtonShown = false;
        this.projectDetails.publishButtonShown = false;
        this.projectDetails.evaluationCards = response.evaluationCards;
        this.store.dispatch(updateGradingPhase({projectId: this.projectDetails.id!, phase: response.phase }))
      }
    );
  }

  publishGrades(){
    this.gradeService.publish(this.projectDetails.id!).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: PhaseChangeResponse) => {
        this._snackbar.open('Successful publishing', 'close');
        this.projectDetails.retakeButtonShown = false;
        this.projectDetails.publishButtonShown = false;
        this.projectDetails.evaluationCards = response.evaluationCards;
        this.store.dispatch(updateGradingPhase({projectId: this.projectDetails.id!, phase: response.phase }))
      }
    );
  }


  openRemoveProjectDialog(){
    const dialogRef = this.dialog.open(ProjectRemoveDialogComponent, {
      data: { projectName: this.projectDetails.name},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.store.dispatch(removeProject({projectId: this.projectDetails.id!}))
        this.actions$.pipe(ofType(removeProjectSuccess),takeUntil(this.unsubscribe$),).subscribe(() => {
          this.router.navigate([{outlets: {modal: null}}]);
          this._snackbar.open('Project successfully removed', 'close');
        })
      }
    });
  }

  get showUnacceptButton(){
    return this.user.role === 'STUDENT' && this.user.acceptedProjects.includes(this.projectDetails.id!) && !this.projectDetails.accepted
  }

  get showFreezeGradingButton(){
    return this.projectDetails.freezeButtonShown
  }

  get showOpenRetakePhaseButton(){
    return this.projectDetails.retakeButtonShown
  }

  get showPublishButton(){
    return this.projectDetails.publishButtonShown
  }

  get showEditButton(){
    if(
      (this.user.role === 'PROJECT_ADMIN' && 
       this.user.acceptedProjects.includes(this.projectDetails.id!)
      )
      ||
      (this.user.role === 'COORDINATOR')
      ||
      ((this.user.role === 'SUPERVISOR') &&
      this.user.acceptedProjects.includes(this.projectDetails.id!))
    ){
      return true
    } else {
      return false
    }
  }

  get showAcceptButton(){
    if(
      (this.user.role === 'STUDENT' && 
      this.user.acceptedProjects.length === 0 && 
      this.user.projects.includes(this.projectDetails.id!))
      ||
      ((this.user.role === 'SUPERVISOR' || this.user.role === 'COORDINATOR') &&
      !this.user.acceptedProjects.includes(this.projectDetails.id!) &&
      this.user.projects.includes(this.projectDetails.id!) &&
      this.projectDetails.confirmed &&
      !this.projectDetails.maxAvailabilityFilled)
     ){
       return true
     } else {
       return false
     }
  }

  get showRemoveButton(){
    if(
      (this.user.role === 'PROJECT_ADMIN' && 
       this.user.acceptedProjects.includes(this.projectDetails.id!) &&
       !this.projectDetails.accepted
      )
      ||
      (this.user.role === 'COORDINATOR')
    ){
      return true
    } else {
      return false
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
