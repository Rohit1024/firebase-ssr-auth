import { AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { User } from "firebase/auth";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "displayName" | "photoURL" | "email">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.photoURL ? (
        <AvatarImage alt="Picture" src={user.photoURL} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">
            {user.displayName ?? user.email?.at(0)?.toUpperCase()}
          </span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
