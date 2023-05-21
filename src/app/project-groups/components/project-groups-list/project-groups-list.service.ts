import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, BehaviorSubject } from "rxjs";
import { ProjectGroup } from "../../models/project-group";
import { Supervisor } from "../../models/supervisor";

@Injectable({
    providedIn: 'root'
})
export class ProjectGroupsListService {
    constructor(private http: HttpClient) {
       this.loadProjectGroups()
    }

    projectGroupsSubject$ = new BehaviorSubject<ProjectGroup[]>([])
    projectGroups$ = this.projectGroupsSubject$.asObservable()

    loadProjectGroups(){
        this.http
        .get<ProjectGroup[]>('/apigateway/project-groups')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        ).subscribe(
            projectGroups => this.projectGroupsSubject$.next(projectGroups) 
        )
    }

    supervisors$: Observable<Supervisor[]> = this.http
        .get<Supervisor[]>('/apigateway/supervisors')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
    
}