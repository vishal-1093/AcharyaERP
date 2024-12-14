import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

export default function ModalPopup({
  open,
  setOpen,
  title,
  title1,
  handleSubmit,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 15 }} variant="subtitle2">
            {title}
          </Typography>
          <Typography sx={{ fontSize: 15 }} variant="subtitle2">
            {title1}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={handleSubmit}
            autoFocus
          >
            OK
          </Button>
          <Button
            size="small"
            variant="contained"
            autoFocus
            onClick={() => setOpen(false)}
          >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
