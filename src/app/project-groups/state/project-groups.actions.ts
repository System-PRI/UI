import { createAction, props } from "@ngrx/store";
import { ProjectGroup } from "../models/project-group";

export const loadProjectGroups = createAction(
    '[ProjectGroupsList] Project Groups Load'
)

export const loadProjectGroupsSuccess = createAction(
    '[ProjectGroupsList API] Project Groups Load Success',
    props<{ projectGroups: ProjectGroup[] }>()
)

export const loadProjectGroupsFailure = createAction(
    '[ProjectGroupsList API] Project Groups Load Fail',
    props<{ error: string }>()
)
