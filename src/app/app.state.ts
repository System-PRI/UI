import { ProjectState } from "./modules/project/state/project.state";
import { UserState } from "./modules/user/user.state";

export interface State {
    projects: ProjectState,
    user: UserState
}