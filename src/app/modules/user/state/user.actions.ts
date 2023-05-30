import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";

export const authenticate = createAction(
    '[Auth] Authenticate',
    props<{ login: string, password: string }>()
)

export const authenticateSuccess = createAction(
    '[Auth API] Success',
    props<{ user: User, token: string }>()
)

export const authenticateFailure = createAction(
    '[Auth API] Fail',
    props<{ error: string }>()
)

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
