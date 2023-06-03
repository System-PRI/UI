import { createReducer, on } from '@ngrx/store';
import { UserState, initialState } from './user.state';
import { authenticateSuccess, loadUserSuccess, accessTokenRefreshSuccess, changeStudentRoleToProjectAdmin } from './user.actions';

export const userReducer = createReducer(
    initialState,
    on(loadUserSuccess, (state, action): UserState => {
        return {
            ...state,
            ...action.user,
            logged: true,
            selectedStudyYear: action.user.studyYears[0],
        }
    }),
    on(changeStudentRoleToProjectAdmin, (state, action): UserState => {
        return {
            ...state,
            acceptedProjects: [action.projectId],
            role: 'PROJECT_ADMIN',
        }
    }),
    
);