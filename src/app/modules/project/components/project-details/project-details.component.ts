import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupervisorAvailability} from '../../models/supervisor-availability.model';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from 'src/app/modules/user/models/student.model';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil} from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { UserState } from 'src/app/modules/user/state/user.state';
import { acceptProject, acceptProjectSuccess, removeProject, removeProjectSuccess, unacceptProject, unacceptProjectSuccess, updateGradingPhase } from '../../state/project.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ProjectRemoveDialogComponent } from '../project-remove-dialog/project-remove-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectDetails } from '../../models/project.model';
import { EvaluationCards, PhaseChangeResponse } from '../../models/grade.model';
import { GradeService } from '../../services/grade.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

enum ROLE {
  FRONTEND = 'front-end',
  BACKEND = 'back-end',
  FULLSTACK = 'full-stack',
  SUPERVISOR = 'supervisor',
}

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  members!: MatTableDataSource<Student>;
  selection = new SelectionModel<Student>(false, []);
  selectedItem = <Student>{};
  columns = ['name', 'email', 'role', 'status']
  unsubscribe$ = new Subject();
  maxAvailabilityFilled: boolean = false;
  data!: ProjectDetails;
  user!: UserState;
  evaluationCards!: EvaluationCards;
  gradesShown = true;
  grade: string = '0%';
  objectKeys = Object.keys;
  selectedSemesterIndex = 0;
  selectedPhaseIndex = 0;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<State>,
    private actions$: Actions,
    private dialog: MatDialog,
    private router: Router,
    private _snackbar: MatSnackBar,
    private gradeService: GradeService
  ){}
   
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({projectDetails, supervisorAvailability, user, evaluationCards}) => {
      this.data = projectDetails;
      this.user = user;
      this.evaluationCards = evaluationCards;
      this.gradesShown = this.evaluationCards !== undefined && this.evaluationCards !== null;
      this.members = new MatTableDataSource<Student>([
        {...this.data?.supervisor!, 
          role: 'SUPERVISOR', 
          accepted:  this.data?.accepted
        },
        ...this.data?.students!  
      ])
      let projectSupervisorAvailability = supervisorAvailability.find(
        (availability: SupervisorAvailability) => availability.supervisor.indexNumber === this.data.supervisor?.indexNumber
      )
      if(projectSupervisorAvailability){
        this.maxAvailabilityFilled = projectSupervisorAvailability?.assigned === projectSupervisorAvailability?.max
      }
      
      this.selectedSemesterIndex = this.selectedSemester;
      this.selectedPhaseIndex = this.selectedPhase;
    })
  }

  keepOrder = (a: any, b: any) => {
    return a;
  }

  onGradeChange(grade: string){
    this.grade = grade;
  }

  acceptProject(): void {
    this.store.dispatch(acceptProject({projectId: this.data.id!, role: this.user.role}))
    this.actions$.pipe(ofType(acceptProjectSuccess),takeUntil(this.unsubscribe$),).subscribe(() => {
      this.members = new MatTableDataSource<Student>([
        {...this.data?.supervisor!, role: 'SUPERVISOR', accepted:  this.data?.accepted},
        ...this.data?.students!
        ].map(
          member => {
            if(member.indexNumber === this.user.indexNumber){
              member.accepted = true;
            } 
            return member
          }
        ))

    });
  }

  isProjectAdmin(member: Student){
    return  member.indexNumber === this.data.admin
  }

  isSupervisor(member: Student){
    return  member.indexNumber === this.data.supervisor.indexNumber
  }

  unacceptProject(): void {
    this.store.dispatch(unacceptProject({projectId: this.data.id!, role: this.user.role}))
    this.actions$.pipe(ofType(unacceptProjectSuccess),takeUntil(this.unsubscribe$),).subscribe(() => {
      this.members = new MatTableDataSource<Student>([
        {...this.data?.supervisor!, role: 'SUPERVISOR', accepted:  this.data?.accepted},
        ...this.data?.students!
        ].map(
          member => {
            if(member.indexNumber === this.user.indexNumber){
              member.accepted = false;
            } 
            return member
          }
        ))

    })
  }

  editProject(){
    this.router.navigate([{outlets: {modal: `projects/form/${this.data.id}`}}], { queryParams: {comingFromDetailsPage: true} });
  }

  openRemoveProjectDialog(){
    const dialogRef = this.dialog.open(ProjectRemoveDialogComponent, {
      data: { projectName: this.data.name},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.store.dispatch(removeProject({projectId: this.data.id!}))
        this.actions$.pipe(ofType(removeProjectSuccess),takeUntil(this.unsubscribe$),).subscribe(() => {
          this.router.navigate ([`projects`]) 
          this._snackbar.open('Project successfully removed', 'close');
        })
      }
    });
  }

  onTabChange(event: MatTabChangeEvent){
    const semesterMap: {[key: number]: string} = {
      0: 'FIRST',
      1: 'SECOND'
    }
    const phaseMap: {[key: number]: string} = {
      0: 'SEMESTER_PHASE',
      1: 'DEFENSE_PHASE',
      2: 'RETAKE_PHASE'
    }
    this.grade = this.evaluationCards[semesterMap[this.selectedSemesterIndex]][phaseMap[this.selectedPhaseIndex]].grade!;
  }

  get showRemoveButton(){
    if(
      (this.user.role === 'PROJECT_ADMIN' && 
       this.user.acceptedProjects.includes(this.data.id!) &&
       !this.data.accepted
      )
      ||
      (this.user.role === 'COORDINATOR')
    ){
      return true
    } else {
      return false
    }
  }

  get showEditButton(){
    if(
      (this.user.role === 'PROJECT_ADMIN' && 
       this.user.acceptedProjects.includes(this.data.id!)
      )
      ||
      (this.user.role === 'COORDINATOR')
      ||
      ((this.user.role === 'SUPERVISOR') &&
      this.user.acceptedProjects.includes(this.data.id!))
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
      this.user.projects.includes(this.data.id!))
      ||
      ((this.user.role === 'SUPERVISOR' || this.user.role === 'COORDINATOR') &&
      !this.user.acceptedProjects.includes(this.data.id!) &&
      this.user.projects.includes(this.data.id!) &&
      this.data.confirmed &&
      !this.maxAvailabilityFilled)
    ){
      return true
    } else {
      return false
    }
  }

  get showUnacceptButton(){
    return this.user.role === 'STUDENT' && this.user.acceptedProjects.includes(this.data.id!)
  }

  get showFreezeGradingButton(){
    return this.user.role === 'COORDINATOR' && this.data.freezeButtonShown
  }

  get showOpenRetakePhaseButton(){
    return this.user.role === 'COORDINATOR' && this.data.retakeButtonShown
  }

  get showPublishButton(){
    return this.user.role === 'COORDINATOR' && this.data.publishButtonShown
  }

  freezeGrading(){
    this.gradeService.freezeGrading(this.data.id!).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: PhaseChangeResponse) => {
        this.data.freezeButtonShown = false;
        this.data.publishButtonShown = true;
        this.evaluationCards = response.evaluationCards;
        this.store.dispatch(updateGradingPhase({projectId: this.data.id!, phase: response.phase }))
        this.selectedSemesterIndex = this.selectedSemester;
        this.selectedPhaseIndex = this.selectedPhase;
      }
    );
  }

  openRetakePhase(){
    this.gradeService.openRetakePhase(this.data.id!).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: PhaseChangeResponse) => {
        this.data.retakeButtonShown = false;
        this.data.publishButtonShown = false;
        this.evaluationCards = response.evaluationCards;
        this.store.dispatch(updateGradingPhase({projectId: this.data.id!, phase: response.phase }))
        this.selectedSemesterIndex = this.selectedSemester;
        this.selectedPhaseIndex = this.selectedPhase;
      }
    );
  }

  publish(){
    this.gradeService.publish(this.data.id!).pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: PhaseChangeResponse) => {
        this.data.retakeButtonShown = false;
        this.data.publishButtonShown = false;
        this.evaluationCards = response.evaluationCards;
        this.store.dispatch(updateGradingPhase({projectId: this.data.id!, phase: response.phase }))
        this.selectedSemesterIndex = this.selectedSemester;
        this.selectedPhaseIndex = this.selectedPhase;
      }
    );
  }


  getEvaluationCardsTranslations(key: string): string{
    const translations: {[key: string]: string} = {
      'FIRST': 'First semester',
      'SECOND': 'Second semester',
      'SEMESTER_PHASE': 'Semester phase',
      'DEFENSE_PHASE': 'Defense phase',
      'RETAKE_PHASE': 'Retake phase',
    }

    return translations[key];
  }

  getRole(role: keyof typeof ROLE): string {
    return ROLE[role]
  }

  navigateBack(){
    this.router.navigate([{outlets: {modal: null}}]);
  }

  get selectedSemester(): number {
    for(let semester in this.evaluationCards){
      for(let phase in this.evaluationCards[semester]){
        if(this.evaluationCards[semester][phase].active){
          return semester === 'FIRST' ? 0 : 1
        }
      }
    }
    return 0;
  }

  get selectedPhase(): number {
    for(let semester in this.evaluationCards){
      for(let phase in this.evaluationCards[semester]){
        if(this.evaluationCards[semester][phase].active){
          if(phase === 'SEMESTER_PHASE'){
            return 0;
          } else if(phase === 'DEFENSE_PHASE'){
            return 1;
          } else if(phase === 'RETAKE_PHASE'){  
            return 2;
          }
        }
      }
    }
    return 0;
  }

  get showExternalLinks(): boolean{
   return this.user.acceptedProjects.includes(this.data.id!) || 
          this.user.role === 'COORDINATOR' || 
          this.user.role === 'SUPERVISOR'
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
