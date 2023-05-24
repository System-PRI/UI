import { createReducer, on, createAction } from '@ngrx/store';
import * as projectGroupsActions from './project-groups.actions'
import { initialState, ProjectGroupsState } from './project-groups.state';

export const projectGroupsReducer = createReducer(
    initialState,
    on(projectGroupsActions.loadProjectGroupsSuccess, (state, action): ProjectGroupsState => {
        return {
            ...state,
            projectGroupsList: action.projectGroups
        }
    })
);