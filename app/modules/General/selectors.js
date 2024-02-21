import { createSelector } from "reselect";
import { GENERAL } from "./constants";

const selectForGeneral = state => state[GENERAL];

export const generalSelector = createSelector(selectForGeneral, general => ({
  general
}));

// Selector for hooks
export const selectForGeneralData = () => state => state[GENERAL];
export const selectGeneralData = () =>
  createSelector(selectForGeneralData(), state => state);
