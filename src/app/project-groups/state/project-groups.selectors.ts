import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectGroupsState } from "./project-groups.state";

const getProjectGroupsFeatureState = createFeatureSelector<ProjectGroupsState>('project-groups');

export const getProjectGroups = createSelector(
    getProjectGroupsFeatureState,
    state => state.projectGroupsList
);

