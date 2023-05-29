import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProjectState } from "./project.state";

const getProjectFeatureState = createFeatureSelector<ProjectState>('project');

export const getFilteredProjects = createSelector(
    getProjectFeatureState,
    state => state.filteredProjects
);

