import { useMemo } from "react";
import { getRuntimeConfig } from "../config/env";

// PUBLIC_INTERFACE
export function useFeatureFlags() {
  /**
   * Access parsed feature flags, and an `isEnabled(flag)` helper.
   */
  const cfg = getRuntimeConfig();
  const flags = useMemo(() => cfg.featureFlags || {}, [cfg.featureFlags]);

  const experimentsEnabled = cfg.experimentsEnabled;

  function isEnabled(flagName) {
    if (!flagName) return false;
    // If experiments are disabled, only allow flags that are explicitly true AND not prefixed with "exp:"
    const val = Boolean(flags[flagName]);
    if (!experimentsEnabled && String(flagName).startsWith("exp:")) return false;
    return val;
  }

  return { flags, experimentsEnabled, isEnabled };
}
