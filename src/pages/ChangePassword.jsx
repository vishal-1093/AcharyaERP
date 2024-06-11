import { useEffect, useState } from "react";
import axios from "../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import CustomTextField from "../components/Inputs/CustomTextField";
import useAlert from "../hooks/useAlert";
import CustomModal from "../components/CustomModal";
import { useNavigate } from "react-router-dom";

const initialValues = {
  password: "",
  rePassword: "",
};

const requiredFields = ["password", "rePassword"];

const username = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function ChangePassword() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);



  
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    password: [
      values.password !== "",
      values.password.length > 7,
      values.password.length < 21,
      /[a-zA-Z]/.test(values.password),
      /[0-9]/.test(values.password),
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/.test(values.password),
      /[`!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(values.password),
    ],

    rePassword: [
      values.rePassword !== "",
      values.rePassword.length > 7,
      values.rePassword.length < 21,
      /[a-zA-Z]/.test(values.rePassword),
      /[0-9]/.test(values.rePassword),
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/.test(values.rePassword),
      /[`!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(values.rePassword),
      values.password === values.rePassword,
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

    rePassword: [
      "This field is required",
      "Must be longer than 7 characters",
      "Must be shorter than 20 characters",
      "Must contain at least one alphabet",
      "Must contain at least one number",
      "Must contain at least one uppercase letter and one lowercase letter",
      "Must contain at least one special character",
      "Passwords do not match",
    ],
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);

    const temp = {};
    temp.password = values.password;
    temp.username = username;

    await axios
      .put(
        `/api/changePassword?username=${username}&password=${values.password}`,
        temp
      )
      .then((res) => {
        if (res.status === 200) {
          setModalContent({
            title: "",
            message: res.data.data.message,
            buttons: [{ name: "Ok", color: "primary", func: handleClose }],
          });

          setModalOpen(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });
  };

  const handleClose = () => {
    setModalOpen(false);
    sessionStorage.setItem("AcharyaErpUser", JSON.stringify(null));
    navigate("/login", { replace: true });
  };

  return (
    <Box m={{ md: 5 }} mt={{ xs: 2 }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Grid container justifyContent="center">
        <Grid item xs={12} md={5} lg={3} sm={6}>
          <Paper elevation={4} sx={{ borderRadius: "10px", padding: "25px" }}>
            <Grid container rowSpacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  sx={{ fontSize: 16, textAlign: "center", marginBottom: 1 }}
                >
                  Change Password
                </Typography>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  name="password"
                  type="password"
                  label="Enter New Password"
                  value={values.password}
                  handleChange={handleChange}
                  onPaste={(e) => e.preventDefault()}
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
                  name="rePassword"
                  type="password"
                  label="Re-enter New Password"
                  value={values.rePassword}
                  handleChange={handleChange}
                  onPaste={(e) => e.preventDefault()}
                  checks={checks.rePassword}
                  errors={errorMessages.rePassword}
                  required
                />
              </Grid>

              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  disabled={loading || !requiredFieldsValid()}
                  onClick={handleSubmit}
                  fullWidth
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChangePassword;
