import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Supervisor } from 'src/app/modules/user/models/supervisor.model';
import { ProjectService } from '../../project.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';
import { filterProjects } from '../../state/project.actions';

@Component({
  selector: 'project-filters',
  templateUrl: './project-filters.component.html',
  styleUrls: ['./project-filters.component.scss']
})
export class ProjectFiltersComponent implements OnInit {
  allColumns: string[] = ['name', 'supervisorName', 'accepted'];
  displayedColumns: string[] = ['name', 'supervisorName', 'accepted'];
  supervisors$!: Observable<Supervisor[]>
  @Output() updateDisplayedColumnsEvent = new EventEmitter<string[]>();

  searchValue: string = '';
  supervisorIndexNumber!: string | undefined;
  acceptanceStatus!: boolean | undefined;

  constructor(private projectService: ProjectService, private store: Store<State>){}

  ngOnInit(): void {
    this.supervisors$ = this.projectService.supervisors$;
  }

  onFiltersChange(){
    this.store.dispatch(filterProjects({filters: {
      searchValue: this.searchValue,
      supervisorIndexNumber: this.supervisorIndexNumber,
      acceptanceStatus: this.acceptanceStatus
    }}))
  }

  resetFilters(){
    this.searchValue = '';
    this.acceptanceStatus = undefined;
    this.supervisorIndexNumber = undefined;
    this.onFiltersChange()
  }

  isAnyFilterActive(): boolean {
    return (this.searchValue !== '' || this.supervisorIndexNumber !== undefined || this.acceptanceStatus !== undefined)
  }
}
