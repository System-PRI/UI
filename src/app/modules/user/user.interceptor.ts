import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { first, flatMap, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';

@Injectable()
export class UserInterceptor implements HttpInterceptor {
    constructor(private store: Store<State>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('user').pipe(
            first(),
            flatMap(user => {
                const modifiedReq = user.token
                    ? req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${user.token}`,
                            indexNumber: user.indexNumber,
                            studyYear: user.selectedStudyYear,
                            lang: user.lang
                        }
                    })
                    : req
                return next.handle(modifiedReq);
            })
        )
    }
}