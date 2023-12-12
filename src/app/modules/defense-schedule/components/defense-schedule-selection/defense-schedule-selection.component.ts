import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { DefenseScheduleService } from '../../defense-schedule.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Project, ProjectDefense } from '../../models/defense-schedule.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'defense-schedule-selection',
  templateUrl: './defense-schedule-selection.component.html',
  styleUrls: ['./defense-schedule-selection.component.scss']
})
export class DefenseScheduleSelectionComponent implements OnInit, OnDestroy {
  columns = ['checkbox', 'time', 'project', 'class', 'committee']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  defenses!: MatTableDataSource<ProjectDefense>;
  projects: Project[] = [];
  unsubscribe$ = new Subject();

  constructor(private defenseScheduleService: DefenseScheduleService){}

  ngOnInit(): void {
    this.defenseScheduleService.getProjectDefenses().subscribe(
      defenses => {
        this.defenses = new MatTableDataSource<ProjectDefense>(defenses);
        this.defenses.paginator = this.paginator;
        this.defenses.sort = this.sort;
      }
    )

    this.defenseScheduleService.getProjects().subscribe(
      projects => this.projects = projects
    )
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
