import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Project } from '../../models/project';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent{
  @Input() columns!: string[];
  @Input() projects!: MatTableDataSource<Project>;
  @Output() openProjectDetailsEvent = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(): void {
    this.projects.paginator = this.paginator;
    this.projects.sort = this.sort;
  }
}
