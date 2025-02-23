import { useSession } from "@/state/session";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import Spacer from "../ui/spacer";
import { useProfileQuery, useProfilesQuery } from "@/state/queries/profile";
import { useMemo, useState } from "react";
import { AppBskyActorDefs } from "@atproto/api";

function AccountItem({
  profile,
}: {
  profile?: AppBskyActorDefs.ProfileViewDetailed;
}) {
  return (
    <>
      <CardContent className="flex-1 items-start">
        <Button variant="ghost" className="pl-0 pr-2 w-full  justify-start">
          <Avatar>
            <AvatarImage src={profile?.avatar} />
          </Avatar>
          <CardTitle className="leading-0">{profile?.displayName}</CardTitle>
          <CardDescription>{profile?.handle}</CardDescription>
          <Spacer />
          <Button.Icon name="arrow.forward" size={14} />
        </Button>
      </CardContent>
    </>
  );
}

export default function AccountList() {
  const { accounts } = useSession();

  const [pendingDid, setPendingDid] = useState(accounts[0].did ?? "");
  const { data: profiles } = useProfilesQuery({
    handles: accounts.map((acc) => acc.did),
  });

  return (
    <Card className="pt-3">
      {accounts.map((acc, i) => {
        const profile = profiles?.profiles.find((p) => p.did === acc.did);
        return <AccountItem key={i} profile={profile} />;
      })}
      <CardContent className="flex-1 items-start">
        <Button
          // onPress={() => setAddAccount(!addAccount)}
          variant="ghost"
          className="pl-0 pr-2 w-full  justify-start"
        >
          <Avatar className="items-center justify-center">
            <Button.Icon name="plus" size={18} />
          </Avatar>
          <CardDescription>Other account</CardDescription>
          <Spacer />
          <Button.Icon name="arrow.forward" size={14} />
        </Button>
      </CardContent>
    </Card>
  );
}
