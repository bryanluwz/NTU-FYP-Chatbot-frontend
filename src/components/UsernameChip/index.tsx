import React from "react";

import { Avatar, Chip, Typography, TypographyVariant } from "@mui/material";
import { UserInfoModel } from "../../apis/ChatPage/typings";

interface UsernameChipProps {
  userInfo?: UserInfoModel;
  typographyVariant?: TypographyVariant;
}

export const UsernameChip: React.FC<UsernameChipProps> = ({
  userInfo,
  typographyVariant,
}) => {
  const [user, setUser] = React.useState<UserInfoModel | undefined>(undefined);

  React.useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  const chip = React.useMemo(() => {
    if (user) {
      return (
        <Chip
          avatar={<Avatar src={user.avatar}>{user.username.charAt(0)}</Avatar>}
          label={
            typographyVariant ? (
              <Typography variant={typographyVariant}>
                {user.username}
              </Typography>
            ) : (
              user.username
            )
          }
        />
      );
    }
  }, [user]);

  return <>{chip}</>;
};
