import { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  IconButton,
  Typography,
  TextField,
} from "@mui/material";
import CustomTextField from "../components/Inputs/CustomTextField";
import useAlert from "../hooks/useAlert";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import axiosNoToken from "../services/ApiWithoutToken";
import ModalWrapper from "../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ReplayIcon from "@mui/icons-material/Replay";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const requiredFields = ["username"];

const buttonStyle = {
  width: "100%",
  backgroundColor: "auzColor.main",
  ":hover": {
    bgcolor: "auzColor.main",
  },
};

// Local
// const API_ENDPOINT = `http://192.168.0.151:8080`;

// Staging
const API_ENDPOINT = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

// Kubernetes
// const API_ENDPOINT = `https://api-dev-acharyainstitutes.com`;

// Production
// const API_ENDPOINT = `https://acerp.acharyaerptech.in`;

const styles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: "95%",
    width: "100%",
  },
  paperStyle: {
    width: "460px !important",
    height: "300px",
    padding: "40px 22px",
    margin: "100px 40px !important",
    borderRadius: "30px !important",
    background: "white",
    "@media (max-width: 1024px)": {
      padding: 0,
      margin: "50px 0px 0px 0px !important",
      height: "250px",
    },
  },
  passwordContainer: {
    width: "480px !important",
    height: "350px",
    margin: "70px 40px !important",
    borderRadius: "30px !important",
    background: "white",
    "@media (max-width: 1024px)": {
      padding: 0,
      margin: "50px 0px !important",
    },
  },
  textBoxContainer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0px",
  },
  textBox: {
    height: "50px",
    width: "50px",
    padding: "18px",
    fontSize: "20px",
  },
  errorTextContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start",
    textAlign: "start",
    margin: "4px 0px",
  },
  fieldContainer: {
    margin: "30px 0px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
}));

function ForgotPassword() {
  const numberOfDigits = 6;
  const classes = styles();
  const [storedata, setStoredata] = useState({
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [isValidOtp, setIsValidOtp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpBoxReference = useRef([]);
  const [errors_, setErrors_] = useState({
    minValueValidation: false,
    numberValidation: false,
    capitalLetterValidation: false,
    specialCharacterValidation: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!userModalOpen) {
      setIsValidOtp(false);
      setPassword("");
      setConfirmPassword("");
      setErrors_({
        minValueValidation: false,
        numberValidation: false,
        capitalLetterValidation: false,
        specialCharacterValidation: false,
      });
      setLoading(false);
      setOtp(new Array(numberOfDigits).fill(""));
    }
  }, [userModalOpen]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    username: [storedata.username !== ""],
  };

  const errorMessages = {
    username: ["Invalid Username"],
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
      return sendOTP(storedata.username);
    }
  };

  const sendOTP = (username) => {
    axiosNoToken
      .post(`${API_ENDPOINT}/api/forgotPassword?username=${username}`)
      .then((res) => {
        showAlert("success", res.data.data?.message);
        setUserModalOpen(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showAlert("error", "Failed to send OTP, Please try again");
        setLoading(false);
      });
  };

  const showAlert = (type, msg) => {
    setAlertMessage({
      severity: type,
      message: msg,
    });
    setAlertOpen(true);
  };

  function handleChange(e) {
    setStoredata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange_ = (value, index) => {
    if (isNaN(value) || value === " ") return;
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const handleBackspaceAndEnter = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password) => {
    setErrors_({
      minValueValidation: password.length >= 8,
      numberValidation: /\d/.test(password),
      capitalLetterValidation: /[A-Z]/.test(password),
      specialCharacterValidation: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleSubmit = () => {
    const enteredOTP = otp.toString().replaceAll(",", "");
    if (enteredOTP.length < 6)
      return showAlert("error", "Please Enter all the fileds");
    setLoading(true);
    axiosNoToken
      .post(`${API_ENDPOINT}/api/resetPasswordOtpCheckr`, { otp: enteredOTP })
      .then((res) => {
        setLoading(false);
        if (res.data.data?.isCheck) setIsValidOtp(true);
        else showAlert("error", "Incorrect OTP, Please try again!!!");
      })
      .catch((err) => {
        console.log(err);
        showAlert("error", "Incorrect OTP, Please try again!!!");
        setOtp(new Array(numberOfDigits).fill(""));
        setLoading(false);
      });
  };

  const handleChangePassword = () => {
    if (password === "" || confirmPassword === "")
      return showAlert("error", "Please fill all the fields");
    if (password !== confirmPassword)
      return showAlert("error", "Password not matching!!!");
    if (
      !errors_.capitalLetterValidation ||
      !errors_.minValueValidation ||
      !errors_.numberValidation ||
      !errors_.specialCharacterValidation
    )
      return showAlert("error", "Password should match below conditions.");

    setLoading(true);
    const enteredOTP = otp.toString().replaceAll(",", "");
    axiosNoToken
      .put(`${API_ENDPOINT}/api/resetPassword`, {
        token: enteredOTP,
        password: password,
      })
      .then((res) => {
        showAlert("success", res.data.data?.message);
        navigate("/Login");
      })
      .catch((err) => {
        console.log(err);
        showAlert("error", "Something went wrong, Please try again!!!");
        setPassword("");
        setConfirmPassword("");
        setErrors_({
          minValueValidation: false,
          numberValidation: false,
          capitalLetterValidation: false,
          specialCharacterValidation: false,
        });
        setLoading(false);
      });
  };

  return (
    <>
      <ModalWrapper
        open={userModalOpen}
        setOpen={setUserModalOpen}
        maxWidth={600}
        title="Reset Password"
      >
        {!isValidOtp ? (
          <Box
            className={classes.container}
            align="center"
            justifyContent="center"
          >
            <Grid container className={classes.paperStyle}>
              <Grid item xs={12}>
                <h2>Enter OTP</h2>
                <Box className={classes.textBoxContainer}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      value={digit}
                      maxLength={1}
                      onChange={(e) => handleChange_(e.target.value, index)}
                      onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                      ref={(reference) =>
                        (otpBoxReference.current[index] = reference)
                      }
                      className={classes.textBox}
                    />
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    onClick={sendOTP}
                    disabled={loading}
                  >
                    Resend OTP <ReplayIcon />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box
            className={classes.container}
            align="center"
            justifyContent="center"
          >
            <Grid container className={classes.passwordContainer}>
              <Grid item xs={12}>
                <h2>Create New Password</h2>
                <Box className={classes.fieldContainer}>
                  <TextField
                    value={password}
                    type="password"
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    style={{ width: "100%" }}
                  />
                  <FormControl fullWidth variant="outlined">
                    <OutlinedInput
                      id="password"
                      name="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleChangePassword}
                    style={{ width: "30%" }}
                    disabled={loading}
                  >
                    Submit
                  </Button>
                </Box>
                {Object.entries(errors_).map(([key, value]) => (
                  <Box key={key} className={classes.errorTextContainer}>
                    {value ? (
                      <CheckIcon style={{ color: "green" }} />
                    ) : (
                      <ClearIcon style={{ color: "red" }} />
                    )}
                    <p style={{ color: `${value ? "green" : "red"}` }}>
                      {key === "minValueValidation" &&
                        "Password must be at least 8 Characters"}
                      {key === "numberValidation" &&
                        "Password must have at least one Number"}
                      {key === "capitalLetterValidation" &&
                        "Password must have at least one Capital Letter"}
                      {key === "specialCharacterValidation" &&
                        "Password must have at least one Special Character"}
                    </p>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>
        )}
      </ModalWrapper>

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
