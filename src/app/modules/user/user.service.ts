import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, tap } from "rxjs";
import { User } from "./models/user.model";
import { State } from "src/app/app.state";
import { Store } from "@ngrx/store";
import { CookieService } from "ngx-cookie-service";

interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient, private cookieService: CookieService) { }

    loadUser(): Observable<User> {
        return this.http
            .get<User>(`/apigateway/user`, {
                headers: { Authorization: this.cookieService.get('token') }
            })
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

    authenticate(login: string, password: string): Observable<AuthResponse> {
        return this.http
            .post<AuthResponse>(`/apigateway/authenticate`, { login, password })
            .pipe(
                retry(3),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }




}