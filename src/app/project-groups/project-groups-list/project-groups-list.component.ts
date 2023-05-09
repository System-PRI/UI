import { Component, ViewChild } from '@angular/core';
import { ProjectGroup } from '../models/project-group';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'project-groups-list',
  templateUrl: './project-groups-list.component.html',
  styleUrls: ['./project-groups-list.component.scss']
})
export class ProjectGroupsListComponent {
  displayedColumns: string[] = ['name', 'instructor', 'acceptanceStatus'];
  dataSource = new MatTableDataSource<ProjectGroup>(PROJECT_GROUPS);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

const PROJECT_GROUPS: ProjectGroup[] = [
  {name: 'Projekt inzynierski na jakis ciekawy temat 1', instructor: 'Adam Kowalski', acceptanceStatus: true},
  {name: 'Projekt inzynierski na jakis ciekawy temat 2', instructor: 'Anna Nowak', acceptanceStatus: false},
  {name: 'Projekt inzynierski na jakis ciekawy temat 3', instructor: 'Adam Kowalski', acceptanceStatus: true},
  {name: 'Projekt inzynierski na jakis ciekawy temat 4', instructor: 'Oliwa Wieczorek', acceptanceStatus: true},
  {name: 'Projekt inzynierski na jakis ciekawy temat 5', instructor: 'Anna Nowak', acceptanceStatus: false},
  {name: 'Projekt inzynierski na jakis ciekawy temat 6', instructor: 'Adam Kowalski', acceptanceStatus: true},
  {name: 'Projekt inzynierski na jakis ciekawy temat 7', instructor: 'Oliwa Wieczorek', acceptanceStatus: false},
  {name: 'Projekt inzynierski na jakis ciekawy temat 8', instructor: 'Anna Nowak', acceptanceStatus: true},
  {name: 'Projekt inzynierski na jakis ciekawy temat 9', instructor: 'Adam Kowalski', acceptanceStatus: false},
  {name: 'Projekt inzynierski na jakis ciekawy temat 10', instructor: 'Oliwa Wieczorek', acceptanceStatus: false},
];
