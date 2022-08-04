import React from "react";
import { Snackbar, Alert } from "@mui/material";

function CustomSnackbar({ open, setOpen, severity, message }) {
  const handleClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        variant="filled"
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%", fontSize: "1rem" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
