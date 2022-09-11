import { createContext, useState, useEffect } from "react";
import { IconButton, Collapse, Alert, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";

export const AlertContext = createContext();

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

function AlertContextProvider({ children }) {
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    let timer = setTimeout(() => {
      if (alertOpen) setAlertOpen(false);
    }, 6000);
    return () => {
      clearTimeout(timer);
    };
  }, [alertOpen]);

  return (
    <AlertContext.Provider value={{ setAlertMessage, setAlertOpen }}>
      <Box className={classes.alertContainer}>
        <Collapse in={alertOpen} timeout={200}>
          <Alert
            severity={alertMessage.severity}
            variant="filled"
            style={{ boxShadow: "0 2px 5px 0 #00000077", borderRadius: 7 }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {alertMessage.message}
          </Alert>
        </Collapse>
      </Box>
      {children}
    </AlertContext.Provider>
  );
}

export default AlertContextProvider;
