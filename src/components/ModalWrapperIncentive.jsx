import { IconButton, Grid, Box, Modal, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "block",
    position: "fixed",
    top: "49%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "100vh",
    border: "7px solid white",
    width: "100%",
    background: "white",
    boxShadow: 24,
    overflow: "auto",
  },
  header: {
    top: 0,
    background: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 500,
    color: theme.palette.primary.main,
    textAlign: "center",
    paddingLeft: "40px"
  }
}));

function ModalWrapperIncentive({ open, setOpen, maxWidth, title, headerText, children }) {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box className={classes.box} borderRadius={3} maxWidth={maxWidth}>
        <Grid container className={classes.header}>
          <Grid item xs={11}>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            <Typography variant="body2" className={classes.title}>
              {headerText}
            </Typography>
          </Grid>
          <Grid item xs={1} mb={4}>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <HighlightOffIcon sx={{ fontSize: 25 }} />
            </IconButton>
          </Grid>
        </Grid>
        <Box p={1} pt={0} pr={10}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalWrapperIncentive;
