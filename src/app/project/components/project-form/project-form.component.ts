import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Student } from '../../models/student';
import { ProjectFormService } from './project-form.service';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteActivatedEvent, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ProjectListService } from '../project-list/project-list.service';
import { Project } from '../../models/project';
import { Supervisor } from '../../models/supervisor';

@Component({
  selector: 'project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];

  user: Student = {
    name: 'Adrian Kuraszkiewicz',
    email: 'adrkur6@st.amu.edu.pl',
    indexNumber: 's145654'
  }
  students: Student[] = []
  filteredStudents!: Observable<Student[]>;

  supervisors$!: Observable<Supervisor[]>

  technologies: string[] = [];
  technologyCtrl = new FormControl('');
  commonTechnologies: string[] = ['Java', 'JavaScript', 'Python', 'Angular'];
  filteredTechnologies!: Observable<string[]>;
  activatedTechnologyOption: string | null = null;

  selectedMembers: Student[] = []
  memberInput = new FormControl('');

  formIsValid: boolean = false;

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    members: this.fb.array([]),
    technologies: [[], Validators.required],
    supervisor: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private projectFormService: ProjectFormService,
    private projectListService: ProjectListService
  ) { }

  ngOnInit(): void {
    this.projectFormService.students$.subscribe(
      students => this.students = students
    )

    this.supervisors$ = this.projectListService.supervisors$;

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

  filterStudents(value: string | Student): Student[] {
    if (typeof value === "object") return this.students

    const filteredValue = value.toLowerCase()
    return this.students.filter(student =>
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

  removeMember(member: AbstractControl) {
    let index = this.members.controls.findIndex(iteratedMember => iteratedMember === member)
    if (index !== -1) this.members.removeAt(index)

    index = this.selectedMembers.findIndex(iteratedMember => iteratedMember.email === this.getMemberData(member).email)
    if (index !== -1) this.selectedMembers.splice(index, 1)

    this.memberInput.reset()
  }

  get members() {
    return this.projectForm.get('members') as FormArray;
  }

  getMemberData(member: AbstractControl): { name: string, email: string, role: FormControl } {
    return {
      name: member.get('data')?.value.name,
      email: member.get('data')?.value.email,
      role: member.get('role') as FormControl
    }
  }

  addTechnology(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value &&
      this.technologies.findIndex(t => t.toLowerCase() === value.toLowerCase()) === -1 &&
      !this.activatedTechnologyOption
    ) {
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
    if (this.technologies.findIndex(t => t.toLowerCase() === value.toLowerCase()) === -1) {
      this.technologies.push(value);
    }
    this.technologyCtrl.setValue(null);

    event.option.deselect();

  }

  activatedTechnology(event: MatAutocompleteActivatedEvent): void {
    this.activatedTechnologyOption = event.option?.value;
  }

  filterTechnologies(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.commonTechnologies.filter(technology =>
      technology.toLowerCase().includes(filterValue) && this.technologies.indexOf(technology) === -1
    );
  }

  getErrorMessage(controlName: string): string {
    if (this.projectForm.get(controlName)?.hasError('required')) {
      return 'You must enter a value';
    }
    return ''
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      let project: Project = {
        name: this.projectForm.controls.name.value ?? '',
        supervisor: 'Jan Kowalski',
        acceptanceStatus: false
      }
      this.projectListService.addProject(project)

      this.formIsValid = true;
    }

    this.memberInput.reset()
  }
}
