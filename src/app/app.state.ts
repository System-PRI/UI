import { ProjectState } from "./modules/project/state/project.state";
import { User } from "./modules/user/models/user.model";

export interface State {
    projects: ProjectState,
    user: User
}