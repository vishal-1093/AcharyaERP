import { useState } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import CustomTextField from "../components/Inputs/CustomTextField";
import CustomModal from "../components/CustomModal";
import useAlert from "../hooks/useAlert";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import axios from "../services/ApiWithoutToken";

const requiredFields = ["username"];

const buttonStyle = {
  width: "100%",
  backgroundColor: "auzColor.main",
  ":hover": {
    bgcolor: "auzColor.main",
  },
};

function ForgotPassword() {
  const [storedata, setStoredata] = useState({
    username: "",
  });
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const handleClose = () => {
    setModalOpen(false);
    window.location.href = "/Login";
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

  const callBackUrl = window.location.port
    ? window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      window.location.port
    : window.location.protocol + "//" + window.location.hostname;

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

      let path = callBackUrl + "/ResetPassword?token=";

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

      <Box p={6}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={3} component={Paper} elevation={3} p={2}>
            <Grid container rowSpacing={3} columnSpacing={2}>
              <Grid item xs={12} align="center">
                <Typography variant="h6">Reset Password</Typography>
              </Grid>

              <Grid item xs={12} align="center">
                <IconButton>
                  <LockResetIcon
                    sx={{ fontSize: 60, color: "auzColor.main" }}
                  />
                </IconButton>
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

              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={buttonStyle}
                  onClick={() => navigate("/Login")}
                >
                  <Typography variant="subtitle2">BACK</Typography>
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  type="submit"
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
                    <Typography variant="subtitle2">RESET</Typography>
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

export default ForgotPassword;
