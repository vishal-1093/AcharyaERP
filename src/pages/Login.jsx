import { useState } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import College from "../assets/College.jpg";
import logo4 from "../assets/logo4.png";
import background1 from "../assets/background1.jpeg";
import StaffLogin from "../containers/LoginForms/StaffLogin";
import StudentLogin from "../containers/LoginForms/StudentLogin";
import CustomAlert from "../components/CustomAlert";

const styles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: "20px 0px",
    backgroundSize: "cover",
    height: "95%",
    width: "100%",
  },
  paperStyle: {
    position: "relative",
    width: "350px !important",
    height: "440px",
    padding: "22px",
    margin: "100px 40px !important",
    borderRadius: "30px !important",
    background: "white",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  },
  signIn: {
    fontSize: 28,
    color: theme.palette.blue.main,
    height: 17,
  },
}));

function Login() {
  const [showStaff, setShowStaff] = useState("staff");
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);

  const classes = styles();

  return (
    <>
      <CustomAlert
        open={alertOpen}
        setOpen={setAlertOpen}
        severity={alertMessage.severity}
        message={alertMessage.message}
      />
      <Box
        className={classes.container}
        align="right"
        justifyContent="right"
        sx={{
          background: {
            xs: `url(${background1})`,
            lg: `url(${College})`,
          },
        }}
      >
        <Grid container className={classes.paperStyle}>
          <Grid
            item
            xs={12}
            sx={{
              position: "absolute",
              top: "0",
              left: "50%",
              textAlign: "center",
              transform: "translate(-50%, -70%)",
            }}
          >
            <Paper
              sx={{
                height: "60px",
                width: "60px",
                borderRadius: "22px !important",
              }}
            >
              <img
                src={logo4}
                alt="Acharya"
                style={{ width: "54px", marginTop: "9px" }}
              />
            </Paper>
          </Grid>

          <Grid item xs={4} className={classes.signIn}>
            <p>Sign In</p>
          </Grid>

          <Grid item xs={12} align="center">
            <Button
              variant="text"
              onClick={() => setShowStaff("staff")}
              style={{
                color: showStaff === "student" ? "#cccccc" : "#76546E",
              }}
              id="font"
            >
              <h4> Staff</h4>
            </Button>
            |
            <Button
              variant="text"
              id="fonts"
              onClick={() => setShowStaff("student")}
              style={{
                color: showStaff === "staff" ? "#cccccc" : "#76546E",
              }}
            >
              <h4> Student</h4>
            </Button>
          </Grid>

          <Grid item xs={12}>
            {showStaff === "staff" ? (
              <StaffLogin
                setAlertOpen={setAlertOpen}
                setAlertMessage={setAlertMessage}
              />
            ) : (
              <StudentLogin
                setAlertOpen={setAlertOpen}
                setAlertMessage={setAlertMessage}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Login;
