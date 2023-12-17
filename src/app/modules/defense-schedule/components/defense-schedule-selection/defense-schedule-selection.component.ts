import { Component, ViewChild, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DefenseScheduleService } from '../../defense-schedule.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project, ProjectDefense } from '../../models/defense-schedule.model';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/modules/user/models/user.model';

@Component({
  selector: 'defense-schedule-selection',
  templateUrl: './defense-schedule-selection.component.html',
  styleUrls: ['./defense-schedule-selection.component.scss']
})
export class DefenseScheduleSelectionComponent implements OnInit, OnDestroy, OnChanges {
  columns = ['time', 'project', 'class', 'committee']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource!: MatTableDataSource<ProjectDefense>;
  projects: Project[] = [];
  unsubscribe$ = new Subject();
  @Input() userRole!: string;
  @Input() defenses!: ProjectDefense[];

  constructor(private defenseScheduleService: DefenseScheduleService){}

  ngOnInit(): void {
    this.defenseScheduleService.getProjects().subscribe(
      projects => this.projects = projects
    )

    if(this.userRole === 'STUDENT' || this.userRole === 'PROJECT_ADMIN'){
      this.columns = ['checkbox', ...this.columns]
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.defenses){
        this.dataSource = new MatTableDataSource<ProjectDefense>(this.defenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
  }

  projectChanged(event: MatSelectChange, projectDefenseId: string){
    this.defenseScheduleService.updateProjectDefense(projectDefenseId, event.value)
      .pipe(takeUntil(this.unsubscribe$)).subscribe()
  }

  defenseSelected(event: MatRadioChange, defenseId: string){
    this.defenseScheduleService.updateProjectDefense(defenseId, event.value)
      .pipe(takeUntil(this.unsubscribe$)).subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
