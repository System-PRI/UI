import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, tap } from "rxjs";
import { User } from "./models/user.model";

interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    loadUser(): Observable<User> {
        return this.http
            .get<User>(`/apigateway/user`)
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    authenticate(login: string, password: string): Observable<{token: string}> {
        return this.http
            .post<{token: string}>(`/apigateway/login`, { login, password })
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    refreshToken(): Observable<AuthResponse> {
        return this.http
            .get<AuthResponse>(`/apigateway/refresh`, { withCredentials: true })
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }
}