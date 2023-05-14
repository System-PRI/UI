import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, BehaviorSubject } from "rxjs";
import { ProjectGroup } from "../../models/project-group";

@Injectable({
    providedIn: 'root'
})
export class ProjectGroupsListService {
    constructor(private http: HttpClient) {
        this.projectGroups$.subscribe(
            projectGroups => this.projectGroupsSubject$.next(projectGroups) 
        )
    }

    projectGroupsSubject$ = new BehaviorSubject<ProjectGroup[]>([])

    public projectGroups$: Observable<ProjectGroup[]> = this.http
        .get<ProjectGroup[]>('/apigateway/project-groups')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
}