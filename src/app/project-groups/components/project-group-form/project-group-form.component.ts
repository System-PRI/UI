import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Student } from '../../models/student';
import { ProjectGroupFormService } from './project-group-form.service';
import { Observable, map, startWith, take, tap } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteActivatedEvent, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Instructor } from '../../models/instructor';
import { ProjectGroupsListService } from '../project-groups-list/project-groups-list.service';
import { ProjectGroup } from '../../models/project-group';

@Component({
  selector: 'project-group-form',
  templateUrl: './project-group-form.component.html',
  styleUrls: ['./project-group-form.component.scss']
})
export class ProjectGroupFormComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  students: Student[] = [
    {
      name: 'Adrian Kuraszkiewicz',
      email: 'adrkur6@st.amu.edu.pl',
      indexNumber: 's145654'
    },
    {
      name: 'Dawid Gorkiewicz',
      email: 'dawgru6@st.amu.edu.pl',
      indexNumber: 's2323'
    },
    {
      name: 'Katarzyna Jaroszewska',
      email: 'katjar2@st.amu.edu.pl',
      indexNumber: 's34554'
    },
    {
      name: 'Aleksandra Kacprzak',
      email: 'alekac2@st.amu.edu.pl',
      indexNumber: 's112333'
    }
  ]

  instructors: Instructor[] = [
    {
      name: 'Jan Kowalski',
      email: 'jankow6@st.amu.edu.pl',
      indexNumber: 's45678'
    },
    {
      name: 'Anna Nowak',
      email: 'annnow6@st.amu.edu.pl',
      indexNumber: 's12345'
    },
    {
      name: 'Marcin Łopatka',
      email: 'marlop6@st.amu.edu.pl',
      indexNumber: 's32442'
    },
    {
      name: 'Andrzej Chmura',
      email: 'andchm6@st.amu.edu.pl',
      indexNumber: 's43434'
    }
  ]

  user: Student =  {
    name: 'Adrian Kuraszkiewicz',
    email: 'adrkur6@st.amu.edu.pl',
    indexNumber: 's145654'
  }


  technologies: string[] = [];
  technologyCtrl = new FormControl('');
  commonTechnologies: string[] = ['Java', 'Javasctipt', 'Python', 'Angular'];
  filteredTechnologies!: Observable<string[]>;
  activatedTechnologyOption: string | null = null;

  selectedMembers: Student[] = []
  filteredStudents!: Observable<Student[]>;
  memberInput = new FormControl('');

  formIsValid: boolean = false;


  projectGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    members: this.fb.array([]),
    technologies: [[], Validators.required],
    instructor: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder, 
    private projectGroupFormService: ProjectGroupFormService,
    private projectGroupsListService: ProjectGroupsListService
    ){}

  ngOnInit(): void {
    /*this.projectGroupFormService.students$.subscribe(
      students => this.students = students
    )*/

    this.filteredStudents = this.memberInput.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => this.filterStudents(value || ''))
    )

    this.filteredTechnologies = this.technologyCtrl.valueChanges.pipe(
      startWith(null),
      map((technology: string | null) => this.filterTechnologies(technology || ''))
    );

    this.members.push(this.fb.group({
      data: this.user,
      role: [null, Validators.required]
    }));
  }

  filterStudents(value: string | Student): Student[]{
    if(typeof value === "object") return this.students

    const filteredValue = value.toLowerCase()
    return this.students.filter( student => 
        (student.name.toLowerCase().includes(filteredValue) || student.email.toLowerCase().includes(filteredValue)) && 
        this.selectedMembers.indexOf(student) === -1 && student.email !== this.user.email
    )
  }

  onMemberSelect(member: Student): void {
    this.members.push(this.fb.group({
      data: member,
      role: [null, Validators.required]
    }));
    this.selectedMembers.push(member);
    this.memberInput.reset()
  }

  removeMember(member: AbstractControl){
    let index = this.members.controls.findIndex(iteratedMember => iteratedMember === member)
    if(index !== -1) this.members.removeAt(index)

    index = this.selectedMembers.findIndex(iteratedMember => iteratedMember.email === this.getMemberData(member).email)
    if(index !== -1) this.selectedMembers.splice(index, 1)

    this.memberInput.reset()
  }

  get members() {
    return this.projectGroup.get('members') as FormArray;
  }

  getMemberData(member: AbstractControl): {name: string, email: string, role: FormControl}{
    return { 
      name: member.get('data')?.value.name ,
      email: member.get('data')?.value.email,
      role: member.get('role') as FormControl
    }
  }

  addTechnology(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && 
       this.technologies.findIndex(t => t.toLowerCase() === value.toLowerCase()) === -1 &&
       !this.activatedTechnologyOption
    ){
      this.technologies.push(value);
    }

    event.chipInput!.clear();
    this.technologyCtrl.setValue(null);
    this.activatedTechnologyOption = null;
  }

  removeTechnology(technology: string): void {
    const index = this.technologies.indexOf(technology);

    if (index >= 0) {
      this.technologies.splice(index, 1);
    }
  }

  selectedTechnology(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if(this.technologies.findIndex(t => t.toLowerCase() === value.toLowerCase()) === -1){
      this.technologies.push(value);
    }
    this.technologyCtrl.setValue(null);

    event.option.deselect();

  }

  activatedTechnology(event: MatAutocompleteActivatedEvent): void { 
    this.activatedTechnologyOption = event.option?.value; 
  }

  private filterTechnologies(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.commonTechnologies.filter(technology => 
        technology.toLowerCase().includes(filterValue) && this.technologies.indexOf(technology) === -1
    );
  }

  getErrorMessage(controlName: string): string {
    if (this.projectGroup.get(controlName)?.hasError('required')) {
      return 'You must enter a value';
    }
    return ''
  }

  onSubmit(): void {
    console.log(this.projectGroup.value)

    if(this.projectGroup.valid){

      let projectGroups: ProjectGroup[] = [];

      this.projectGroupsListService.projectGroupsSubject$.pipe(
        take(1),
        tap(pg => {
          projectGroups = pg.slice();
          projectGroups.push({
              name: this.projectGroup.controls.name.value, 
              instructor: 'Jan Kowalski', 
              acceptanceStatus: false
          });
          this.projectGroupsListService.projectGroupsSubject$.next(projectGroups)


        })
      ).subscribe()


      this.formIsValid;
    }

    this.memberInput.reset()

  }
}
