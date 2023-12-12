import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { SupervisorAvailabilitySurvey, SupervisorDefenseAssignmentAggregated } from "./models/defense-schedule.model";

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

    
}