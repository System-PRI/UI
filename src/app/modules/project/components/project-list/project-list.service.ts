import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, BehaviorSubject, take } from "rxjs";
import { Project } from "../../models/project";
import { Supervisor } from "../../models/supervisor";

@Injectable({
    providedIn: 'root'
})
export class ProjectListService {
    constructor(private http: HttpClient) { }

    loadProjects(): Observable<Project[]> {
        return this.http
            .get<Project[]>('/apigateway/project-groups')
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    addProject(project: Project) {
        this.http
            .post<Project[]>('/apigateway/project-groups', project)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            ).subscribe(() => { })
    }

    supervisors$: Observable<Supervisor[]> = this.http
        .get<Supervisor[]>('/apigateway/supervisors')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
}