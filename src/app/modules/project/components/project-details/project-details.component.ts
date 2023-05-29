import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProjectDetails } from '../../models/project';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from 'src/app/modules/user/models/student.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent {
   students!: MatTableDataSource<Student>;
   columns: string[] = ['select','name', 'email', 'role'];
   
   selection = new SelectionModel<Student>(false, []);
   selectedItem = <Student>{};
 
   constructor(@Inject(MAT_DIALOG_DATA) public projectDetails?: ProjectDetails){
       this.students = new MatTableDataSource<Student>(this.projectDetails?.students)
   }


  selectItem(row: Student) {
    this.selection.toggle(row);
    this.selectedItem = row;
  }
}
