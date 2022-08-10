import { useEffect } from "react";
import { IconButton, Collapse, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// open: boolean
// setOpen: () => void
// severity: string
// message: string

function CustomAlert({ open, setOpen, severity, message }) {
  useEffect(() => {
    let timer = setTimeout(() => {
      if (open) setOpen(false);
    }, 6000);
    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "90%",
        maxWidth: 500,
        zIndex: 99,
      }}
    >
      <Collapse in={open} timeout={200}>
        <Alert
          severity={severity}
          variant="filled"
          style={{ boxShadow: "0 2px 5px 0 #00000077", borderRadius: 7 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </div>
  );
}

export default CustomAlert;
