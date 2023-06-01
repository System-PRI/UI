import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";

export const authenticate = createAction(
    '[Auth] Login',
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

export const accessTokenRefresh = createAction(
    '[Auth Token] Access Token Refresh',
)

export const accessTokenRefreshSuccess = createAction(
    '[Auth Token API] Access Token Refresh Success',
    props<{ token: string }>()
)

export const accessTokenRefreshFailure = createAction(
    '[Auth Token API] Access Token Refresh Failure',
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

