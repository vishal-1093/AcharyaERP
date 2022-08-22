import { useEffect } from "react";
import { IconButton, Collapse, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";

// open: boolean
// setOpen: () => void
// severity: string
// message: string

const useStyles = makeStyles((theme) => ({
  alertContainer: {
    position: "fixed",
    top: 61,
    left: "50%",
    transform: "translate(-50%, 0)",
    width: "90%",
    maxWidth: 500,
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function CustomAlert({ open, setOpen, severity, message }) {
  const classes = useStyles();

  useEffect(() => {
    let timer = setTimeout(() => {
      if (open) setOpen(false);
    }, 6000);
    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  return (
    <div className={classes.alertContainer}>
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
