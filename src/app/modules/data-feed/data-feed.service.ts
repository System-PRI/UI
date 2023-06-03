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
export class DataFeedService {
    constructor(private http: HttpClient) { }

    importStudents(students: FormData): Observable<null> {
        return this.http
            .post<FormData>(`/apigateway/data/import/student`, students)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }
}