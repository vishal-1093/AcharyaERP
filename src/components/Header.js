import { Paper, Grid } from "@mui/material";
import Logo from "../assets/logo.jpg";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center",
    // fontSize: "1.7rem",
    fontWeight: 500,
    color: theme.palette.primary.main,
    // [theme.breakpoints.down("md")]: {
    //   fontSize: "1.4rem",
    // },
  },
}));

function Header() {
  const classes = useStyles();

  return (
    <Paper sx={{ backgroundColor: "#f7f7f7" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={1} />
        <Grid item xs={2} md={3}>
          <a href="https://www.acharya.ac.in/">
            <img src={Logo} alt="Acharya" />
          </a>
        </Grid>
        <Grid item xs={4} md={5} />
        <Grid item xs={5} md={3} className={classes.title}>
          User Creation
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Header;
