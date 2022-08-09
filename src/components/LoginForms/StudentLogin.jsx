import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import background from "../../images/background.jpeg";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomPassword from "../../components/Inputs/CustomPassword";
import CustomSnackbar from "../../components/CustomSnackbar";
import axios from "axios";
const styles = makeStyles(() => ({
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

    backgroundColor: "#00A29A !important",
  },

  anchorTag: {
    textDecoration: "none",
    color: "#00A29A !important",
    fontFamily: "Open Sans",
    fontStyle: "normal",
  },
}));

function StudentLogin() {
  const [values, setValues] = useState({
    active: true,
    username: "",
  });
  const [formValid, setFormValid] = useState({
    username: false,
  });

  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "error",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const classes = styles();

  function authenticateStudent() {
    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setSnackbarOpen(true);
    } else {
      console.log("submitted");
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
            values.username == response.data.data.userName &&
            values.password == response.data.data.userName
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
          setSnackbarMessage({
            severity: "error",
            message: error.response.data.message,
          });
          setSnackbarOpen(true);
        });
    }
  }

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={2}
      >
        <CustomSnackbar
          open={snackbarOpen}
          setOpen={setSnackbarOpen}
          severity={snackbarMessage.severity}
          message={snackbarMessage.message}
        />
        <Grid item xs={12}>
          <CustomTextField
            name="username"
            label="Enter Auid"
            value={values.username ?? ""}
            handleChange={handleChange}
            fullWidth
            errors={["Invalid AUID"]}
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
            onClick={authenticateStudent}
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
    </>
  );
}
export default StudentLogin;
