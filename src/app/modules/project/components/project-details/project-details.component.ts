import { Component, Inject, OnDestroy } from '@angular/core';
import { ProjectDetailsData } from '../../models/project';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from 'src/app/modules/user/models/student.model';
import { SelectionModel } from '@angular/cdk/collections';
import { ProjectService } from '../../project.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnDestroy {
  students!: MatTableDataSource<Student>;
  selection = new SelectionModel<Student>(false, []);
  selectedItem = <Student>{};
  unsubscribe$ = new Subject();
 
  constructor(
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDetailsData
  ){ 
    this.students = new MatTableDataSource<Student>(this.data?.projectDetails?.students)
  }

  selectAdmin(student: Student) {
    this.selection.toggle(student);
    this.selectedItem = student;

    this.projectService.changeProjectAdmin(this.data.projectDetails?.id!, student.indexNumber)
      .pipe(takeUntil(this.unsubscribe$)).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
