import { createReducer, on } from '@ngrx/store';
import {  acceptProjectSuccess, addProjectSuccess, filterProjects, loadProjectsSuccess, loadSupervisorAvailabilitySuccess, updateProjectSuccess, updateSupervisorAvailabilitySuccess } from './project.actions'
import { initialState, ProjectState } from './project.state';
import { Project, ProjectDetails } from '../models/project';

function updateProject (projects: Project[], project: ProjectDetails): Project[] {
   return projects.map(p => {
        if(p.id === project.id){
            return {
                id: project.id,
                name: project.name,
                supervisor: project.supervisor,
                accepted: false
            }
        } 
        return p
    })
}

function acceptProject (projects: Project[], projectId: string, role: string): Project[] {
    if(role == 'SUPERVISOR'){
        return projects.map(p => {
            if(p.id === projectId){
                return {
                    ...p,
                    accepted: true
                }
            } 
            return p
        })
    }
    return projects;
}

function addProject (projects: Project[], project: ProjectDetails): Project[] {
    return [...projects, {
        id: project.id,
        name: project.name,
        supervisor: project.supervisor,
        accepted: false
    }]
 }
 

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
    on(addProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: addProject(state.projects, action.project),
            filteredProjects: addProject(state.projects, action.project)
        }
    }),
    on(updateProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: updateProject(state.projects, action.project),
            filteredProjects: updateProject(state.projects, action.project)
        }
    }),
    on(acceptProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: acceptProject(state.projects, action.projectId, action.role),
            filteredProjects: acceptProject(state.projects, action.projectId, action.role)
        }
    })
);