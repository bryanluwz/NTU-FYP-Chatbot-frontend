import React from "react";
import {
  Badge,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Fade,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import cx from "classnames";

import * as styles from "./style.scss";

interface ImageChipProps {
  blob: Blob | string;
  onDelete?: () => void;
  huge?: boolean;
}

export const ImageChip: React.FC<ImageChipProps> = ({
  blob: _blob,
  onDelete,
  huge = false,
}) => {
  const [blob, setBlob] = React.useState<Blob | string | undefined>(undefined);
  const [isClickedZoomed, setIsClickedZoomed] = React.useState(false);

  const handleClose = () => {
    setIsClickedZoomed(false);
  };

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
            src={typeof blob === "string" ? blob : URL.createObjectURL(blob)}
            className={cx(styles.imageBox, { [styles.huge]: huge })}
            onClick={() => setIsClickedZoomed(true)}
          />
        </Badge>
      ) : (
        <Box
          component={"img"}
          src={typeof blob === "string" ? blob : URL.createObjectURL(blob)}
          className={cx(styles.imageBox, { [styles.huge]: huge })}
          onClick={() => setIsClickedZoomed(true)}
        />
      )
    ) : null;
  }, [blob, huge, onDelete]);
  const zoomedImageDialog = React.useMemo(() => {
    return (
      blob && (
        <Dialog
          open={isClickedZoomed}
          onClose={handleClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            style: {
              background: "transparent", // No extra background
              boxShadow: "none",
            },
          }}
          TransitionComponent={Fade}
        >
          <DialogContent
            onClick={handleClose} // Clicking anywhere closes the dialog
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              // width: "100vw",
              background: "rgba(0, 0, 0, 0)", // Transparent background
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleClose}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                color: "white",
              }}
            >
              <ClearIcon />
            </IconButton>

            {/* Image */}
            <Box
              component="img"
              src={typeof blob === "string" ? blob : URL.createObjectURL(blob)}
              style={{
                maxHeight: "80%",
                maxWidth: "80%",
                objectFit: "contain",
              }}
              className={styles.popOut}
              onClick={(e) => e.stopPropagation()} // Prevent closing on image click
            />
          </DialogContent>
        </Dialog>
      )
    );
  }, [blob, isClickedZoomed]);

  return (
    <>
      {imageBox}
      {zoomedImageDialog}
    </>
  );
};
