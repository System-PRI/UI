import * as AppState from '../../../app.state';
import { User } from '../user.model';

export interface State extends AppState.State {
    user: User
}

export const initialState: User = {
    indexNumber: '',
    name: '',
    role: 'STUDENT',
    studyYears: [],
    projects: [],
    acceptedProjects: []

}