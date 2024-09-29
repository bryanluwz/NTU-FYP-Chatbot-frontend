import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

import * as dashboardStyles from "../Dashboard/style.scss";
import { UserInfoModel } from "../../../../apis/ChatPage/typings";
import { UserRoleEnum } from "../../../../apis/enums";
import { useDashboardStore } from "../../../../zustand/apis/Dashboard";

export const AdminDashboard: React.FC = () => {
  const [data, setData] = React.useState<UserInfoModel[]>([]);
  const { getUserList, userList } = useDashboardStore();

  React.useEffect(() => {
    getUserList();
  }, []);

  React.useEffect(() => {
    setData(userList);
  }, [userList]);

  const sortData = (data: UserInfoModel[]) => {
    // Sort by role, UserRoleEnum.Admin, UserRoleEnum.Educator, UserRoleEnum.User
    // Then sort by username, email, etc.
    // Return the sorted data
    const sortedData = data.sort((a, b) => {
      const roleOrder = {
        [UserRoleEnum.Admin]: 0,
        [UserRoleEnum.Educator]: 1,
        [UserRoleEnum.User]: 2,
      };
      return (
        roleOrder[a.role] - roleOrder[b.role] ||
        a.username.localeCompare(b.username)
      );
    });
    return sortedData;
  };

  const sortedData = React.useMemo(() => sortData(data), [data]);

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <div className={dashboardStyles.dashboardCardContainer}>
        <Typography variant="h5">Admin Dashboard</Typography>
        <TableContainer>
          <Table>
            {/* Headers */}
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {/* Add a button to assign / remove user */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
