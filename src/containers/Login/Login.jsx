import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  Input,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  Button,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ApiUrl from "../../services/Api";
import background from "../../images/background.jpeg";
import photo from "../../images/photo.png";
import logo4 from "../../images/logo4.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomTextField from "../../components/Inputs/CustomTextField";

const styles = makeStyles(() => ({
  form: {
    padding: "10px 0",
  },
  textField: {
    fontFamily: "Open Sans",
    cursor: "none",
  },
  iconPaper: {
    borderRadius: "22px !important",
    marginLeft: "125px",
    marginTop: "-55px",
    height: "60px",
    width: "60px",
  },
  formContainerPaper: {
    padding: 30,
    height: "72vh",
    width: 380,
    margin: "100px 40px",
    borderRadius: "30px !important",
  },
  btn: {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    marginTop: "40px !important",
    backgroundColor: "#00A29A !important",
  },
  btnStudent: {
    fontFamily: "Open Sans",
    marginTop: "40px",
  },
  anchortag: {
    textDecoration: "none",
    color: "#00A29A !important",
    fontFamily: "Open Sans",
    fontStyle: "normal",
  },
}));

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [showStaff, setShowStaff] = useState(false);

  const classes = styles();

  function handleUsername(e) {
    setValues((prev) => ({ ...prev, username: e.target.value }));
  }

  function authenticateStudent() {
    alert("Still api is not created");
    fetch("", {
      method: "POST",
      headers: {
        "Contect-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(values),
    }).then((response) => {
      response.json().then((result) => {
        if (
          values.username === result.userName &&
          values.password === result.userName
        ) {
          localStorage.setItem(
            "studentauthenticate",
            JSON.stringify({
              Studentlogin: true,
              username1: result.userName,
              token: result.token,
              userId: result.userId,
            })
          );
          setValues({
            Studentlogin: true,
          });
        } else {
          alert("unauthorized");
          setValues({ Studentlogin: false });
        }
      });
    });
  }

  function authenticateErp(e) {
    e.preventDefault();

    fetch(`${ApiUrl}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        response.json().then((result) => {
          if (
            values.username === result.data.userName &&
            values.password === result.data.userName
          ) {
            localStorage.setItem(
              "authenticate",
              JSON.stringify({
                login: true,
                username1: result.data.userName,
                token: result.data.token,
                userId: result.data.userId,
              })
            );
            if (result.status === 200) {
              window.location.href = "/Header";
            }
            setValues({
              login: true,
            });
          } else {
            alert("Unauthorized");
            setValues({ login: false });
          }
        });
      })
      .catch(() => {
        alert("Error");
      });
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Box
        component="form"
        className={classes.form}
        sx={{
          background: `url(${background})`,
          backgroundSize: "cover",
          height: "100%",
          width: "100%",
        }}
      >
        <Grid
          container
          direction="row"
          justifyContent="right"
          alignItems="right"
        >
          <Grid item>
            <img
              src={photo}
              style={{
                width: "600px",
                marginTop: "-140px",
                marginRight: "280px",
              }}
            />
          </Grid>

          <Paper elevation={8} className={classes.formContainerPaper}>
            <Grid item align="left">
              <Paper className={classes.iconPaper}>
                <Grid align="center">
                  <img
                    src={logo4}
                    style={{ width: "54px", marginTop: "4px" }}
                  />
                </Grid>
              </Paper>
            </Grid>
            <Grid
              sx={{
                fontFamily: "Raleway",
                fontWeight: 500,
                fontSize: "30px",
                lineHeight: "2px",
                color: "#5C3C55",
                opacity: 0.75,
              }}
            >
              <p>Sign In</p>
            </Grid>

            {showStaff ? (
              <>
                <Grid align="center" className={classes.btnStudent}>
                  <Button
                    variant="text"
                    onClick={() => setShowStaff(false)}
                    style={{ color: "#bbb" }}
                  >
                    <h4>Staff</h4>
                  </Button>
                  |
                  <Button
                    variant="text"
                    onClick={() => setShowStaff(true)}
                    style={{
                      color: "#76546E",
                    }}
                  >
                    <h4>Student</h4>
                  </Button>
                </Grid>

                <Grid>
                  <Grid item>
                    <CustomTextField
                      label="AUID"
                      variant="standard"
                      style={{ marginTop: "30px" }}
                      handleChange={handleUsername}
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  <Grid style={{ marginTop: "20px" }}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel>Password</InputLabel>
                      <Input
                        fullWidth
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      className={classes.btn}
                      variant="contained"
                      onClick={authenticateStudent}
                      type="submit"
                    >
                      LOGIN
                    </Button>
                  </Grid>
                  <Grid style={{ marginTop: "30px" }}>
                    <a href="/ForgotPassword" className={classes.anchortag}>
                      Forgot Password
                    </a>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid align="center" className={classes.btnStudent}>
                  <Button
                    variant="text"
                    onClick={() => setShowStaff(false)}
                    style={{ color: "#76546E" }}
                  >
                    <h4>Staff</h4>
                  </Button>
                  |
                  <Button
                    variant="text"
                    onClick={() => setShowStaff(true)}
                    style={{
                      color: "#bbb",
                    }}
                  >
                    <h4>Student</h4>
                  </Button>
                </Grid>

                <Grid>
                  <Grid item>
                    <CustomTextField
                      label="Username"
                      variant="standard"
                      style={{ marginTop: "30px" }}
                      className={classes.textField}
                      handleChange={handleUsername}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid style={{ marginTop: "20px" }}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel>Password</InputLabel>
                      <Input
                        fullWidth
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {values.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      className={classes.btn}
                      variant="contained"
                      onClick={authenticateErp}
                      type="submit"
                    >
                      LOGIN
                    </Button>
                  </Grid>
                  <Grid style={{ marginTop: "30px" }}>
                    <a href="/ForgotPassword" className={classes.anchortag}>
                      Forgot Password
                    </a>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Grid>
      </Box>
    </>
  );
}
export default Login;
