import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Paper, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../components/Inputs/CustomTextField";
import CustomModal from "../components/CustomModal";
import ApiUrl from "../services/Api";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const useStyles = makeStyles(() => ({
  form: {
    padding: "20px 0",
  },
}));

function ResetPassword() {
  let [searchParams, setSearchParams] = useSearchParams();
  const classes = useStyles();
  const token = searchParams.get("token");
  const [storedata, setstoredata] = useState({ password: "" });

  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [formValid, setFormValid] = useState({
    password: false,
  });
  const paperStyle = {
    width: 340,
    height: 400,
    padding: 30,
    margin: "100px 50px",
    borderRadius: 20,
  };

  function page() {
    handleModalOpen("discard");
    setModalOpen(true);
  }

  const handleClose = () => {
    window.location.href = "/";
    setModalOpen(false);
  };
  const handleModalOpen = (action) => {
    if (action === "discard") {
      setModalContent({
        title: "",
        message: "Your password has been changed Successfully !",
        buttons: [
          {
            name: "Ok",
            color: "primary",
            func: handleClose,
          },
        ],
      });
      setModalOpen(true);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setSubmitError(true);
      console.log("failed");
      setAlertOpen(true);
    } else {
      setSubmitError(false);
      console.log("submitted");
      setAlertOpen(true);
    }
    axios
      .put(
        `${ApiUrl}/resetPassword?token=${token}&password=${storedata.password}`,
        storedata,
        {
          headers: {
            "Content-": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then(
        (response) => {
          console.log("success");
          console.log(response.data);
          page();
        },
        (err) => {
          alert(err.response.data.message);
        }
      );
  };
  function handleChange(e) {
    setstoredata({
      ...storedata,
      [e.target.name]: e.target.value,
      active: true,
    });
  }

  function handleConfirm(e) {
    if (storedata.password !== e.target.value) {
      setShow(true);
    }
    if (storedata.password == e.target.value) {
      setShow(false);
    }
    setstoredata({ ...storedata, confirm: e.target.value });
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
          <CustomModal
            open={modalOpen}
            setOpen={setModalOpen}
            title={modalContent.title}
            message={modalContent.message}
            buttons={modalContent.buttons}
          />
          <Paper elevation={8} style={paperStyle}>
            <>
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                rowSpacing={2}
                columnSpacing={{ xs: 2, md: 4 }}
              >
                <Grid item xs={12}>
                  <h2>Reset Password</h2>
                </Grid>
                <Grid item xs={12}>
                  <h5>Please choose your new password:</h5>
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    type="password"
                    name="password"
                    label="Enter New Password"
                    value={storedata.password}
                    handleChange={handleChange}
                    fullWidth
                    errors={[
                      "Password must be 8 to 20 character string with at least one upper case letter, one lower case letter, one digit and one special character @ # $ %",
                    ]}
                    checks={[
                      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/.test(
                        storedata.password
                      ),
                    ]}
                    setFormValid={setFormValid}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label="Re-Confirm Password"
                    size="small"
                    type="password"
                    name="password"
                    handleChange={handleConfirm}
                  />
                </Grid>
                <Grid item xs={12}>
                  {show ? <p>Password did not match</p> : ""}
                </Grid>

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
                      <strong>SAVE</strong>
                    )}
                  </Button>
                </Grid>
              </Grid>
            </>
          </Paper>
        </Grid>
      </Box>
    </>
  );
}
export default ResetPassword;
