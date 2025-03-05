import { ViewProps } from "react-native";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps extends ViewProps {
  avatar?: string;
}
export default function UserAvatar({ avatar, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage source={{ uri: avatar }} />
    </Avatar>
  );
}
