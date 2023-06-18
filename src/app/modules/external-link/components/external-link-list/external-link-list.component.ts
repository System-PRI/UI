import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExternalLinkService } from '../../external-link.service';
import { ExternalLinkData } from '../../models/external-link.model';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

@Component({
  selector: 'external-link-list',
  templateUrl: './external-link-list.component.html',
  styleUrls: ['./external-link-list.component.scss']
})
export class ExternalLinkListComponent implements OnInit, OnDestroy {
  columns: string[] = ['projectName', 'supervisor'];
  externalLinkColumnHeaders: string[] = [];
  externalLinks!: MatTableDataSource<ExternalLinkData>
  unsubscribe$ = new Subject();

  constructor(private externalLinkService: ExternalLinkService){}

  ngOnInit(): void {
    this.externalLinkService.externalLinkDataList$.subscribe(
      externalLinkDataList =>  {
        this.externalLinks = new MatTableDataSource<ExternalLinkData>(externalLinkDataList);
        this.externalLinkColumnHeaders = externalLinkDataList[0].externalLinks.map(externalLink => externalLink.columnHeader);
        this.columns = [...this.columns, ...this.externalLinkColumnHeaders]
      }
      
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete()
  }


}
