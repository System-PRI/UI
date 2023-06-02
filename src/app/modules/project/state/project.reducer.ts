import { createReducer, on } from '@ngrx/store';
import { filterProjects, loadProjectsSuccess, loadSupervisorAvailabilitySuccess, updateSupervisorAvailabilitySuccess } from './project.actions'
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
    on(filterProjects, (state, action): ProjectState => {
        return {
            ...state,
            filteredProjects: state.projects.slice().filter(
                project => 
                    (project.name.toLowerCase().includes(action.filters.searchValue) ||
                     project.supervisor.name.toLowerCase().includes(action.filters.searchValue))
                    &&
                    ((action.filters.acceptanceStatus !== undefined 
                        ? project.accepted === action.filters.acceptanceStatus 
                        : true)
                    &&
                    (action.filters.supervisorIndexNumber !== undefined
                        ? project.supervisor.indexNumber === action.filters.supervisorIndexNumber 
                        : true) )             
            )
        }
    }),
    on(loadSupervisorAvailabilitySuccess, (state, action): ProjectState => {
        return {
            ...state,
            supervisorsAvailability: action.supervisorAvailability
        }
    }),
    on(updateSupervisorAvailabilitySuccess, (state, action): ProjectState => {
        return {
            ...state,
            supervisorsAvailability: action.supervisorAvailability
        }
    }),
);