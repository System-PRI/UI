import { Component, OnInit, OnDestroy, } from '@angular/core';
import { DefenseScheduleService } from './defense-schedule.service';
import { SupervisorDefenseAssignmentAggregated, SupervisorStatistics } from './models/defense-schedule.model';
import { Subject, takeUntil } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'defense-schedule',
  templateUrl: './defense-schedule.component.html',
  styleUrls: ['./defense-schedule.component.scss']
})
export class DefenseScheduleComponent implements OnInit, OnDestroy {

  assignments: SupervisorDefenseAssignmentAggregated = {};
  unsubscribe$ = new Subject();
  statistics: SupervisorStatistics[] = [];


  constructor(private defenseScheduleService: DefenseScheduleService){}

  ngOnInit(): void {
    this.defenseScheduleService.getSupervisorsDefenseAssignment().pipe(takeUntil(this.unsubscribe$)).subscribe(
      assignments => this.assignments = assignments
    )

    this.defenseScheduleService.getSupervisorsStatistics().pipe(takeUntil(this.unsubscribe$)).subscribe(
      statistics => this.statistics = statistics
    )
  }

  onStatisticsUpdated(statistics: SupervisorStatistics[]){
    this.statistics = statistics;
  }

  getDefenseSummary(){
    this.defenseScheduleService.getDefenseSummary().pipe(takeUntil(this.unsubscribe$)).subscribe(
      (file: HttpResponse<Blob>) => {
        if(file?.body){
          saveAs(file.body!, 'summary.pdf')
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }

}
