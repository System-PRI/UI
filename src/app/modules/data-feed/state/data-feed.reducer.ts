import { createReducer, on } from '@ngrx/store';
import { loadProjectsSuccess } from './project.actions'
import { initialState, ProjectState } from './project.state';
import { uploadStudentsSuccess } from './data-feed.actions';

export const dataFeedReducer = createReducer(
    initialState,
    on(uploadStudentsSuccess, (state, action): ProjectState => {
        return {
            ...state
        }
    }),
 
);