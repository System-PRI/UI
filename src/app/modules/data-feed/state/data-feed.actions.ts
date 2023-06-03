import { createAction, props } from "@ngrx/store";

export const uploadStudents = createAction(
    '[DataFeed] Upload Students',
    props<{ studentsFile: FormData }>()
)

export const uploadStudentsSuccess = createAction(
    '[DataFeed API] Upload Students Success',
)

export const uploadStudentsFailure = createAction(
    '[DataFeed API] Upload Studets Fail',
    props<{ error: string }>()
)

export const uploadSupervisors = createAction(
    '[DataFeed] Upload Supervisors'
)

export const uploadSupervisorsSuccess = createAction(
    '[DataFeed API] Upload Supervisors Success',
    props<{ studentsFile: FormData }>()
)

export const uploadSupervisorsFailure = createAction(
    '[DataFeed API] Upload Supervisors Fail',
    props<{ error: string }>()
)