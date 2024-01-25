import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EvaluationCards } from '../../../models/grade.model';

@Component({
  selector: 'project-evaluation-cards',
  templateUrl: './project-evaluation-cards.component.html',
  styleUrls: ['./project-evaluation-cards.component.scss']
})
export class ProjectEvaluationCardsComponent implements OnChanges {
  @Input() evaluationCards!: EvaluationCards;
  @Input() projectId!: string;
  selectedSemesterIndex = 0;
  selectedPhaseIndex = 0;
  gradesShown = true;
  grade: string = '0%';
  semesterMap: {[key: number]: string} = {
    0: 'FIRST',
    1: 'SECOND'
  }
  phaseMap: {[key: number]: string} = {
    0: 'SEMESTER_PHASE',
    1: 'DEFENSE_PHASE',
    2: 'RETAKE_PHASE'
  }
  objectKeys = Object.keys;
  selectedCriteria = '';
  criteriaMet = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedSemesterIndex = this.selectedSemester;
    this.selectedPhaseIndex = this.selectedPhase;
    this.gradesShown = this.evaluationCards !== undefined && this.evaluationCards !== null;
  }
  
  onSemesterTabChange(event: MatTabChangeEvent){
    this.selectedSemesterIndex = event.index;
    this.grade = this.evaluationCards[this.semesterMap[this.selectedSemesterIndex]][this.phaseMap[this.selectedPhaseIndex]].grade!;
  }

  onPhaseTabChange(event: MatTabChangeEvent){
    this.selectedPhaseIndex = event.index;
    this.grade = this.evaluationCards[this.semesterMap[this.selectedSemesterIndex]][this.phaseMap[this.selectedPhaseIndex]].grade!;
  }

  onGradeChange({grade, criteriaMet, selectedCriteria}: {grade: string, criteriaMet: boolean, selectedCriteria: string}){
    this.grade = grade;
    this.criteriaMet = criteriaMet;
    this.selectedCriteria = selectedCriteria;
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

}
