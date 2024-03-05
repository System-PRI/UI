import { createAction, props } from "@ngrx/store";
import { SupervisorAvailability } from "../models/supervisor-availability.model";
import { Project, ProjectDetails } from "../models/project.model";

export const loadProjectsSuccess = createAction(
    '[ProjectList API] Load Success',
    props<{ projects: Project[] }>()
)

export const loadProjectsFailure = createAction(
    '[ProjectList API] Load Fail',
    props<{ error: string }>()
)

export const addProjectSuccess = createAction(
    '[ProjectForm API] Add Success',
    props<{ project: ProjectDetails, userRole: string }>()
)

export const addProjectFailure = createAction(
    '[ProjectForm API] Add Fail',
    props<{ error: string }>()
)

export const updateProjectSuccess = createAction(
    '[ProjectForm API] Update Success',
    props<{ project: ProjectDetails }>()
)

export const updateProjectFailure = createAction(
    '[ProjectForm API] Update Fail',
    props<{ error: string }>()
)

export const acceptProjectSuccess = createAction(
    '[ProjectDetails API] Accept Project Success',
    props<{ projectId: string, role: string }>()
)

export const acceptProjectFailure = createAction(
    '[ProjectDetails API] Accept Project Fail',
    props<{ error: string }>()
)

export const unacceptProjectSuccess = createAction(
    '[ProjectDetails API] Unaccept Project Success',
    props<{ projectId: string, role: string }>()
)

export const unacceptProjectFailure = createAction(
    '[ProjectDetails API] Unaccept Project Fail',
    props<{ error: string }>()
)

export const removeProjectSuccess = createAction(
    '[ProjectDetails API] Remove Project Success',
    props<{ projectId: string}>()
)

export const removeProjectFailure = createAction(
    '[ProjectDetails API] Remove Project Fail',
    props<{ error: string }>()
)

export const loadSupervisorAvailabilitySuccess = createAction(
    '[SupervisorAvailability API] Load Success',
    props<{ supervisorAvailability: SupervisorAvailability[] }>()
)

export const loadSupervisorAvailabilityFailure = createAction(
    '[SupervisorAvailability API] Load Fail',
    props<{ error: string }>()
)

export const updateSupervisorAvailabilitySuccess = createAction(
    '[SupervisorAvailability API] Update Success',
    props<{ supervisorAvailability: SupervisorAvailability[] }>()
)

export const updateSupervisorAvailabilityFailure = createAction(
    '[SupervisorAvailability API] Update Fail',
    props<{ error: string }>()
)



