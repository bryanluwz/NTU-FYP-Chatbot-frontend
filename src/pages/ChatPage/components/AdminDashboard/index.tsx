// Forgive me for this long ass file, I will not be refactoring it

import {
  Chip,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
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
import {
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckIcon from "@mui/icons-material/Check";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { EditUserDialog } from "../../../../components/EditUserDialog";

import { capitalize } from "../../../../utils";
import { RoleChip } from "../../../../components/RoleChip";
import { UsernameChip } from "../../../../components/UsernameChip";
import { useChatPageStore } from "../../../../zustand/apis/ChatPage";

export const AdminDashboard: React.FC = () => {
  const [data, setData] = React.useState<UserInfoModel[]>([]);
  const { userInfo } = useChatPageStore();
  const { getUserList, userList, updateUser, deleteUser } = useDashboardStore();

  React.useEffect(() => {
    getUserList();
  }, []);

  React.useEffect(() => {
    setData(userList);
  }, [userList]);

  // Handle Edit and Delete and Role update
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editUserId, setEditUserId] = React.useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteUserId, setDeleteUserId] = React.useState("");

  const [isRolePopupOpen, setIsRolePopupOpen] = React.useState(false);
  const [rolePopupUserId, setRolePopupUserId] = React.useState("");
  const [rolePopupRole, setRolePopupRole] = React.useState<UserRoleEnum>(
    UserRoleEnum.User
  );
  const [rolePopupAnchorEl, setRolePopupAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const [isConfirmRoleModalOpen, setIsConfirmRoleModalOpen] =
    React.useState(false);

  // Open edit modal
  const handleEditOpen = (userId: string) => {
    setIsEditModalOpen(true);
    setEditUserId(userId);
  };

  // Close edit modal
  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditUserId("");
  };

  // Delete user
  const handleDeleteOpen = (userId: string) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const handleDeleteClose = () => {
    setIsDeleteModalOpen(false);
  };

  // Update user role
  const handleRoleOpen = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    setRolePopupAnchorEl(event.currentTarget as unknown as HTMLElement);
    setRolePopupUserId(id);
    setIsRolePopupOpen(true);
  };

  const handleRoleUpdate = (role: UserRoleEnum) => {
    setRolePopupRole(role);
    setIsConfirmRoleModalOpen(true);
  };

  // Sorting, filtering and searching
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });
  const [roleFilter, setRoleFilter] = React.useState<UserRoleEnum | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentSearchField, setCurrentSearchField] =
    React.useState<string>("");

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    field: string
  ) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
    setCurrentSearchField(field); // Set whether it is username, email, or role
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Sort by username and email
  const sortData = (data: UserInfoModel[]) => {
    // Default sorting by role and username if no sorting is applied
    if (!sortConfig.direction && !searchTerm && roleFilter === "all") {
      return data.sort((a, b) => {
        const roleOrder = {
          [UserRoleEnum.Admin]: 0,
          [UserRoleEnum.Educator]: 1,
          [UserRoleEnum.User]: 2,
        };

        // Sort by role first, then by username alphabetically
        return (
          roleOrder[a.role] - roleOrder[b.role] ||
          a.username.localeCompare(b.username)
        );
      });
    }

    // If sorting is applied, proceed with the custom sorting logic
    if (sortConfig.direction === null) {
      return data;
    }

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof UserInfoModel];
      const bValue = b[sortConfig.key as keyof UserInfoModel];

      if (!aValue || !bValue) return 0;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortedData;
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => sortData(data), [data, sortConfig]);

  // Filter by role
  const filteredData = React.useMemo(() => {
    if (roleFilter === "all") return sortedData;
    return sortedData.filter((user) => user.role === roleFilter);
  }, [sortedData, roleFilter]);

  const searchedData = React.useMemo(() => {
    if (!searchTerm) return filteredData;
    return filteredData.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [filteredData, searchTerm]);

  // Handle Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    setPage(0);
  }, [searchedData, rowsPerPage, searchTerm, roleFilter, sortConfig]);

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <div className={dashboardStyles.dashboardCardContainer}>
        <Typography variant="h5">Admin Dashboard</Typography>

        <TableContainer>
          <Table>
            {/* Headers */}
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "30%" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{ cursor: "pointer" }}
                  >
                    <Typography variant="h6">Username</Typography>
                    <Stack direction="row" alignItems="center">
                      <IconButton onClick={() => handleSort("username")}>
                        {sortConfig.key === "username" ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowDropUpIcon />
                          ) : sortConfig.direction === "desc" ? (
                            <ArrowDropDownIcon />
                          ) : (
                            <SortIcon />
                          )
                        ) : (
                          <SortIcon />
                        )}
                      </IconButton>

                      <IconButton
                        onClick={(event) =>
                          handlePopoverOpen(event, "username")
                        }
                      >
                        <Search />
                      </IconButton>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: "30%" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{ cursor: "pointer" }}
                  >
                    <Typography variant="h6">Email</Typography>
                    <Stack direction="row" alignItems="center">
                      <IconButton onClick={() => handleSort("email")}>
                        {sortConfig.key === "email" ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowDropUpIcon />
                          ) : sortConfig.direction === "desc" ? (
                            <ArrowDropDownIcon />
                          ) : (
                            <SortIcon />
                          )
                        ) : (
                          <SortIcon />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={(event) => handlePopoverOpen(event, "email")}
                      >
                        <Search />
                      </IconButton>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: "20%" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{ cursor: "pointer" }}
                  >
                    <Typography variant="h6">Role</Typography>
                    <IconButton
                      onClick={(event) => handlePopoverOpen(event, "role")}
                    >
                      <FilterAltIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: "20%" }}>
                  <Typography variant="h6">Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <UsernameChip userInfo={user} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <RoleChip
                        role={user.role}
                        id={user.id}
                        handleOpen={handleRoleOpen}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {user.id !== userInfo.id && (
                          <>
                            <Chip
                              clickable
                              label="Edit"
                              color="warning"
                              deleteIcon={<EditIcon />}
                              onClick={() => handleEditOpen(user.id)}
                              onDelete={() => handleEditOpen(user.id)}
                            />
                            <Chip
                              clickable
                              variant="filled"
                              color="error"
                              label="Delete"
                              onClick={() => {
                                handleDeleteOpen(user.id);
                              }}
                              onDelete={() => {
                                handleDeleteOpen(user.id);
                              }}
                              deleteIcon={<DeleteIcon />}
                            />
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    10,
                    25,
                    50,
                    100,
                    { label: "All", value: -1 },
                  ]}
                  colSpan={10}
                  count={searchedData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
      {/* Popup */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {currentSearchField === "username" && (
          <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Username"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {currentSearchField === "email" && (
          <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Email"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {currentSearchField === "role" && (
          <>
            {[...Object.values(UserRoleEnum), "all"].map((role) => (
              <MenuItem
                key={role}
                component="li"
                onClick={() => {
                  if (role === roleFilter) {
                    setRoleFilter("all");
                  } else {
                    setRoleFilter(role as UserRoleEnum | "all");
                  }
                }}
              >
                <Stack
                  width={"100%"}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <ListItemText primary={capitalize(role)} />
                  <ListItemIcon
                    style={{
                      visibility: roleFilter === role ? "visible" : "hidden",
                    }}
                  >
                    <CheckIcon />
                  </ListItemIcon>
                </Stack>
              </MenuItem>
            ))}
          </>
        )}
      </Popover>
      <Popover
        open={isRolePopupOpen}
        anchorEl={rolePopupAnchorEl}
        onClose={() => {
          setIsRolePopupOpen(false);
        }}
      >
        <>
          {[...Object.values(UserRoleEnum)].map((role) => (
            <MenuItem
              key={role}
              component="li"
              onClick={() => {
                if (
                  role ===
                  data.find((user) => user.id === rolePopupUserId)?.role
                ) {
                  // Do nothing
                } else {
                  handleRoleUpdate(role);
                }
              }}
            >
              <Stack
                width={"100%"}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <ListItemText primary={capitalize(role)} />
                <ListItemIcon
                  style={{
                    visibility:
                      data.find((user) => user.id === rolePopupUserId)?.role ===
                      role
                        ? "visible"
                        : "hidden",
                  }}
                >
                  <CheckIcon />
                </ListItemIcon>
              </Stack>
            </MenuItem>
          ))}
        </>
      </Popover>
      {/* Modal aka Dialog */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={[
          "Delete",
          <UsernameChip
            userInfo={data.find((user) => user.id === deleteUserId)}
          />,
          "?",
        ]}
        onCancel={handleDeleteClose}
        onConfirm={() => {
          const user = data.find((user) => user.id === deleteUserId);
          if (user) {
            deleteUser(user);
          }
          setDeleteUserId("");
          handleDeleteClose();
        }}
      />

      <ConfirmModal
        isOpen={isConfirmRoleModalOpen}
        title={[
          "Update",
          <UsernameChip
            userInfo={data.find((user) => user.id === rolePopupUserId)}
          />,
          "to",
          <RoleChip role={rolePopupRole} />,
          "?",
        ]}
        onCancel={() => {
          setIsConfirmRoleModalOpen(false);
        }}
        onConfirm={() => {
          setIsRolePopupOpen(false);
          setRolePopupUserId("");
          setRolePopupRole(UserRoleEnum.User);
          setIsConfirmRoleModalOpen(false);
          const user = data.find((user) => user.id === rolePopupUserId);
          if (user) {
            updateUser({ ...user, role: rolePopupRole, avatar: undefined });
          }
        }}
      />

      <EditUserDialog
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        userInfo={data.find((user) => user.id === editUserId)}
        onSubmit={(userInfo) => {
          updateUser({ ...userInfo });
          handleEditClose();
        }}
        editorRole={UserRoleEnum.Admin}
      />
    </div>
  );
};
