import { createAction, props } from "@ngrx/store";
import { UserState } from "./user.state";

export const loadUser = createAction(
    '[User] Load'
)

export const loadUserSuccess = createAction(
    '[User API] Load Success',
    props<{ user: UserState }>()
)

export const loadUserFailure = createAction(
    '[User API] Load Fail',
    props<{ error: string }>()
)
