import { Badge, Box, Icon, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

import ClearIcon from "@mui/icons-material/Clear";

import * as styles from "./style.scss";
import FileIcon from "./utils";

interface FileChipProps {
  file: File;
  onDelete: () => void;
}

export const FileChip: React.FC<FileChipProps> = ({
  file: _file,
  onDelete,
}) => {
  const [file, setFile] = React.useState<File | undefined>(undefined);

  React.useEffect(() => {
    setFile(_file);
  }, [_file]);

  const fileBox = React.useMemo(() => {
    return (
      file && (
        <Badge
          className={styles.badge}
          badgeContent={
            <IconButton onClick={onDelete}>
              <ClearIcon />
            </IconButton>
          }
        >
          <Stack className={styles.imageBox} direction={"row"} gap={2}>
            <Icon>
              <FileIcon fileType={file.type} />
            </Icon>
            <Typography variant="body1">{file.name}</Typography>
          </Stack>
        </Badge>
      )
    );
  }, [file, onDelete]);

  return <>{fileBox}</>;
};
