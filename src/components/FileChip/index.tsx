import React from "react";

import { Badge, Icon, IconButton, Stack, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FileIcon from "./utils";
import cx from "classnames";

import * as styles from "./style.scss";

interface FileChipProps {
  file: File;
  onDelete?: () => void;
  huge?: boolean;
}

export const FileChip: React.FC<FileChipProps> = ({
  file: _file,
  onDelete,
  huge = false,
}) => {
  const [file, setFile] = React.useState<File | undefined>(undefined);

  React.useEffect(() => {
    setFile(_file);
  }, [_file]);

  const fileBox = React.useMemo(() => {
    return file ? (
      onDelete ? (
        <Badge
          className={styles.badge}
          badgeContent={
            <IconButton onClick={onDelete}>
              <ClearIcon />
            </IconButton>
          }
        >
          <Stack
            className={cx(styles.imageBox, { [styles.huge]: huge })}
            direction={"row"}
            gap={2}
          >
            <Icon>
              <FileIcon fileType={file.type} />
            </Icon>
            <Typography variant="body1">{file.name}</Typography>
          </Stack>
        </Badge>
      ) : (
        <Stack
          className={cx(styles.imageBox, { [styles.huge]: huge })}
          direction={"row"}
          gap={2}
        >
          <Icon>
            <FileIcon fileType={file.type} />
          </Icon>
          <Typography variant="body1">{file.name}</Typography>
        </Stack>
      )
    ) : null;
  }, [file, huge, onDelete]);

  return <>{fileBox}</>;
};
