import { createReducer, on } from '@ngrx/store';
import { loadProjectsSuccess } from './project.actions'
import { initialState, ProjectState } from './project.state';

export const projectReducer = createReducer(
    initialState,
    on(loadProjectsSuccess, (state, action): ProjectState => {
        return {
            ...state,
            filteredProjects: action.projects,
            projects: action.projects
        }
    }),
 
);