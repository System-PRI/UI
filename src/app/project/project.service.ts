import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError } from "rxjs";
import { ProjectDetails } from "./models/project";

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
}