import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { Project, ProjectDetails } from "./models/project";
import { Supervisor } from "../user/models/supervisor.model";
import { SupervisorAvailability } from "./models/supervisor-availability.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    constructor(private http: HttpClient) { }

    getProjectDetails(id: string): Observable<ProjectDetails> {
        return this.http
            .get<ProjectDetails>(`/apigateway/project-details/${id}`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    loadProjects(): Observable<Project[]> {
        return this.http
            .get<Project[]>('/apigateway/project')
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    addProject(project: Project) {
        this.http
            .post<Project[]>('/apigateway/project', project)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            ).subscribe(() => { })
    }

    supervisors$: Observable<Supervisor[]> = this.http
        .get<Supervisor[]>('/apigateway/supervisor')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

    supervisorsAvailabilities$: Observable<SupervisorAvailability[]> = 
        this.http
            .get<SupervisorAvailability[]>('/apigateway/supervisor/availability')
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )


}