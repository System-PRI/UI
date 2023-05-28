import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";

export const loadUser = createAction(
    '[User] Load'
)

export const loadUserSuccess = createAction(
    '[User API] Load Success',
    props<{ user: User }>()
)

export const loadUserFailure = createAction(
    '[User API] Load Fail',
    props<{ error: string }>()
)
