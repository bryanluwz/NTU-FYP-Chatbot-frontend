import React from "react";
import { SvgIcon } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description"; // PDF
import ImageIcon from "@mui/icons-material/Image"; // JPG, PNG
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // Other file types

// Mapping file types to icons
const fileTypeIcons: { [key: string]: React.ReactElement } = {
  "application/pdf": <DescriptionIcon />,
  "image/jpeg": <ImageIcon />,
  "image/png": <ImageIcon />,
  "image/gif": <ImageIcon />,
  "application/msword": <InsertDriveFileIcon />, // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
    <InsertDriveFileIcon />
  ), // DOCX
  "application/vnd.ms-excel": <InsertDriveFileIcon />, // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
    <InsertDriveFileIcon />
  ), // XLSX
  "application/zip": <InsertDriveFileIcon />, // ZIP
  // Add more types as needed
};

interface FileIconProps {
  fileType: string;
}

// FileIcon Component
const FileIcon: React.FC<FileIconProps> = ({ fileType }) => {
  return (
    <SvgIcon>{fileTypeIcons[fileType] || <InsertDriveFileIcon />} </SvgIcon>
  );
};

export default FileIcon;
