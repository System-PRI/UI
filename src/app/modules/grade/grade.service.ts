import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { Supervisor } from "../user/models/supervisor.model";
import { Grade } from "./models/grade";

@Injectable({
    providedIn: 'root'
})
export class GradeService {
    constructor(private http: HttpClient) { }

    grades$: Observable<Grade[]> = this.http
        .get<Grade[]>('/apigateway/grade')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

    supervisors$: Observable<Supervisor[]> = this.http
        .get<Supervisor[]>('/apigateway/user/supervisor')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )

}