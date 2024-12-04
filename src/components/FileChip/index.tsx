import React from "react";

import { Badge, Icon, IconButton, Stack, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FileIcon from "./utils";
import cx from "classnames";

import * as styles from "./style.scss";

interface FileChipProps {
  file: File | string;
  filename?: string;
  onDelete?: () => void;
  huge?: boolean;
}

export const FileChip: React.FC<FileChipProps> = ({
  file: _file,
  filename,
  onDelete,
  huge = false,
}) => {
  const [file, setFile] = React.useState<File | string | undefined>(undefined);
  const [gettedFile, setGettedFile] = React.useState<File | undefined>(
    undefined
  );
  const [finalFile, setFinalFile] = React.useState<File | undefined>(undefined);

  React.useEffect(() => {
    setFile(_file);
  }, [_file]);

  React.useEffect(() => {
    if (file && typeof file === "string") {
      fetch(file)
        .then((response) => response.blob())
        .then((blob) => {
          setGettedFile(
            new File(
              [blob],
              filename || file.split("/").pop() || "defaultFilename",
              {
                type: blob.type,
              }
            )
          );
        });
    }
  }, [file, filename]);

  React.useEffect(() => {
    if (file instanceof File) {
      setFinalFile(file);
    } else if (gettedFile) {
      setFinalFile(gettedFile);
    }
  }, [gettedFile, file]);

  const fileBox = React.useMemo(() => {
    return finalFile ? (
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
              <FileIcon fileType={finalFile.type} />
            </Icon>
            <Typography variant="body1">{finalFile.name}</Typography>
          </Stack>
        </Badge>
      ) : (
        <Stack
          className={cx(styles.imageBox, { [styles.huge]: huge })}
          direction={"row"}
          gap={2}
        >
          <Icon>
            <FileIcon fileType={finalFile.type} />
          </Icon>
          <Typography variant="body1">{finalFile.name}</Typography>
        </Stack>
      )
    ) : null;
  }, [finalFile, huge, onDelete]);

  return <>{fileBox}</>;
};
