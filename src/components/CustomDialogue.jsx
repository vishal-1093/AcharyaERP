import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
// import SuccessAlert from "../Alerts/SuccessAlert";

export default function CustomDialogue({
  open,
  handleClose,
  label,
  children,
  update,
}) {
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center" }}>{label}</DialogTitle>
        <DialogContent align="center">{children}</DialogContent>
        <DialogActions>
          <Button variant="contained" size="small" onClick={update}>
            Assign
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            size="small"
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
