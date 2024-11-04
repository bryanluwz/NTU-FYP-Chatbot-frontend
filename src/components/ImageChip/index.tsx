import React from "react";
import { Badge, Box, IconButton } from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import cx from "classnames";

import * as styles from "./style.scss";

interface ImageChipProps {
  blob: Blob;
  onDelete?: () => void;
  huge?: boolean;
}

export const ImageChip: React.FC<ImageChipProps> = ({
  blob: _blob,
  onDelete,
  huge = false,
}) => {
  const [blob, setBlob] = React.useState<Blob | undefined>(undefined);

  React.useEffect(() => {
    setBlob(_blob);
  }, [_blob]);

  const imageBox = React.useMemo(() => {
    return blob ? (
      onDelete ? (
        <Badge
          className={styles.badge}
          badgeContent={
            <IconButton onClick={onDelete}>
              <ClearIcon />
            </IconButton>
          }
        >
          <Box
            component={"img"}
            src={URL.createObjectURL(blob)}
            className={cx(styles.imageBox, { [styles.huge]: huge })}
          />
        </Badge>
      ) : (
        <Box
          component={"img"}
          src={URL.createObjectURL(blob)}
          className={cx(styles.imageBox, { [styles.huge]: huge })}
        />
      )
    ) : null;
  }, [blob, huge, onDelete]);

  return <>{imageBox}</>;
};
