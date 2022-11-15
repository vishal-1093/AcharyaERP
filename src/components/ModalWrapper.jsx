import { IconButton, Grid, Box, Modal } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { makeStyles } from "@mui/styles";

// open: boolean,
// setOpen: () => void,
// maxWidth: number,
// title?: string,

const useStyles = makeStyles((theme) => ({
  box: {
    display: "block",
    position: "fixed",
    top: "49%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "90vh",
    border: "7px solid white",
    width: "90%",
    background: "white",
    boxShadow: 24,
    overflow: "auto",
  },
  header: {
    top: 0,
    padding: "7px 0",
    background: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 500,
    color: theme.palette.primary.main,
  },
}));

function ModalWrapper({ open, setOpen, maxWidth, title, children }) {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box className={classes.box} borderRadius={3} maxWidth={maxWidth}>
        <Grid container className={classes.header}>
          <Grid item xs={11} pl={2}>
            <h3 className={classes.title}>{title}</h3>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Box p={2} pt={0}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalWrapper;
