import {
  Avatar,
  Chip,
  Stack,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const AdminDashboard: React.FC = () => {
  const [data, setData] = React.useState<UserInfoModel[]>([]);
  const { getUserList, userList } = useDashboardStore();

  React.useEffect(() => {
    getUserList();
  }, []);

  React.useEffect(() => {
    setData(userList);
  }, [userList]);

  // Handle Edit and Delete and Role update
  // Open edit modal
  const handleEditOpen = (id: string) => {
    console.log("Edit user with id: ", id);
  };

  // Close edit modal
  const handleEditClose = () => {
    console.log("Edit modal closed");
  };

  // Delete user
  const handleDeleteOpen = (id: string) => {
    console.log("Delete user with id: ", id);
  };

  // Close delete modal
  const handleDeleteClose = () => {
    console.log("Delete modal closed");
  };

  // Update user role
  const handleRoleUpdate = (id: string, role: UserRoleEnum) => {
    console.log("Update user role with id: ", id, " to ", role);
  };

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
                <TableCell>
                  <Typography variant="h6">Username</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Email</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Role</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Chip
                      avatar={
                        <Avatar src={user.avatar}>
                          {user.username.charAt(0)}
                        </Avatar>
                      }
                      label={
                        <Typography variant="body1">{user.username}</Typography>
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      clickable
                      label={
                        user.role.charAt(0).toLocaleUpperCase() +
                        user.role.slice(1)
                      }
                      color={
                        user.role === UserRoleEnum.Admin ? "info" : "default"
                      }
                      variant={
                        user.role === UserRoleEnum.User ? "outlined" : "filled"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        clickable
                        label="Edit"
                        color="warning"
                        deleteIcon={<EditIcon />}
                        // onClick={handleEditOpen} // why is this not a proper prop
                        onDelete={handleEditOpen}
                      />
                      <Chip
                        clickable
                        variant="filled"
                        color="error"
                        label="Delete"
                        // onClick={handleDeleteOpen}
                        onDelete={handleDeleteOpen}
                        deleteIcon={<DeleteIcon />}
                      />
                    </Stack>
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
