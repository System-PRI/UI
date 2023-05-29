import { createReducer, on } from '@ngrx/store';
import { UserState, initialState } from './user.state';
import { loadUserSuccess } from './user.actions';

export const userReducer = createReducer(
    initialState,
    on(loadUserSuccess, (state, action): UserState => {
        return {
            ...state,
            ...action.user,
            logged: true,
        }
    })
);