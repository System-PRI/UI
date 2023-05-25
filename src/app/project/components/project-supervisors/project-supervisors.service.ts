import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError} from "rxjs";
import { SupervisorAvailability } from "../../models/supervisor";

@Injectable({
    providedIn: 'root'
})
export class ProjectSupervisorsService {
    constructor(private http: HttpClient) { }

    supervisorsAvailability$: Observable<SupervisorAvailability[]> = 
        this.http
            .get<SupervisorAvailability[]>('/apigateway/supervisors-availability')
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
}  
