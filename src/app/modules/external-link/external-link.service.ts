import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { ExternalLink, ExternalLinkData } from "./models/external-link.model";

@Injectable({
    providedIn: 'root'
})
export class ExternalLinkService {
    constructor(private http: HttpClient) {}

    externalLinkDataList$: Observable<ExternalLinkData[]> = this.http
        .get<ExternalLinkData[]>(`/apigateway/external-link`)
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

    getExternalLinks(projectId: string): Observable<ExternalLink[]> {
        return this.http
        .get<ExternalLink[]>(`/apigateway/external-link/${projectId}`)
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
    }
}