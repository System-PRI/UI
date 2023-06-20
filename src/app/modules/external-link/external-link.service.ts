import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, BehaviorSubject } from "rxjs";
import { ExternalLink, ExternalLinkData, ExternalLinkFilters } from "./models/external-link.model";

@Injectable({
    providedIn: 'root'
})
export class ExternalLinkService {
    constructor(private http: HttpClient) {}

    filtersSubject$ = new BehaviorSubject<ExternalLinkFilters>({
        searchValue: '',
        supervisorIndexNumber: undefined
    })

    filters$ = this.filtersSubject$.asObservable();

    externalLinkDataList$: Observable<ExternalLinkData[]> = this.http
        .get<ExternalLinkData[]>(`/apigateway/project/external-link`)
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

    columnHeaders$: Observable<string[]> = this.http
        .get<string[]>(`/apigateway/project/external-link/column-headers`)
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

    getExternalLinks(projectId: string): Observable<ExternalLink[]> {
        return this.http
        .get<ExternalLink[]>(`/apigateway/project/${projectId}/external-link`)
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
    }

    setExternalLinks(projectId: string, externalLinks: ExternalLink[]): Observable<ExternalLink[]> {
        return this.http
            .put<ExternalLink[]>(`/apigateway/project/${projectId}/external-link`, externalLinks)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    updateFilters(filters: ExternalLinkFilters){
        this.filtersSubject$.next(filters);
    }
}