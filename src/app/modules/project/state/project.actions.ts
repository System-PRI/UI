import { createAction, props } from "@ngrx/store";
import { SupervisorAvailability } from "../models/supervisor-availability.model";
import { ProjectDetails, ProjectFilters } from "../models/project.model";

export const loadProjects = createAction(
    '[ProjectList] Load'
)

export const changeFilters = createAction(
    '[ProjectList] Change Filters',
    props<{ filters: ProjectFilters }>()
)

export const updateDisplayedColumns = createAction(
    '[ProjectList] Update Displayed Columns',
    props<{ columns: string[] }>()
)

export const updateGradingPhase = createAction(
    '[Project List] Update Grading Phase',
    props<{ projectId: string, phase: string }>()
)

export const addProject = createAction(
    '[ProjectForm] Add',
    props<{ project: ProjectDetails, userRole: string }>()
)

export const updateProject = createAction(
    '[ProjectForm] Update',
    props<{ project: ProjectDetails }>()
)

export const acceptProject = createAction(
    '[ProjectDetails] Accept Project',
    props<{ projectId: string, role: string }>()
)

export const unacceptProject = createAction(
    '[ProjectDetails] Unaccept Project',
    props<{ projectId: string, role: string }>()
)

export const removeProject = createAction(
    '[ProjectDetails] Remove Project',
    props<{ projectId: string}>()
)

export const updateGrade = createAction(
    '[Project Details] Update Grade',
    props<{ semester: string, projectId: string, grade: string, criteriaMet: boolean }>()
)

export const loadSupervisorAvailability = createAction(
    '[SupervisorAvailability] Load'
)

export const updateSupervisorAvailability = createAction(
    '[SupervisorAvailability] Update',
    props<{ supervisorAvailability: SupervisorAvailability[] }>()
)
