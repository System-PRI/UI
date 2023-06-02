import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Project, ProjectDetails, ProjectFormData } from '../../models/project';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Student } from 'src/app/modules/user/models/student.model';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredStudents!: Observable<Student[]>;
  technologies: string[] = [];
  technologyCtrl = new FormControl('');
  selectedMembers: Student[] = []
  memberInput = new FormControl('');

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    members: this.fb.array([]),
    technologies: new FormControl<string[]>([], [Validators.required]),
    supervisorIndexNumber: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectFormData,
  ) { }

  ngOnInit(): void {
    if(this.data.projectDetails){
      this.projectForm.controls.name.setValue(this.data.projectDetails.name);
      this.projectForm.controls.description.setValue(this.data.projectDetails.description);
      this.data.students.forEach(student => {
        this.members.push(this.fb.group({
          ...student,
          role: [student.role, Validators.required]
        }));
        this.selectedMembers.push(student);
      })
      this.projectForm.controls.supervisorIndexNumber.setValue(this.data.projectDetails.supervisor.indexNumber);
      this.projectForm.controls.technologies.setValue(this.data.projectDetails.technologies);
      this.technologies = this.data.projectDetails.technologies;
    } else {
      this.members.push(this.fb.group({
        name: this.data.user.name,
        indexNumber: this.data.user.indexNumber,
        email: this.data.user.email,
        role: [null, Validators.required]
      }));
    }


    this.filteredStudents = this.memberInput.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => this.filterStudents(value || ''))
    )

  }

  filterStudents(value: string | Student): Student[] {
    if (typeof value === "object") return this.data.students

    const filteredValue = value.toLowerCase()
    return this.data.students.filter(student =>
      (
        student.name.toLowerCase().includes(filteredValue) || 
        student.email.toLowerCase().includes(filteredValue) || 
        student.indexNumber.toLowerCase().includes(filteredValue)
      ) 
      && this.selectedMembers.filter(member => member.indexNumber !== student.indexNumber).length === 0 
      && student.indexNumber !== this.data.user.indexNumber
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
    if (value && this.projectForm.controls.technologies.value?.findIndex(t => t.toLowerCase() === value.toLowerCase()) === -1) {
      this.projectForm.controls.technologies.value?.push(value);
    }
    event.chipInput!.clear();
  }

  removeTechnology(technology: string): void {
    this.projectForm.controls.technologies.value?.splice(this.technologies.indexOf(technology), 1);
  }

  getErrorMessage(controlName: string): string {
    if (this.projectForm.get(controlName)?.hasError('required')) {
      return 'You must enter a value';
    }
    return ''
  }

  onSubmit(): void {
    if (this.projectForm.valid) {    
      let projectDetails: ProjectDetails = {
        name: this.projectForm.controls.name.value!,
        description: this.projectForm.controls.description.value!,
        students: this.members.controls.map((control: any) => { return {
          name: control.controls.name.value,
          indexNumber: control.controls.indexNumber.value,
          email: control.controls.email.value,
          role: control.controls.role.value
        }}),
        technologies: this.projectForm.controls.technologies.value!,
        admin: this.data.projectDetails ? this.data.projectDetails?.admin! : this.data.user.indexNumber,
        accepted: this.data.projectDetails ? this.data.projectDetails?.accepted! : false,
        supervisor: this.data.supervisors.find(
          supervisor => supervisor.indexNumber === this.projectForm.controls.supervisorIndexNumber.value
        )!
      }
      this.dialogRef.close(projectDetails)
    }
  }
}
