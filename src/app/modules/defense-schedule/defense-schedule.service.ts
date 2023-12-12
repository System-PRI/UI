import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { Project, ProjectDefense, ScheduleConfig, SupervisorAvailabilitySurvey, SupervisorDefenseAssignment, SupervisorDefenseAssignmentAggregated, SupervisorStatistics } from "./models/defense-schedule.model";

@Injectable({
    providedIn: 'root'
})
export class DefenseScheduleService {
    constructor(private http: HttpClient) { }

    getSupervisorAvailabilitySurvey(): Observable<SupervisorAvailabilitySurvey> {
        return this.http
            .get<SupervisorAvailabilitySurvey>(`/pri/schedule/availability/supervisor/1`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    getSupervisorsDefenseAssignment(): Observable<SupervisorDefenseAssignmentAggregated> {
        return this.http
            .get<SupervisorDefenseAssignmentAggregated>(`/pri/schedule/availability/supervisor`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    updateSupervisorDefenseAssignment(slots: {[key: string]: SupervisorDefenseAssignment}): Observable<null> {
        return this.http
            .put<null>(`/pri/schedule/availability/supervisor/1`, slots)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    getSupervisorsStatistics(): Observable<SupervisorStatistics[]> {
        return this.http
            .get<SupervisorStatistics[]>(`/pri/schedule/availability/statistics`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }    

    getProjectDefenses(): Observable<ProjectDefense[]> {
        return this.http
            .get<ProjectDefense[]>(`/pri/schedule/defense`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    getProjects(): Observable<Project[]> {
        return this.http
            .get<Project[]>(`/pri/schedule/defense/projects`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    updateProjectDefense(projectDefenseId: string, projectId: string): Observable<null> {
    return this.http
        .patch<null>(`/pri/schedule/defense/${projectDefenseId}`, {projectId})
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
    }
    

    updateCommitteeSchedule(slots: {[key: string]: SupervisorDefenseAssignment}): Observable<SupervisorStatistics[]> {
        return this.http
            .put<SupervisorStatistics[]>(`/pri/schedule/availability/supervisor`, slots)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }    

    setScheduleConfig(config: ScheduleConfig): Observable<null> {
        return this.http
            .post<null>(`/pri/schedule/config`, config)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    } 

    
}