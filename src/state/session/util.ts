import { jwtDecode } from "jwt-decode";

import * as persisted from "@/state/persisted";
import { SessionAccount } from "./types";
import { hasProp } from "@/lib/type-guards";

export function readLastActiveAccount() {
  const { currentAccount, accounts } = persisted.get("session");
  return accounts.find((a) => a.did === currentAccount?.did);
}

export function isSignupQueued(accessJwt: string | undefined) {
  if (accessJwt) {
    const sessData = jwtDecode(accessJwt);
    return (
      hasProp(sessData, "scope") &&
      sessData.scope === "com.atproto.signupQueued"
    );
  }
  return false;
}

export function isSessionExpired(account: SessionAccount) {
  try {
    if (account.accessJwt) {
      const decoded = jwtDecode(account.accessJwt);
      if (decoded.exp) {
        const didExpire = Date.now() >= decoded.exp * 1000;
        return didExpire;
      }
    }
  } catch (e) {
    // logger.error(`session: could not decode jwt`);
  }
  return true;
}
