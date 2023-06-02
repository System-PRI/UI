import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { Project, ProjectDetails } from "./models/project";
import { Supervisor } from "../user/models/supervisor.model";
import { SupervisorAvailability } from "./models/supervisor-availability.model";
import { Student } from "../user/models/student.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    constructor(private http: HttpClient) { }

    getProjectDetails(id: string): Observable<ProjectDetails> {
        return this.http
            .get<ProjectDetails>(`/apigateway/project/${id}`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    addProject(project: ProjectDetails): Observable<ProjectDetails> {
        return this.http
            .post<ProjectDetails>(`/apigateway/project`, project)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    updateProject(project: ProjectDetails): Observable<ProjectDetails>  {
        console.log(project)
        return this.http
            .put<ProjectDetails>(`/apigateway/project/${project.id}`, project)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    updateSupervisorAvailability(supervisorAvailability: SupervisorAvailability[]): Observable<SupervisorAvailability[]> {
        return this.http
            .put<SupervisorAvailability[]>('/apigateway/supervisor/availability', supervisorAvailability)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    projects$: Observable<Project[]> = this.http
        .get<Project[]>('/apigateway/project')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

    supervisors$: Observable<Supervisor[]> = this.http
        .get<Supervisor[]>('/apigateway/supervisor')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

     students$: Observable<Student[]> = this.http
        .get<Student[]>('/apigateway/student')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

    supervisorsAvailability$: Observable<SupervisorAvailability[]> = 
        this.http
            .get<SupervisorAvailability[]>('/apigateway/supervisor/availability')
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )


}