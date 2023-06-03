import * as AppState from '../../../app.state';
import { StudentOverview } from '../models/studentOverview';

export interface State extends AppState.State {
    dataFeedModule: DataFeedState
}

export interface DataFeedState {
    students: StudentOverview[];
}

export const initialState: DataFeedState = {
   students: []
}