import { createReducer, on } from '@ngrx/store';
import {
    changeFilters,
    updateGrade,
    updateGradingPhase,
} from './project.actions'
import { initialState, ProjectState } from './project.state';
import { acceptProjectSuccess, addProjectSuccess, loadProjectsSuccess, loadSupervisorAvailabilitySuccess, removeProjectSuccess, unacceptProjectSuccess, updateProjectSuccess, updateSupervisorAvailabilitySuccess } from './project-api.actions';
import { Project } from '../models/project.model';

const filterProjectBySearchValue = (project: Project, searchValue: string): boolean => {
    return project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
           project.supervisor.name.toLowerCase().includes(searchValue.toLowerCase())
}

const filterProjectByAcceptanceStatus = (project: Project, acceptanceStatus?: boolean): boolean => {
    return acceptanceStatus !== undefined ? project.accepted === acceptanceStatus : true
}

const filterProjectBySupervisorIndexNumber = (project: Project, supervisorIndexNumber?: string): boolean => {
    return supervisorIndexNumber !== undefined ? project.supervisor.indexNumber === supervisorIndexNumber : true
}

const filterProjectByCriteriaMetStatus = (project: Project, criteriaMetStatus?: boolean): boolean => {
    return criteriaMetStatus !== undefined ? project.criteriaMet === criteriaMetStatus : true
}

export const projectReducer = createReducer(
    initialState,
    on(loadProjectsSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: action.projects,
            filteredProjects: action.projects
        }
    }),
    
    on(addProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            filteredProjects: [
                {
                    id: action.project.id,
                    name: action.project.name,
                    supervisor: action.project.supervisor,
                    accepted: action.userRole === 'COORDINATOR'
                },
                ...state.projects!
            ],
            projects: [
                {
                    id: action.project.id,
                    name: action.project.name,
                    supervisor: action.project.supervisor,
                    accepted: action.userRole === 'COORDINATOR'
                },
                ...state.projects!
            ]
        }
    }),
    on(updateProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: [...state.projects!].map(project => {
                if (project.id === action.project.id) {
                    return {
                        id: action.project.id,
                        name: action.project.name,
                        supervisor: action.project.supervisor,
                        accepted: action.project.accepted
                    }
                }
                return project;
            })
        }
    }),
    on(removeProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: [...state.projects!].filter(project => project.id !== action.projectId)
        }
    }),
    on(updateGradingPhase, (state, action): ProjectState => {
        return {
            ...state,
            projects: [...state.projects!].map(project => {
                if (project.id === action.projectId) {
                    return {
                        ...project,
                        evaluationPhase: action.phase
                    }
                }
                return project;
            })
        }
    }),
    on(acceptProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: [...state.projects!].map(project => {
                if (project.id === action.projectId) {
                    return {
                        ...project,
                        accepted: project.confirmed!
                    }
                }
                return project;
            })
        }
    }),
    on(unacceptProjectSuccess, (state, action): ProjectState => {
        return {
            ...state,
            projects: [...state.projects!].map(project => {
                if (project.id === action.projectId) {
                    return {
                        ...project,
                        accepted: false
                    }
                }
                return project;
            })
        }
    }),
    on(changeFilters, (state, action): ProjectState => {
        return {
            ...state,
            filters: action.filters,
            filteredProjects: 
                state.projects?.map((project) => {
                    return {
                        ...project,
                        supervisorName: project.supervisor.name, 
                    }
                }).filter( project => 
                    filterProjectBySearchValue(project, action.filters.searchValue) && 
                    (
                        filterProjectByAcceptanceStatus(project, action.filters.acceptanceStatus) &&
                        filterProjectBySupervisorIndexNumber(project, action.filters.supervisorIndexNumber) &&
                        filterProjectByCriteriaMetStatus(project, action.filters.criteriaMetStatus)
                    )             
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
    on(updateGrade, (state, action): ProjectState => {
        return {
            ...state,
            projects: [...state.projects!].map(project => {
                if (String(project.id) === String(action.projectId)) {
                    return {
                        ...project,
                        criteriaMet: action.criteriaMet,
                        firstSemesterGrade: action.semester === 'FIRST' ? action.grade : project.firstSemesterGrade,
                        secondSemesterGrade: action.semester === 'SECOND' ? action.grade : project.secondSemesterGrade
                    }
                }
                return project;
            }) 
        }
    })
);