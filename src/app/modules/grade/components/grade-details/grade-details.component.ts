import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GradeDetails } from '../../models/grade';
import { Subject } from 'rxjs';
import { UserState } from 'src/app/modules/user/state/user.state';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'grade-details',
  templateUrl: './grade-details.component.html',
  styleUrls: ['./grade-details.component.scss']
})
export class GradeDetailsComponent implements OnInit, OnDestroy {

  data!: GradeDetails;
  unsubscribe$ = new Subject();
  user!: UserState;
  gradesData = [
    {
      section: '1',
      group: '1',
      grade: 1
    },
    {
      section: '1',
      group: '2',
      grade: 1
    }
  ]
  gradeForm = this.fb.group({
    grades: this.fb.array([
      {
        section: '1',
        group: '1',
        grade: new FormControl(1)
      },
      {
        section: '1',
        group: '2',
        grade: new FormControl(2)
      }
    ]),
  });

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({gradeDetails, user}) => {
      this.data = gradeDetails;
      this.user = user;
    })
  }

  navigateBack(){
    this.router.navigate([{outlets: {modal: null}}]);
  }

  isRadioButtonChecked(sectionIndex: string, groupIndex: string, value: number): boolean {
    //console.log((this.grades.controls.filter((grade: any) => grade.section === sectionIndex && grade.group === groupIndex)[0] as FormControl).value.grade as FormControl);
    return (this.grades.controls.filter((grade: AbstractControl) => grade.value.section === sectionIndex && grade.value.group === groupIndex)[0].value.grade as FormControl).value === value;
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }

  getGradeData(sectionIndex: string, groupIndex: string): FormControl {
    return this.grades.controls.filter((grade: AbstractControl) => grade.value.section === sectionIndex && grade.value.group === groupIndex)[0].value.grade as FormControl;
  }
  

  get grades() {
    return this.gradeForm.get('grades') as FormArray;
  }
  
}
