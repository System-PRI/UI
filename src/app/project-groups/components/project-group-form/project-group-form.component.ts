import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Student } from '../../models/student';
import { ProjectGroupFormService } from './project-group-form.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'project-group-form',
  templateUrl: './project-group-form.component.html',
  styleUrls: ['./project-group-form.component.scss']
})
export class ProjectGroupFormComponent implements OnInit {
  constructor(private fb: FormBuilder, private projectGroupFormService: ProjectGroupFormService){}

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
    }
  ]

  selectedMembers: Student[] = []


  filteredStudents!: Observable<Student[]>;

  member = new FormControl('sads');

  projectGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    members: this.fb.array([]),
    technologies: this.fb.array([]),
    instructor: ['', Validators.required]
  });

  ngOnInit(): void {
    /*this.projectGroupFormService.students$.subscribe(
      students => this.students = students
    )*/

    this.filteredStudents = this.member.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStudents(value || ''))
    )
  }

  filterStudents(value: string | Student): Student[]{
    if(typeof value === "object") return this.students

    const filteredValue = value.toLowerCase()
    return this.students.filter( student => 
        (student.name.includes(filteredValue) || student.email.includes(filteredValue)) && 
        this.selectedMembers.indexOf(student) === -1
    )
  }

  getMemberName(member: Student): string{
    return member?.name;
  }

  addMember(member: any): void {
    this.members.push(this.fb.group({
      data: member,
      role: null
    }));
    this.selectedMembers.push(member);
    this.member.reset()
  }

  addTechnology(): void {
    //TODO
  }

  onSubmit(): void {
    console.log(this.projectGroup.value)
  }


  getMemberData(member: any){
    return member.controls.data.value.name + ' ' + member.controls.data.value.email
  }

  get members() {
    return this.projectGroup.get('members') as FormArray;
  }
}
