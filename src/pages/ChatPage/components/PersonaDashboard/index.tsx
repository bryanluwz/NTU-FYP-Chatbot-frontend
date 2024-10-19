// Forgive me for this long ass file, I will not be refactoring it
// Bruh fk me

import {
  Avatar,
  Button,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment, TextField, MenuItem, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CheckIcon from "@mui/icons-material/Check";
import { ConfirmModal } from "../../../../components/ConfirmModal";

import { capitalize } from "../../../../utils";
import { UsernameChip } from "../../../../components/UsernameChip";
import { usePersonaStore } from "../../../../zustand/apis/Persona";
import { PersonaModel } from "../../../../apis/Persona/typings";
import { EditPersonaDialog } from "../../../../components/EditPersonaDialog";
import { useChatPageStore } from "../../../../zustand/apis/ChatPage";
import { CreatePersonaDialog } from "../../../../components/CreatePersonaDialog";

export const PersonaDashboard: React.FC = () => {
  const [data, setData] = React.useState<PersonaModel[]>([]);

  const { userInfo } = useChatPageStore();

  const {
    postPersonaList,
    personaList,
    createPersona,
    updatePersona,
    deletePersona,
  } = usePersonaStore();

  React.useEffect(() => {
    postPersonaList();
  }, []);

  React.useEffect(() => {
    setData(personaList);
  }, [personaList]);

  // Handle Edit and Delete and Create
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editPersonaId, setEditPersonaId] = React.useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletePersonaId, setDeletePersonaId] = React.useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Open edit modal
  const handleEditOpen = (userId: string) => {
    setIsEditModalOpen(true);
    setEditPersonaId(userId);
  };

  // Close edit modal
  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditPersonaId("");
  };

  // Delete persona
  const handleDeleteOpen = (userId: string) => {
    setDeletePersonaId(userId);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const handleDeleteClose = () => {
    setIsDeleteModalOpen(false);
  };

  // Create persona
  const handleCreateOpen = () => {
    setIsCreateModalOpen(true);
  };

  // Close create modal
  const handleCreateClose = () => {
    setIsCreateModalOpen(false);
  };

  // Sorting, filtering and searching
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });

  const [searchTerm, setSearchTerm] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentSearchField, setCurrentSearchField] =
    React.useState<string>("");

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    field: string
  ) => {
    setAnchorEl(event.currentTarget as unknown as HTMLElement);
    setCurrentSearchField(field); // Set whether it is personaName or role
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Sort by personaName and email
  const sortData = (data: PersonaModel[]) => {
    // Default sorting by personaName if no sorting is applied
    if (!sortConfig.direction && !searchTerm) {
      return data.sort((a, b) => {
        // Sort by personaName alphabetically
        return a.personaName.localeCompare(b.personaName);
      });
    }

    // If sorting is applied, proceed with the custom sorting logic
    if (sortConfig.direction === null) {
      return data;
    }

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof PersonaModel];
      const bValue = b[sortConfig.key as keyof PersonaModel];

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

  // Vestigial code
  const filteredData = React.useMemo(() => {
    return sortedData;
  }, [sortedData]);

  const searchedData = React.useMemo(() => {
    if (!searchTerm) return filteredData;
    return filteredData.filter(
      (persona) =>
        persona.personaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.personaDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
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
  }, [searchedData, rowsPerPage, searchTerm, sortConfig]);

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <div className={dashboardStyles.dashboardCardContainer}>
        <Typography variant="h5">Persona Dashboard</Typography>
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
                    <Typography variant="h6">Persona Name</Typography>
                    <Stack direction="row" alignItems="center">
                      <IconButton onClick={() => handleSort("personaName")}>
                        {sortConfig.key === "personaName" ? (
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
                          handlePopoverOpen(event, "personaName")
                        }
                      >
                        <Search />
                      </IconButton>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell style={{ width: "50%" }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{ cursor: "pointer" }}
                  >
                    <Typography variant="h6">Description</Typography>
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
                        onClick={(event) =>
                          handlePopoverOpen(event, "description")
                        }
                      >
                        <Search />
                      </IconButton>
                    </Stack>
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
                .map((persona) => (
                  <TableRow key={persona.personaId}>
                    <TableCell>
                      <UsernameChip
                        userInfo={
                          {
                            username: persona.personaName,
                            avatar: persona.personaAvatar,
                          } as unknown as UserInfoModel
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {persona.personaDescription}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          clickable
                          label="Edit"
                          color="warning"
                          deleteIcon={<EditIcon />}
                          onClick={() => handleEditOpen(persona.personaId)}
                          onDelete={() => handleEditOpen(persona.personaId)}
                        />
                        <Chip
                          clickable
                          variant="filled"
                          color="error"
                          label="Delete"
                          onClick={() => {
                            handleDeleteOpen(persona.personaId);
                          }}
                          onDelete={() => {
                            handleDeleteOpen(persona.personaId);
                          }}
                          deleteIcon={<DeleteIcon />}
                        />
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
        <Button variant="contained" color="primary" onClick={handleCreateOpen}>
          Create Persona
        </Button>
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
        {currentSearchField === "personaName" && (
          <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Persona"
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

        {currentSearchField === "description" && (
          <TextField
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Description"
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
      </Popover>
      {/* Modal aka Dialog */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={[
          "Delete",
          <UsernameChip
            userInfo={
              (() => {
                const persona = data.find(
                  (persona) => persona.personaId === deletePersonaId
                );
                return {
                  username: persona?.personaName || "",
                  avatar: persona?.personaAvatar || "",
                };
              })() as unknown as UserInfoModel
            }
          />,
          "?",
        ]}
        onCancel={handleDeleteClose}
        onConfirm={() => {
          deletePersona(deletePersonaId);
          setDeletePersonaId("");
          handleDeleteClose();
        }}
      />

      <EditPersonaDialog
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        personaInfo={data.find(
          (persona) => persona.personaId === editPersonaId
        )}
        onSubmit={(personaInfo: PersonaModel) => {
          updatePersona({ ...personaInfo });
          handleEditClose();
        }}
        editorRole={userInfo.role}
      />

      <CreatePersonaDialog
        title="Creating Persona"
        isOpen={isCreateModalOpen}
        onClose={handleCreateClose}
        personaInfo={
          {
            personaId: "",
            personaName: "",
            personaDescription: "",
            personaAvatar: "",
          } as PersonaModel
        }
        onSubmit={(personaInfo: PersonaModel) => {
          createPersona(personaInfo);
          handleCreateClose();
        }}
        editorRole={userInfo.role}
      />
    </div>
  );
};
