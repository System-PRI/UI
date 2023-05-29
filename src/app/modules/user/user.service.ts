import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, throwError, catchError, tap } from "rxjs";
import { User } from "./models/user.model";
import { State } from "src/app/app.state";
import { Store } from "@ngrx/store";
import { isLogged } from "./state/user.selectors";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient, private store: Store<State>) { }

    isUserLoggedIn = false;

    loadUser(): Observable<User> {
        return this.http
            .get<User>(`/apigateway/user`)
            .pipe(
                retry(3),
                tap(() => this.isUserLoggedIn = true),
                catchError(
                    (err: HttpErrorResponse) => throwError(() => err))
            )
    }

  


}