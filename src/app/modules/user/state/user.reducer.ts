import { createReducer, on } from '@ngrx/store';
import { UserState, initialState } from './user.state';
import { authenticateSuccess, loadUserSuccess } from './user.actions';

export const userReducer = createReducer(
    initialState,
    on(loadUserSuccess, (state, action): UserState => {
        return {
            ...state,
            ...action.user,
            logged: true,
        }
    }),
    on(authenticateSuccess, (state, action): UserState => {
        return {
            ...state,
            ...action.user,
            logged: true,
            selectedStudyYear: action.user.studyYears[0],
            token: action.token
        }
    })
);