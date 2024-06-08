import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Button, CircularProgress, Typography } from "@mui/material";
import CustomTextField from "../components/Inputs/CustomTextField";
import CustomModal from "../components/CustomModal";
import axios from "../services/ApiWithoutToken";
import { useSearchParams } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import { useNavigate } from "react-router-dom";

const styles = makeStyles(() => ({
  container: {
    display: "flex",
    padding: "20px 0px",
    height: "95%",
    width: "100%",
  },
  paperStyle: {
    width: "320px !important",
    height: "400px",
    padding: "40px 22px",
    margin: "100px 40px !important",
    borderRadius: "30px !important",
    background: "white",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  },
}));

const buttonStyle = {
  width: "100%",
  backgroundColor: "primary.main",
  ":hover": {
    bgcolor: "primary.main",
  },
};

function ResetPassword() {
  let [searchParams] = useSearchParams();
  const classes = styles();
  const token = searchParams.get("token");
  const [storedata, setStoredata] = useState({ password: "" });

  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formValid, setFormValid] = useState({
    password: false,
  });

  const navigate = useNavigate();

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

  const onSubmit = async (e) => {
    if (!storedata.password) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.password = storedata.password;

      await axios
        .put(
          `/api/resetPassword?token=${token}&password=${storedata.password}`,
          temp,
          {
            headers: {
              "Content-": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setLoading(true);
          setAlertMessage({
            severity: "success",
            message: res.data.data.message,
          });
          setAlertOpen(true);
          navigate("/", { replace: true });
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
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

  function handleConfirm(e) {
    if (storedata.password !== e.target.value) {
      setShow(true);
    }
    if (storedata.password === e.target.value) {
      setShow(false);
    }
    setStoredata((prev) => ({ ...prev, confirm: e.target.value }));
  }

  const checks = {
    password: [
      storedata.password !== "",
      storedata.password.length > 7,
      storedata.password.length < 21,
      /[a-zA-Z]/.test(storedata.password),
      /[0-9]/.test(storedata.password),
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/.test(storedata.password),
      /[`!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(storedata.password),
    ],
  };

  const errorMessages = {
    password: [
      "This field is required",
      "Must be longer than 7 characters",
      "Must be shorter than 20 characters",
      "Must contain at least one alphabet",
      "Must contain at least one number",
      "Must contain at least one uppercase letter and one lowercase letter",
      "Must contain at least one special character",
    ],
  };

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
            <h2>Reset Password</h2>
            <Grid
              container
              alignItems="center"
              justifyContents="center"
              rowSpacing={2}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} style={{ marginTop: "10px" }}>
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
                  checks={checks.password}
                  errors={errorMessages.password}
                  required
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textAlign: "justify" }}
                >
                  Password must be 8 to 20 character string with at least one
                  upper case letter, one lower case letter, one digit and one
                  special character.
                </Typography>
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
                <Typography variant="subtitle2" color="error">
                  {show ? <p>Password did not match</p> : <></>}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={onSubmit}
                  sx={buttonStyle}
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ResetPassword;
