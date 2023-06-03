import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DataFeedState } from "./data-feed.state";

const getDataFeedState = createFeatureSelector<DataFeedState>('data-feed');



