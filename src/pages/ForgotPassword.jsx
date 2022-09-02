import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Paper, Button, CircularProgress } from "@mui/material";
import ApiUrl from "../services/Api";
import CustomTextField from "../components/Inputs/CustomTextField";
import CustomAlert from "../components/CustomAlert";
import axios from "axios";
import CustomModal from "../components/CustomModal";
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
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [mail, setmail] = useState(false);
  const [data, setData] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const classes = useStyles();
  const paperStyle = {
    width: 320,
    height: 300,
    padding: 30,
    margin: "100px 50px",
    borderRadius: 20,
  };

  const handleClose = () => {
    setModalOpen(false);
    window.location.href = "/";
  };

  const handleModalOpen = (response) => {
    if (response.status === 200) {
      setModalContent({
        title: "",
        message: response.data.data.message,
        buttons: [{ name: "Ok", color: "primary", func: handleClose }],
      });
      setmail(true);
      setModalOpen(true);
    }
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
      setLoading(true);
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
          setData(response.data.data);
          if (response.status === 200) {
            handleModalOpen(response);
          }
          setAlertMessage([
            {
              severity: "success",
              message: "Successfull",
            },
          ]);
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
    setStoredata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      active: true,
    }));
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
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
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
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  textAlign="right"
                >
                  <Grid item xs={12}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={onSubmit}
                      fullWidth
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>Submit</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} align="center">
                <a href="/" className={classes.anchortag}>
                  Back
                </a>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </>
  );
}
export default ForgotPassword;
