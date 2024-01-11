import { Component, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {  Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChangeGradeResponse, EvaluationCard } from '../../models/grade.model';
import { GradeService } from '../../services/grade.service';
import { updateGrade } from '../../state/project.actions';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';

@Component({
  selector: 'project-grade',
  templateUrl: './project-grade.component.html',
  styleUrls: ['./project-grade.component.scss']
})
export class ProjectGradeComponent implements OnDestroy, OnChanges {

  @Input() evaulationCard!:  EvaluationCard;
  @Input() projectId!: string;
  @Input() isActive!: boolean;
  @Input() semester!: string;
  @Output() gradeChange: EventEmitter<{grade: string, criteriaMet: boolean, selectedCriteria: string}> = new EventEmitter();

  data!: EvaluationCard;
  expanded = false;
  grade!: string;
  criteria!: string;
  selectedCriteria!: string;
  unsubscribe$ = new Subject();

  constructor(
    private gradeSerice: GradeService,
    private router: Router,
    private store: Store<State>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.data = this.evaulationCard;
    this.grade = this.data.grade ? this.data.grade : '0%';
    this.countCriteria();
    if(this.isActive){
      this.gradeChange.emit({grade: this.grade, criteriaMet: this.data.criteriaMet, selectedCriteria: `${this.selectedCriteria}/${this.criteria}`});
    }
  }

  countCriteria(): void {
    let countCriteria = 0;
    let countSelectedCriteria = 0;
    this.data.sections.forEach(section => {
      section.criteriaGroups.forEach(group => {
        countCriteria++;
        if(group.selectedCriterion){
          countSelectedCriteria++;
        }
      })
    })
    this.criteria = `${countCriteria}`;
    this.selectedCriteria = `${countSelectedCriteria}`;
  }
 
  navigateBack(){
    this.router.navigate([{outlets: {modal: null}}]);
  }

  selectCriterion(groupIndex: string, key: string | null): void {
    if(this.data.editable){
      this.gradeSerice.changeGrade(this.projectId, this.evaulationCard.id, { id: groupIndex, selectedCriterion: key } )
        .pipe(takeUntil(this.unsubscribe$)).subscribe(
          (value: ChangeGradeResponse) => {
            this.grade = value.grade;
            this.data.grade = value.grade;
            this.data.criteriaMet = value.criteriaMet;
            
            this.countCriteria();
            this.gradeChange.emit({grade: value.grade, criteriaMet: value.criteriaMet, selectedCriteria: `${this.selectedCriteria}/${this.criteria}`});
            this.store.dispatch(updateGrade({projectId: this.projectId, grade: value!.grade, criteriaMet: value!.criteriaMet, semester: this.semester}))
          }
        )
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
