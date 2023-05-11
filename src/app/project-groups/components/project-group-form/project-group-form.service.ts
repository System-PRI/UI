import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { Student } from "../../models/student";

@Injectable({
    providedIn: 'root'
})
export class ProjectGroupFormService {
    constructor(private http: HttpClient) {}

    public students$: Observable<Student[]> = this.http
        .get<Student[]>('/apigateway/students')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
}