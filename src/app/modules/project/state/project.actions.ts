import { createAction, props } from "@ngrx/store";
import { Project, ProjectFilters } from "../models/project";

export const loadProjects = createAction(
    '[ProjectList] Load'
)

export const loadProjectsSuccess = createAction(
    '[ProjectList API] Load Success',
    props<{ projects: Project[] }>()
)

export const loadProjectsFailure = createAction(
    '[ProjectList API] Load Fail',
    props<{ error: string }>()
)

export const filterProjects = createAction(
    '[ProjectList] Filter projects',
    props<{ filters: ProjectFilters }>()
)
