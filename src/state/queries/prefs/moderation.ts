import React from "react";
import {
  AtpAgent,
  DEFAULT_LABEL_SETTINGS,
  interpretLabelValueDefinitions,
} from "@atproto/api";

import { isNonConfigurableModerationAuthority } from "@/state/session/additional-moderation-authorities";
import { usePreferencesQuery } from ".";
import { useLabelersDetailedInfoQuery } from "../labeler";

/**
 * More strict than our default settings for logged in users.
 */
export const DEFAULT_LOGGED_OUT_LABEL_PREFERENCES: typeof DEFAULT_LABEL_SETTINGS =
  Object.fromEntries(
    Object.entries(DEFAULT_LABEL_SETTINGS).map(([key, _pref]) => [key, "hide"])
  );

export function useMyLabelersQuery({
  excludeNonConfigurableLabelers = false,
}: {
  excludeNonConfigurableLabelers?: boolean;
} = {}) {
  const prefs = usePreferencesQuery();
  let dids = Array.from(
    new Set(
      AtpAgent.appLabelers.concat(
        prefs.data?.moderationPrefs?.labelers?.map((l) => l.did) || []
      )
    )
  );
  if (excludeNonConfigurableLabelers) {
    dids = dids.filter((did) => !isNonConfigurableModerationAuthority(did));
  }
  const labelers = useLabelersDetailedInfoQuery({ dids });
  const isLoading = prefs.isLoading || labelers.isLoading;
  const error = prefs.error || labelers.error;
  return React.useMemo(() => {
    return {
      isLoading,
      error,
      data: labelers.data || [], // Ensure we always return an array
    };
  }, [labelers, isLoading, error]);
}

export function useLabelDefinitionsQuery() {
  const labelers = useMyLabelersQuery();

  return React.useMemo(() => {
    // Ensure labelers.data is an array, if undefined use empty array
    const labelersData = Array.isArray(labelers.data) ? labelers.data : [];

    return {
      labelDefs: Object.fromEntries(
        labelersData.map((labeler) => [
          labeler.creator.did,
          interpretLabelValueDefinitions(labeler),
        ])
      ),
      labelers: labelersData,
    };
  }, [labelers]);
}
