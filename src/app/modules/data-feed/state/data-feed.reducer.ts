import { createReducer, on } from '@ngrx/store';
import { addProjectSuccess, filterProjects, loadProjectsSuccess, loadSupervisorAvailabilitySuccess, updateProjectSuccess, updateSupervisorAvailabilitySuccess } from './project.actions'
import { initialState, ProjectState } from './project.state';
import { Project, ProjectDetails } from '../models/project';

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