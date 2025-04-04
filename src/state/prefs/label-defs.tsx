import React from "react";
import {
  AppBskyLabelerDefs,
  InterpretedLabelValueDefinition,
} from "@atproto/api";

import { useLabelDefinitionsQuery } from "../queries/prefs/moderation";

interface StateContext {
  labelDefs: Record<string, InterpretedLabelValueDefinition[]>;
  labelers: AppBskyLabelerDefs.LabelerViewDetailed[];
}

const initialState: StateContext = {
  labelDefs: {},
  labelers: [],
};

const stateContext = React.createContext<StateContext>(initialState);

export function Provider({ children }: React.PropsWithChildren<{}>) {
  const state = useLabelDefinitionsQuery();
  const value = React.useMemo(
    () => ({
      labelDefs: state.labelDefs || {},
      labelers: state.labelers || [],
    }),
    [state]
  );

  return (
    <stateContext.Provider value={value}>{children}</stateContext.Provider>
  );
}

export function useLabelDefinitions() {
  return React.useContext(stateContext);
}
