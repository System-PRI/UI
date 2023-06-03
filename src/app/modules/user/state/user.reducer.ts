import { createReducer, on } from '@ngrx/store';
import { UserState, initialState } from './user.state';
import { loadUserSuccess, changeStudentRoleToProjectAdmin } from './user.actions';
import { acceptProjectSuccess, changeAdminSuccess } from '../../project/state/project.actions';

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
    on(changeAdminSuccess, (state): UserState => {
        return {
            ...state,
            role: state.role === 'PROJECT_ADMIN' ? 'STUDENT' : state.role
        }
    }),
    on(acceptProjectSuccess, (state, action): UserState => {
        return {
            ...state,
            acceptedProjects: [...state.acceptedProjects, action.projectId]
        }
    }),

    
);