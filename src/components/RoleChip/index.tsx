import React from "react";

import { capitalize, Chip } from "@mui/material";
import { UserRoleEnum } from "../../apis/enums";

interface RoleChipProps {
  role: UserRoleEnum;
  id?: string;
  handleOpen?: (
    event: React.MouseEvent<HTMLDivElement>,
    userId: string
  ) => void;
}

export const RoleChip: React.FC<RoleChipProps> = ({ role, id, handleOpen }) => {
  const [userRole, setUserRole] = React.useState<UserRoleEnum>(
    UserRoleEnum.User
  );

  React.useEffect(() => {
    setUserRole(role);
  }, [role]);

  const chip = React.useMemo(() => {
    return (
      <Chip
        clickable={id !== undefined}
        label={capitalize(userRole || "")}
        color={userRole === UserRoleEnum.Admin ? "info" : "default"}
        variant={role === UserRoleEnum.User ? "outlined" : "filled"}
        onClick={(event) => {
          if (id && handleOpen) {
            handleOpen(event, id);
          }
        }}
      />
    );
  }, [userRole, id, role, handleOpen]);

  return <>{chip}</>;
};
