import React, { useState } from "react";
import { Grid, Paper, Button, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

import ApiUrl from "../../services/Api";
import background from "../../images/background.jpeg";
import photo from "../../images/photo.png";
import CustomTextField from "../../components/Inputs/CustomTextField";
import logo4 from "../../images/logo4.png";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const styles = makeStyles(() => ({
  form: {
    padding: "10px 0",
  },
  textField: {
    fontFamily: "Open Sans",
    cursor: "none",
  },
  paperStyle1: {
    borderRadius: "22px !important",
    marginLeft: "125px",
    marginTop: "-55px",
    height: "60px",
    width: "60px",
  },

  btn: {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    marginTop: "40px !important",
    backgroundColor: "#00A29A !important",
  },
  btnstudent: {
    fontFamily: "Open Sans",
    marginTop: "40px",
  },

  anchortag: {
    textDecoration: "none",
    color: "#00A29A !important",
    fontFamily: "Open Sans",
    fontStyle: "normal",
  },
  ptag: {
    fontFamily: "Raleway",
    fontSize: "40px",
    letterSpacing: "-0.25px",
    color: "#5A5D72 !important",
    width: "285px",
    height: "40px",
  },
  patag: {
    fontFamily: "Raleway",
    marginTop: "20px",
    fontSize: "40px",
    color: "#76546E !important",
  },
}));

function Login() {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
  });

  const [visible, setvisible] = useState(false);

  const classes = styles();
  const paperStyle = {
    padding: 30,
    height: "72vh",
    width: 380,
    margin: "100px 40px",
    borderRadius: 30,
  };

  function handleusername(e) {
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
            if (result.status == 200) {
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
  function click() {
    setvisible(false);
  }
  function clicks() {
    setvisible(true);
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
              alt=""
              style={{
                width: "600px",
                marginTop: "-140px",
                marginRight: "280px",
              }}
            />
          </Grid>

          <Paper elevation={8} style={paperStyle}>
            <Grid item align="left">
              <Paper className={classes.paperStyle1}>
                <Grid align="center">
                  <img
                    src={logo4}
                    alt=""
                    style={{ width: "54px", marginTop: "4px" }}
                  />
                </Grid>
              </Paper>
            </Grid>
            <Grid
              sx={{
                position: "absolute",
                fontFamily: "Raleway",
                fontStyle: "normal",
                fontWeight: "445",
                fontSize: "30px",
                lineHeight: "2px",
                textAlign: "right",
                color: "#5C3C55",
                opacity: 0.7,
              }}
            >
              <p>Sign In</p>
            </Grid>

            {visible ? (
              <>
                <Grid align="center" className={classes.btnstudent}>
                  <Button
                    variant="text"
                    onClick={click}
                    style={{ color: "#cccccc" }}
                    id="font"
                  >
                    <h4> Staff</h4>
                  </Button>
                  |
                  <Button
                    variant="text"
                    id="fonts"
                    onClick={clicks}
                    style={{
                      color: "#76546E",
                    }}
                  >
                    <h4> Student</h4>
                  </Button>
                </Grid>

                <Grid>
                  <Grid item>
                    <CustomTextField
                      id="standard-basic"
                      label="Enter AUID"
                      variant="standard"
                      style={{ marginTop: "30px" }}
                      handleChange={handleusername}
                      size="small"
                      fullWidth
                    />
                  </Grid>

                  <Grid style={{ marginTop: "20px" }}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel htmlFor="standard-adornment-password">
                        Password
                      </InputLabel>
                      <Input
                        fullWidth
                        id="standard-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
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
                      Forgot Password ?
                    </a>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid align="center" className={classes.btnstudent}>
                  <Button
                    variant="text"
                    onClick={click}
                    style={{ color: "#76546E" }}
                    id="font"
                  >
                    <h4> Staff</h4>
                  </Button>
                  |
                  <Button
                    variant="text"
                    id="fonts"
                    onClick={clicks}
                    style={{
                      color: "#cccccc",
                    }}
                  >
                    <h4> Student</h4>
                  </Button>
                </Grid>

                <Grid>
                  <Grid item>
                    <CustomTextField
                      label="Username"
                      placeholder="Enter Username"
                      variant="standard"
                      style={{ marginTop: "30px" }}
                      className={classes.textField}
                      handleChange={handleusername}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid style={{ marginTop: "20px" }}>
                    <FormControl fullWidth variant="standard">
                      <InputLabel htmlFor="standard-adornment-password">
                        Password
                      </InputLabel>
                      <Input
                        fullWidth
                        id="standard-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
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
                      Forgot Password ?
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
