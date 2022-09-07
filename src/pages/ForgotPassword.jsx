import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import ApiUrl from "../services/Api";
import { Link } from "react-router-dom";
import CustomTextField from "../components/Inputs/CustomTextField";
import axios from "axios";
import CustomModal from "../components/CustomModal";
import useAlert from "../hooks/useAlert";
const styles = makeStyles(() => ({
  container: {
    display: "flex",
    padding: "20px 0px",
    height: "95%",
    width: "100%",
  },
  paperStyle: {
    width: "320px !important",
    height: "300px",
    padding: "24px 22px",
    margin: "100px 40px !important",
    borderRadius: "30px !important",
    background: "white",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  },
}));

function ForgotPassword() {
  const [storedata, setStoredata] = useState({
    username: "",
  });
  const [formValid, setFormValid] = useState({
    username: false,
  });
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const classes = styles();

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
      const temp = {};
      temp.username = storedata.username;

      let path = "http://localhost:3000/ResetPassword?token=";
      await axios
        .post(
          `${ApiUrl}/forgotPassword?url_domain=${path}&username=${storedata.username}`,
          temp,
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
          setLoading(false);
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
    }));
  }

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box className={classes.container} align="center" justifyContent="center">
        <Grid container className={classes.paperStyle}>
          <Grid item xs={12}>
            <h2>ERP password reset</h2>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContents="center"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
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
              <Link to="/">Back</Link>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ForgotPassword;
