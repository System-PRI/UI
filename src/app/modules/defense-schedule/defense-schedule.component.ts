import { Component, OnInit, OnDestroy, } from '@angular/core';
import { DefenseScheduleService } from './defense-schedule.service';
import { SupervisorDefenseAssignment, SupervisorDefenseAssignmentAggregated } from './models/defense-schedule.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'defense-schedule',
  templateUrl: './defense-schedule.component.html',
  styleUrls: ['./defense-schedule.component.scss']
})
export class DefenseScheduleComponent implements OnInit, OnDestroy {

  assignments: SupervisorDefenseAssignmentAggregated = {};
  unsubscribe$ = new Subject();

  constructor(private defenseScheduleyService: DefenseScheduleService){}

  ngOnInit(): void {
    this.defenseScheduleyService.getSupervisorsDefenseAssignment().pipe(takeUntil(this.unsubscribe$)).subscribe(
      assignments => {this.assignments = assignments}
    )
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }

}
