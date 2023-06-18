import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, tap } from "rxjs";
import { User } from "./models/user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    loadUser(): Observable<User> {
        return this.http
            .get<User>(`/apigateway/user` , { withCredentials: true })
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    logout(): Observable<null> {
        return this.http
            .get<null>(`/apigateway/auth/logout`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    authenticate(login: string, password: string): Observable<null> {
        return this.http
            .post<null>(`/apigateway/auth/login`, { login, password } , { withCredentials: true })
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    refreshToken(): Observable<null> {
        return this.http
            .post<null>(`/apigateway/auth/refresh`, null, { withCredentials: true })
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }
}