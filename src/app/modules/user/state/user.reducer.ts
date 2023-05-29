import { createReducer, on } from '@ngrx/store';
import { UserState, initialState } from './user.state';
import { loadUserSuccess } from './user.actions';

export const userReducer = createReducer(
    initialState,
    on(loadUserSuccess, (state, action): UserState => {
        localStorage.setItem('user', JSON.stringify(action.user))
        return {
            ...state,
            ...action.user,
            logged: true,
        }
    })
);