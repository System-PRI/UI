import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ProjectSupervisorsService } from './project-supervisors.service';
import { SupervisorAvailability } from '../../models/supervisor-availability.model';

@Component({
  selector: 'project-supervisors',
  templateUrl: './project-supervisors.component.html',
  styleUrls: ['./project-supervisors.component.scss']
})
export class ProjectSupervisorsComponent implements OnInit, OnDestroy{

  displayedColumns: string[] = ['name', 'availability'];
  unsubscribe$ = new Subject();
  dataSource = new MatTableDataSource<SupervisorAvailability>([]);

  constructor (private projectSupervisorsService: ProjectSupervisorsService){}

  ngOnInit(): void {
    this.projectSupervisorsService.supervisorsAvailability$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((supervisorsAvailability) => this.dataSource.data = supervisorsAvailability)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete
  }

}
