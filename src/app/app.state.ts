import { ProjectState } from "./modules/project/state/project.state";
import { UserState } from "./user/user.state";

export interface State {
    projects: ProjectState,
    user: UserState
}