import { Component, OnDestroy, OnInit, Input, OnChanges } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Supervisor } from 'src/app/modules/user/models/supervisor.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { changeFilters } from '../../state/project.actions';
import { getFilters } from '../../state/project.selectors';
import { UserService } from 'src/app/modules/user/user.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'project-filters',
  templateUrl: './project-filters.component.html',
  styleUrls: ['./project-filters.component.scss']
})
export class ProjectFiltersComponent implements OnInit, OnChanges, OnDestroy {
  allColumns: string[] = [
    'name',
    'supervisorName',
    'accepted',
    'firstSemesterGrade',
    'secondSemesterGrade',
    'criteriaMetStatus',
    'defenseDay',
    'evaluationPhase',
    'classroom',
    'committee',
    'students',
  ];
  predefinedViews = [
    {
      id: 'PROJECT_GROUPS',
      name: 'Project groups',
      columns: [
        'name',
        'supervisorName',
        'accepted',
      ]
    },
    {
      id: 'GRADES',
      name: 'Grades',
      columns: [
        'name',
        'supervisorName',
        'evaluationPhase',
        'firstSemesterGrade',
        'secondSemesterGrade',
        'criteriaMetStatus',
      ]
    },
    {
      id: 'DEFENSE_SCHEDULE',
      name: 'Defense schedule',
      columns: [
        'name',
        'supervisorName',
        'defenseDay',
        'evaluationPhase',
        'classroom',
        'committee',
        'students',
      ]
    },
    {
      id: 'ALL',
      name: 'All columns',
      columns: []
    },
  ]
  displayedColumns: string[] = [];
  selectedView =  this.predefinedViews.find(view => view.id === 'ALL')
  supervisors$!: Observable<Supervisor[]>
  unsubscribe$ = new Subject()
  @Input() externalLinkColumnHeaders!: string[];

  searchValue: string = '';
  supervisorIndexNumber!: string | undefined;
  acceptanceStatus!: boolean | undefined;
  criteriaMetStatus: boolean | undefined;

  constructor(
    private userService: UserService, 
    private store: Store<State>,
  ){}

  ngOnInit(): void {
    this.supervisors$ = this.userService.supervisors$;

    this.store.select(getFilters).pipe(takeUntil(this.unsubscribe$)).subscribe(
      filters => {
        this.searchValue = filters.searchValue;
        this.supervisorIndexNumber = filters.supervisorIndexNumber;
        this.acceptanceStatus = filters.acceptanceStatus;
        this.displayedColumns = filters.columns;
      }
    )
  }

  ngOnChanges(): void {
    this.allColumns = [...this.allColumns, ...this.externalLinkColumnHeaders]
    this.predefinedViews.find(view => view.id === 'PROJECT_GROUPS')!.columns = 
      [...this.predefinedViews.find(view => view.id === 'PROJECT_GROUPS')!.columns, ...this.externalLinkColumnHeaders]
    this.predefinedViews.find(view => view.id === 'ALL')!.columns = this.allColumns;
    this.displayedColumns = this.predefinedViews.find(view => view.id === 'ALL')!.columns;
    this.onFiltersChange();
  }

  onViewChange(event: MatSelectChange){
    this.displayedColumns = event.value.columns;
    this.onFiltersChange();
  }

  onFiltersChange(){
    this.store.dispatch(changeFilters({filters: {
      searchValue: this.searchValue,
      supervisorIndexNumber: this.supervisorIndexNumber,
      acceptanceStatus: this.acceptanceStatus,
      columns: this.displayedColumns,
      criteriaMetStatus: this.criteriaMetStatus
    }}))
  }

  resetFilters(){
    this.searchValue = '';
    this.acceptanceStatus = undefined;
    this.supervisorIndexNumber = undefined;
    this.criteriaMetStatus = undefined;
    this.onFiltersChange()
  }

  isAnyFilterActive(): boolean {
    return (
      this.searchValue !== '' || 
      this.supervisorIndexNumber !== undefined || 
      this.acceptanceStatus !== undefined ||
      this.criteriaMetStatus !== undefined
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }
}
