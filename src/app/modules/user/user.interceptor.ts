import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { first, flatMap, mergeMap, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/app.state';

@Injectable()
export class UserInterceptor implements HttpInterceptor {
    constructor(private store: Store<State>) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('user').pipe(
            first(),
            mergeMap(user => {
                const modifiedReq = req.clone({
                        setHeaders: {
                            "index-number": user.indexNumber,
                            "study-year": user.selectedStudyYear,
                            "lang": user.lang,
                        },
                });
                return next.handle(modifiedReq);
            })
        )
    }
}