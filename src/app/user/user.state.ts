import * as AppState from '../app.state';

export interface State extends AppState.State {
    user: UserState
}

export interface UserState {
    id: string,
    studyYear: string[],
    isStudent: boolean,
    isSupervisor: boolean,
    isCoordinator: boolean,
    isProjectAdmin: boolean,
}

export const initialState: UserState = {
    id: '',
    studyYear: [],
    isStudent: false,
    isSupervisor: false,
    isCoordinator: false,
    isProjectAdmin: false,
}