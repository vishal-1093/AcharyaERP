import React, { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import background from "../../assets/background.jpeg";
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
    cursor: "none",
  },

  btn: {
    fontStyle: "normal",
  },

  anchorTag: {
    textDecoration: "none",
    color: theme.palette.blue.main,
    fontStyle: "normal",
  },
}));

function StudentLogin({ setAlertOpen, setAlertMessage }) {
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

  function authenticateStudent() {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      alert("Still api is not created");
      axios
        .post(``, values, {
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
        rowSpacing={2}
      >
        <Grid item xs={12} mt={1}>
          <CustomTextField
            name="username"
            label="Enter Auid"
            value={values.username}
            handleChange={handleChange}
            helperText=" "
            errors={["This field is required"]}
            checks={[values.username !== ""]}
            setFormValid={setFormValid}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomPassword
            name="password"
            label="Password"
            value={values.password}
            handleChange={handleChange}
            helperText=" "
            errors={["This field is required"]}
            checks={[values.password !== ""]}
            setFormValid={setFormValid}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            className={classes.btn}
            variant="contained"
            onClick={authenticateStudent}
          >
            LOGIN
          </Button>
        </Grid>
        <Grid item xs={12} textAlign="left" mt={1} ml={1}>
          <a href="/ForgotPassword" className={classes.anchorTag}>
            Forgot Password?
          </a>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentLogin;
