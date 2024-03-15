import * as AppState from '../../../app.state';
import { Project, ProjectFilters } from '../models/project.model';
import { SupervisorAvailability } from '../models/supervisor-availability.model';

export interface State extends AppState.State {
    projectModule: ProjectState
}

export interface ProjectState { 
    filteredProjects: Project[] | undefined;
    projects: Project[] | undefined;
    filters: ProjectFilters;
    supervisorsAvailability: SupervisorAvailability[];
}

export const initialState: ProjectState = {
    filteredProjects: undefined,
    projects: undefined,
    filters: {
        searchValue: '',
        supervisorIndexNumber: undefined,
        acceptanceStatus: undefined,
        columns: ['name'],
        criteriaMetStatus: undefined,
    },
    supervisorsAvailability: []
}