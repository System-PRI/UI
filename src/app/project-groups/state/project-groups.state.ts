import { ProjectGroup } from '../models/project-group'
import * as AppState from '../../state/app.state';

export interface State extends AppState.State {
    projectGroups: ProjectGroupsState
}

export interface ProjectGroupsState {
    projectGroupsList: ProjectGroup[],
    supervisorsAvailability: []
}

export const initialState: ProjectGroupsState = {
    projectGroupsList: [],
    supervisorsAvailability: []
}