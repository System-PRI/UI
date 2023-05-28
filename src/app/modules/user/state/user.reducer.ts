import { createReducer, on } from '@ngrx/store';
import { initialState } from './user.state';
import { loadUserSuccess } from './user.actions';
import { User } from '../models/user.model';

export const userReducer = createReducer(
    initialState,
    on(loadUserSuccess, (state, action): User => {
        return {
            ...state,
            ...action.user
        }
    })
);