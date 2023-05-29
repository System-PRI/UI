import { Project, ProjectFilters } from '../models/project'
import * as AppState from '../../../app.state';
import { SupervisorAvailability } from '../models/supervisor-availability.model';

export interface State extends AppState.State {
    projectModule: ProjectState
}

export interface ProjectState {
    projects: Project[];
    filteredProjects: Project[];
    filters: ProjectFilters;
    supervisorsAvailability: SupervisorAvailability[];
}

export const initialState: ProjectState = {
    projects: [],
    filteredProjects: [],
    filters: {
        searchValue: '',
        supervisorIndexNumber: undefined,
        acceptanceStatus: undefined,
    },
    supervisorsAvailability: []
}