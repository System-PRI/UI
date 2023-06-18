import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DataFeedService {
    constructor(private http: HttpClient) { }

    uploadStudents(data: FormData): Observable<null>  {
        return this.http
            .post<null>(`/apigateway/data/import/student`, data)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    uploadSupervisors(data: FormData): Observable<null>  {
        return this.http
            .post<null>(`/apigateway/data/import/supervisor`, data)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }
}