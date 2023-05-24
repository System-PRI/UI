import { ProjectGroupsState } from "../project-groups/state/project-groups.state";

export interface State {
    studyingMode: 'daily' | 'extramural',
    projectGroups: ProjectGroupsState
}