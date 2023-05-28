import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { Student } from "src/app/modules/user/models/student.model";

@Injectable({
    providedIn: 'root'
})
export class ProjectFormService {
    constructor(private http: HttpClient) { }

    public students$: Observable<Student[]> = this.http
        .get<Student[]>('/apigateway/student')
        .pipe(
            retry(3),
            catchError(
                (err: HttpErrorResponse) => throwError(() => err))
        )
}