import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ProjectDetailsData } from '../../models/project';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from 'src/app/modules/user/models/student.model';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectService } from '../../project.service';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { changeAdmin } from '../../state/project.actions';

enum ROLE {
  FRONTEND = 'front-end',
  BACKEND = 'back-end',
  FULLSTACK = 'full-stack'
}

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  students!: MatTableDataSource<Student>;
  selection = new SelectionModel<Student>(false, []);
  selectedItem = <Student>{};
  columns = ['name', 'email', 'role']
  unsubscribe$ = new Subject();
  
  constructor(
    private dialogRef: MatDialogRef<ProjectDetailsComponent>,
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDetailsData
  ){ 
    this.students = new MatTableDataSource<Student>(this.data?.projectDetails?.students)
  }

  ngOnInit(): void {
    if(
      this.data.user.role === 'COORDINATOR' || 
      (this.data.user.role === 'PROJECT_ADMIN' && this.data.user.acceptedProjects[0] === this.data.projectDetails?.id) ||
      (this.data.user.role === 'SUPERVISOR' && this.data.user.acceptedProjects.includes(this.data.projectDetails?.id!))
    ){
      this.columns.push('admin')
    }
  }

  selectAdmin(student: Student) {
    this.selection.toggle(student);
    this.selectedItem = student;

    if(student.indexNumber !== this.data.user.indexNumber){
      this.store.dispatch(changeAdmin({projectId: this.data.projectDetails?.id!, indexNumber: student.indexNumber}))
    }
  }

  acceptProject(): void {
    this.dialogRef.close(true)
  }

 

  showAcceptButton(){
    if (
      (this.data.user.role === 'STUDENT' && 
      this.data.user.acceptedProjects.length === 0 && 
      this.data.user.projects.includes(String(this.data.projectDetails?.id!)))
      ||
      (this.data.user.role === 'SUPERVISOR' &&
      !this.data.user.acceptedProjects.includes(String(this.data.projectDetails?.id!)) &&
      this.data.user.projects.includes(String(this.data.projectDetails?.id!)) &&
      this.data.projectDetails?.confirmed)
    ){
      return true
    } else {
      return false
    }
  }

  getRole(role: keyof typeof ROLE): string {
    return ROLE[role]
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
