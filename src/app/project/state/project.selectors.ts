import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectState } from "./project.state";

const getProjectFeatureState = createFeatureSelector<ProjectState>('project');

export const getProjects = createSelector(
    getProjectFeatureState,
    state => state.projects
);

