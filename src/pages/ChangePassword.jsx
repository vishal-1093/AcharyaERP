import { useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
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

const initialValues = {
  usn: "",
  email: "",
  newPass: "",
  reEnterNewPass: "",
};

const requiredFields = [];

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function ChangePassword() {
  const [storedata, setStoredata] = useState(initialValues);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const [loading, setLoading] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(false);

  const classes = styles();

  const handleClose = () => {
    setModalOpen(false);
    window.location.href = "/";
  };

  const checks = {
    newPass: [
      "Password must be 8 to 20 character string with at least one upper case letter, one lower case letter, one digit and one special character @ # $ %",
    ],
  };

  const errorMessages = {
    newPass: [
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,12}$/.test(
        storedata.newPass
      ),
    ],
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

  function handleChange(e) {
    setStoredata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleConfirm(e) {
    if (storedata.newPass !== e.target.value) {
      setShow(true);
    }
    if (storedata.newPass === e.target.value) {
      setShow(false);
    }
    setStoredata((prev) => ({ ...prev, reEnterNewPass: e.target.value }));
  }

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
      temp.password = storedata.password;
      temp.username = username;

      await axios
        .put(
          `/api/changePassword?username=${username}&password=${storedata.newPass}`,
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
            <h3 style={{ marginBottom: "20px" }}>Change Password</h3>
            <Grid
              container
              alignItems="center"
              justifycontents="center"
              rowSpacing={2}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12}>
                <CustomTextField
                  type="password"
                  name="newPass"
                  label="Enter New Password"
                  value={storedata.newPass}
                  handleChange={handleChange}
                  fullWidth
                  errors={checks.newPass}
                  checks={errorMessages.newPass}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  type="re_Password"
                  name="reEnterNewPass"
                  label="Re-enter New Password"
                  value={storedata.reEnterNewPass}
                  handleChange={handleConfirm}
                  fullWidth
                  errors={checks.reEnterNewPass}
                  checks={errorMessages.reEnterNewPass}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                {show ? <p>Password did not match</p> : <></>}
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
                    <strong>Change Password</strong>
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

export default ChangePassword;
