import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Paper, Button } from "@mui/material";
import ApiUrl from "../services/Api";
import CustomTextField from "../components/Inputs/CustomTextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CustomAlert from "../components/CustomAlert";
import axios from "axios";

const useStyles = makeStyles(() => ({
  form: {
    padding: "20px 0",
  },
  anchortag: {
    color: "grey",
    textDecoration: "none",
    borderRadius: 20,
  },
}));

function ForgotPassword() {
  const [storedata, setStoredata] = useState({
    username: "",
  });
  const [formValid, setFormValid] = useState({
    username: false,
  });
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [mail, setMail] = useState(false);
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const paperStyle = {
    width: 320,
    height: 300,
    padding: 30,
    margin: "100px 50px",
    borderRadius: 20,
  };
  function alerts() {
    setOpen(true);
    setMail(true);
  }
  const handleClose = () => {
    setOpen(false);
    window.location.href = "/";
  };

  const onSubmit = async () => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      let path = "http://localhost:3000/ResetPassword?token=";
      await axios
        .post(
          `${ApiUrl}/forgotPassword?url_domain=${path}&username=${storedata.username}`,
          storedata,
          {
            headers: {
              "Content-": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          setStoredata(response.data.data);
          if (response.status === 200) {
            alerts();
          }
          setAlertMessage({
            severity: "success",
            message: response.data.data,
          });
        })
        .catch((error) => {
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  function handleChange(e) {
    setStoredata((prev) => ({ ...prev, username: e.target.value }));
  }
  return (
    <>
      <Box component="form" className={classes.form}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <CustomAlert
            open={alertOpen}
            setOpen={setAlertOpen}
            severity={alertMessage.severity}
            message={alertMessage.message}
          />
          <Paper elevation={8} style={paperStyle}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              rowSpacing={2}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12}>
                <h2>ERP password reset</h2>
              </Grid>
              <Grid item xs={12}>
                <h5>Please give username.</h5>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="username"
                  label="Username"
                  value={storedata.username ?? ""}
                  handleChange={handleChange}
                  fullWidth
                  errors={["Invalid Username"]}
                  checks={[storedata.username !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" onClick={onSubmit}>
                  Submit
                </Button>
              </Grid>
              <Grid item xs={12} align="center">
                <a href="/" className={classes.anchortag}>
                  Back
                </a>
              </Grid>
              <Grid item>
                <Dialog open={open}>
                  <DialogContent>
                    <DialogContentText>
                      <h4>{storedata.message}</h4>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} variant="contained" autoFocus>
                      Ok
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </>
  );
}
export default ForgotPassword;
