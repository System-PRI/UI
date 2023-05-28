import { createFeatureSelector, createSelector } from "@ngrx/store";
import { User } from "../models/user.model";

const getUserState = createFeatureSelector<User>('user');

export const getUser = createSelector(
    getUserState,
    state => state
);

