import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProjectFormService } from './project-form.service';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Project, ProjectDetails } from '../../models/project';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from 'src/app/modules/user/models/student.model';
import { Supervisor } from 'src/app/modules/user/models/supervisor.model';
import { ProjectService } from '../../project.service';

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
    indexNumber: 's145654',
  }

  students: Student[] = []
  filteredStudents!: Observable<Student[]>;

  supervisors: Supervisor[] = []

  technologies: string[] = [];
  technologyCtrl = new FormControl('');

  selectedMembers: Student[] = []
  memberInput = new FormControl('');

  formIsValid: boolean = false;

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    members: this.fb.array([]),
    technologies: new FormControl<string[]>([], [Validators.required]),
    supervisor: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private projectFormService: ProjectFormService,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data?: ProjectDetails
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.projectForm.controls.name.setValue(this.data.name);
      this.projectForm.controls.description.setValue(this.data.description);
      this.data.students.forEach(student => {
        this.members.push(this.fb.group({
          ...student,
          role: [student.role, Validators.required]
        }));
        this.selectedMembers.push(student);
      })
      this.projectForm.controls.supervisor.setValue(this.data.supervisor.indexNumber);
      this.projectForm.controls.technologies.setValue(this.data.technologies);
      this.technologies = this.data.technologies;
    } else {
      this.members.push(this.fb.group({
        ...this.user,
        role: [null, Validators.required]
      }));
    }

    this.projectFormService.students$.subscribe(
      students => this.students = students
    )

    this.projectFormService.students$.subscribe(
      students => this.students = students
    )

    this.projectService.supervisors$.subscribe(
      supervisors => this.supervisors = supervisors
    )

    this.filteredStudents = this.memberInput.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => this.filterStudents(value || ''))
    )

  }

  filterStudents(value: string | Student): Student[] {
    if (typeof value === "object") return this.students

    const filteredValue = value.toLowerCase()
    return this.students.filter(student =>
      (student.name.toLowerCase().includes(filteredValue) || student.email.toLowerCase().includes(filteredValue)) &&
      this.selectedMembers.filter(member => member.email !== student.email).length === 0 && student.email !== this.user.email
    )
  }

  onMemberSelect(member: Student): void {
    this.members.push(this.fb.group({
      ...member,
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

  getMemberData(member: AbstractControl): { name: string, email: string, admin: boolean, role: FormControl } {
    return {
      name: member.get('name')?.value,
      email: member.get('email')?.value,
      admin: member.get('admin')?.value,
      role: member.get('role') as FormControl
    }
  }

  addTechnology(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && this.technologies.findIndex(t => t.toLowerCase() === value.toLowerCase()) === -1) {
      this.technologies.push(value);
    }

    event.chipInput!.clear();
    this.technologyCtrl.setValue(null);
  }

  removeTechnology(technology: string): void {
    const index = this.technologies.indexOf(technology);

    if (index >= 0) {
      this.technologies.splice(index, 1);
    }
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
        name: this.projectForm.controls.name.value!,
        supervisor: this.supervisors.find(supervisor => supervisor.indexNumber === this.projectForm.controls.supervisor.value)!,
        accepted: false
      }
      this.projectService.addProject(project)
      this.formIsValid = true;
    }

    this.memberInput.reset()
  }
}
