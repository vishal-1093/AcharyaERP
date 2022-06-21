import React, { useState } from "react";
import { Box, Grid, Paper, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomTextField from "../../components/Inputs/CustomTextField";
import ApiUrl from "../../services/Api";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const useStyles = makeStyles(() => ({
  form: {
    padding: "20px 0",
  },
  paperStyle: {
    padding: 30,
    height: "50vh",
    width: 350,
    margin: "100px 50px",
    borderRadius: 20,
  },
}));

function ResetPassword() {
  let [searchParams, setSearchParams] = useSearchParams();
  const classes = useStyles();
  const token = searchParams.get("token");
  const [storedata, setstoredata] = useState([]);
  const [reload, setreload] = useState(false);

  function page() {
    window.location.href = "/";
    setreload(true);
  }

  const onSubmit = () => {
    console.log(token);

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
    setstoredata({ ...storedata, [e.target.name]: e.target.value });
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
          <Paper elevation={8} className={classes.paperStyle}>
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
                    fullWidth
                    label="Password"
                    size="small"
                    type="password"
                    name="password"
                    handleChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  {reload ? <p>Password Changed</p> : ""}
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" onClick={onSubmit}>
                    Save
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
