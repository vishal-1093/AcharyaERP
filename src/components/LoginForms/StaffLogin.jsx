import React, { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ApiUrl from "../../services/Api";
import background from "../../images/background.jpeg";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomPassword from "../../components/Inputs/CustomPassword";
import axios from "axios";

const styles = makeStyles((theme) => ({
  form: {
    padding: "10px 0",
    background: `url(${background})`,
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  },
  textField: {
    fontFamily: "Open Sans",
    cursor: "none",
  },
  btn: {
    fontFamily: "Open Sans",
    fontStyle: "normal",
  },
  anchorTag: {
    textDecoration: "none",
    color: theme.palette.blue.main,
    fontFamily: "Open Sans",
    fontStyle: "normal",
  },
}));

function StaffLogin({ setAlertOpen, setAlertMessage }) {
  const [values, setValues] = useState({
    active: true,
    username: "",
    password: "",
  });
  const [formValid, setFormValid] = useState({
    username: false,
    password: false,
  });

  const classes = styles();

  function authenticateErp(e) {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      axios
        .post(`${ApiUrl}/authenticate`, values, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        })
        .then((response) => {
          console.log(response);
          if (
            values.username === response.data.data.userName &&
            values.password === response.data.data.userName
          ) {
            localStorage.setItem(
              "authenticate",
              JSON.stringify({
                login: true,
                username1: response.data.data.userName,
                token: response.data.data.token,
                userId: response.data.data.userId,
              })
            );
            setAlertMessage({ severity: "success", message: "" });
            if (response.status === 200) {
              window.location.href = "/Header";
            }
            setValues({
              login: true,
            });
          }
        })
        .catch((error) => {
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
          setAlertOpen(true);
        });
    }
  }

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box component="form" height="70%">
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={4}
      >
        <Grid item xs={12}>
          <CustomTextField
            name="username"
            label="Enter Username"
            value={values.username ?? ""}
            handleChange={handleChange}
            fullWidth
            errors={["Invalid Username"]}
            checks={[values.username !== ""]}
            setFormValid={setFormValid}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <CustomPassword
            name="password"
            label="Password"
            handleChange={handleChange}
            errors={["This field is required"]}
            checks={[values.password !== ""]}
            setFormValid={setFormValid}
            fullWidth
          />
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
        <Grid item xs={10} md={6} sx={{ marginBottom: "80px" }}>
          <a href="/ForgotPassword" className={classes.anchorTag}>
            Forgot Password ?
          </a>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StaffLogin;
