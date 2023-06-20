import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExternalLinkService } from '../../external-link.service';
import { ExternalLinkData, ExternalLinkFilters } from '../../models/external-link.model';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'external-link-list',
  templateUrl: './external-link-list.component.html',
  styleUrls: ['./external-link-list.component.scss']
})
export class ExternalLinkListComponent implements OnInit, OnDestroy {
  columns: string[] = [];
  initialColumns: string[] = ['projectName'];
  externalLinkColumnHeaders: string[] = [];
  externalLinks!: MatTableDataSource<ExternalLinkData>
  unsubscribe$ = new Subject();

  @Input() role!: string;

  constructor(private externalLinkService: ExternalLinkService){}

  ngOnInit(): void {
    if(this.role === 'COORDINATOR'){
      this.initialColumns.push('supervisor')
    }

    this.externalLinkService.columnHeaders$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      columnHeaders => this.externalLinkColumnHeaders = columnHeaders
    )

    combineLatest([
      this.externalLinkService.externalLinkDataList$,
      this.externalLinkService.filters$
    ]).pipe(takeUntil(this.unsubscribe$)).subscribe(
      ([list, filters]) => {
        let filteredList = this.filterExternalLinks(list, filters);
        this.externalLinks = new MatTableDataSource<ExternalLinkData>(filteredList);
        this.columns = [...this.initialColumns, ...this.externalLinkColumnHeaders]
      }
    )
  }

  filterExternalLinks(list: ExternalLinkData[], filters: ExternalLinkFilters): ExternalLinkData[] {
    return list.slice().filter(element => 
      ((element.projectName.toLowerCase().includes(filters.searchValue.toLowerCase()) || 
      element.supervisor.name.toLowerCase().includes(filters.searchValue.toLowerCase()))) &&
      (filters.supervisorIndexNumber ? element.supervisor.indexNumber === filters.supervisorIndexNumber : true)
    )
  }
 
  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }


}
