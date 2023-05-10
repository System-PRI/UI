import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { ProjectGroup } from "../../models/project-group";

@Injectable({
    providedIn: 'root'
})
export class ProjectGroupsService {
    constructor(private http: HttpClient) {}

    public projectGroups$: Observable<ProjectGroup[]> = this.http
        .get<ProjectGroup[]>('/apigateway/project-groups')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
}