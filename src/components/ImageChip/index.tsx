import { Badge, Box, IconButton } from "@mui/material";
import React from "react";

import ClearIcon from "@mui/icons-material/Clear";

import * as styles from "./style.scss";

interface ImageChipProps {
  blob: Blob;
  onDelete: () => void;
}

export const ImageChip: React.FC<ImageChipProps> = ({
  blob: _blob,
  onDelete,
}) => {
  const [blob, setBlob] = React.useState<Blob | undefined>(undefined);

  React.useEffect(() => {
    setBlob(_blob);
  }, [_blob]);

  const imageBox = React.useMemo(() => {
    return (
      blob && (
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
            className={styles.imageBox}
          />
        </Badge>
      )
    );
  }, [blob, onDelete]);

  return <>{imageBox}</>;
};
