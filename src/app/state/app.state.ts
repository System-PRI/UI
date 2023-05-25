import { ProjectState } from "../project/state/project.state";

export interface State {
    studyingMode: 'daily' | 'extramural',
    projects: ProjectState
}