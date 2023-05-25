import { Project } from '../models/project'
import * as AppState from '../../state/app.state';

export interface State extends AppState.State {
    projectModule: ProjectState
}

export interface ProjectState {
    projects: Project[],
    supervisorsAvailability: []
}

export const initialState: ProjectState = {
    projects: [],
    supervisorsAvailability: []
}