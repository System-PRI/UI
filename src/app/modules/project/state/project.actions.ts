import { createAction, props } from "@ngrx/store";
import { Project, ProjectFilters } from "../models/project";
import { SupervisorAvailability } from "../models/supervisor-availability.model";

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

export const addProject = createAction(
    '[ProjectForm] Add'
)

export const addProjectSuccess = createAction(
    '[ProjectForm API] Add Success',
    props<{ projects: Project[] }>()
)

export const addProjectsFailure = createAction(
    '[ProjectForm API] Add Fail',
    props<{ error: string }>()
)

export const updateProject = createAction(
    '[ProjectForm] Update'
)

export const updateProjectSuccess = createAction(
    '[ProjectForm API] Add Success',
    props<{ project: Project }>()
)

export const updateProjectsFailure = createAction(
    '[ProjectForm API] Add Fail',
    props<{ error: string }>()
)

export const loadSupervisorAvailability = createAction(
    '[SupervisorAvailability] Load'
)

export const loadSupervisorAvailabilitySuccess = createAction(
    '[SupervisorAvailability API] Load Success',
    props<{ supervisorAvailability: SupervisorAvailability[] }>()
)

export const loadSupervisorAvailabilityFailure = createAction(
    '[SupervisorAvailability API] Load Fail',
    props<{ error: string }>()
)

export const updateSupervisorAvailability = createAction(
    '[SupervisorAvailability] Update',
    props<{ supervisorAvailability: SupervisorAvailability[] }>()
)

export const updateSupervisorAvailabilitySuccess = createAction(
    '[SupervisorAvailability API] Update Success',
    props<{ supervisorAvailability: SupervisorAvailability[] }>()
)

export const updateSupervisorAvailabilityFailure = createAction(
    '[SupervisorAvailability API] Update Fail',
    props<{ error: string }>()
)

