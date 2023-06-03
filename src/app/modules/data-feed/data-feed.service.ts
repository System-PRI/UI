import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DataFeedService {
    constructor(private http: HttpClient) { }

    uploadStudents(students: FormData): Observable<null>  {
        return this.http
            .post<null>(`/apigateway/data/import/student`, students)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    uploadSupervisors(supervisors: FormData): Observable<null>  {
        return this.http
            .post<null>(`/apigateway/data/import/supervisors`, supervisors)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }
}