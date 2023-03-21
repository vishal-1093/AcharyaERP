import { useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import CustomTextField from "../components/Inputs/CustomTextField";
import CustomModal from "../components/CustomModal";
import useAlert from "../hooks/useAlert";
import axios from "../services/Api";

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

const requiredFields = ["username"];

function ForgotPassword() {
  const [storedata, setStoredata] = useState({
    username: "",
  });

  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);

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

  const checks = {
    username: [storedata.username !== ""],
  };

  const errorMessages = {
    username: ["Invalid Username"],
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

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!storedata[field]) return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });

      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.username = storedata.username;

      let path = "http://localhost:3000/ResetPassword?token=";
      await axios
        .post(
          `/api/forgotPassword?url_domain=${path}&username=${storedata.username}`,
          temp,
          {
            headers: {
              "Content-": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
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
            <Grid
              container
              alignItems="center"
              justifyContents="center"
              rowSpacing={2}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <h5>Please give username.</h5>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="username"
                  label="Username"
                  value={storedata.username}
                  handleChange={handleChange}
                  fullWidth
                  errors={checks.username}
                  checks={errorMessages.username}
                  required
                />
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
                    <strong>Submit</strong>
                  )}
                </Button>
              </Grid>
              <Grid item xs={12} align="center">
                <Link to="/">Back</Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ForgotPassword;
