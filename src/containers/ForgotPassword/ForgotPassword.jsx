import React, { useState } from "react";

import { makeStyles } from "@mui/styles";
import { Box, Grid, Paper, Button } from "@mui/material";
import ApiUrl from "../../services/Api";
import CustomTextField from "../../components/Inputs/CustomTextField";

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
  const [storedata, setstoredata] = useState({
    email: "",
  });
  const [mail, setmail] = useState(false);
  const classes = useStyles();
  const paperStyle = {
    padding: 30,
    height: "50vh",
    width: 350,
    margin: "100px 50px",
    borderRadius: 20,
  };
  function alerts() {
    setmail(true);
  }
  const onSubmit = () => {
    console.log(storedata);
    var path = "http://localhost:3000/ResetPassword?token=";

    axios
      .post(
        `${ApiUrl}/forgotPassword?url_domain=${path}&email=${storedata.email}`,
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
          if (response.status == 200) {
            alerts();
          }
          console.log("success");
          console.log(response.data);
        },
        (err) => {
          alert(err.response.data.message);
        }
      );
  };
  function HandleEmail(e) {
    setstoredata((prev) => ({ ...prev, email: e.target.value }));
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
          {" "}
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
                  <h2>Request password reset</h2>
                </Grid>
                <Grid item xs={12}>
                  <h5>
                    Please fill out your email. A link to reset password will be
                    sent there.
                  </h5>
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label="Email"
                    size="small"
                    type="email"
                    handleChange={HandleEmail}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" onClick={onSubmit}>
                    Reset Password
                  </Button>
                  <Grid item xs={12}>
                    {mail ? <span>Link Is Sent,Check Your Email</span> : ""}
                  </Grid>
                </Grid>
                <Grid item xs={12} align="center">
                  <a href="/" className={classes.anchortag}>
                    Back
                  </a>
                </Grid>
              </Grid>
            </>
          </Paper>
        </Grid>
      </Box>
    </>
  );
}
export default ForgotPassword;
