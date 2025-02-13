import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import background from "../assets/background.jpeg";
import logo from "../assets/logo1.png";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Link, useNavigate } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ModalWrapper from "../components/ModalWrapper";
import { makeStyles } from "@mui/styles";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ReplayIcon from "@mui/icons-material/Replay";

const boxStyle = {
  background: `url(${background})`,
  backgroundSize: "cover",
  padding: 6,
  height: {
    xs: "100%",
    lg: "48vw",
  },
  width: {
    xs: "100%",
    lg: "100vw",
  },
};

const buttonStyle = {
  width: "100%",
  backgroundColor: "blue.main",
  ":hover": {
    bgcolor: "blue.main",
  },
};

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

const userTypeStyle = { fontSize: 40, color: "blue.main" };

// Local
// const API_ENDPOINT = `http://192.168.0.151:8080`;

// Staging
const API_ENDPOINT = `https://www.stageapi-acharyainstitutes.in/Acharya_University`;

// Kubernetes
// const API_ENDPOINT = `https://api-dev-acharyainstitutes.com`;

// Production
// const API_ENDPOINT = `https://acerp.acharyaerptech.in`;

function LoginNew() {
  const numberOfDigits = 6;
  const classes = styles();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [isValidOtp, setIsValidOtp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpBoxReference = useRef([]);
  const [loading, setLoading] = useState(true);
  const [errors_, setErrors_] = useState({
    minValueValidation: false,
    numberValidation: false,
    capitalLetterValidation: false,
    specialCharacterValidation: false,
  });

  useEffect(() => {
    const checkSessionStorage = () => {
      const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"));
      const roleId = token?.roleId;

      if (token && roleId === 3) {
        navigate("/Dashboard");
      } else if (token && roleId === 4) {
        navigate("/Dashboard");
      } else if (token && roleId === 16) {
        navigate("/Dashboard");
      } else if (token && roleId === 18) {
        navigate("/Dashboard");
      } else if (token) {
        navigate("/Dashboard");
      } else {
        navigate("/Login");
      }
    };
    checkSessionStorage();
  }, [navigate]);

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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleError = (username, password) => {
    let error = {};

    if (username === null || username === "")
      error["username"] = "Invalid username";

    if (password === null || password === "")
      error["password"] = "Invalid password";

    return { error, isValid: Object.keys(error).length <= 0 };
  };

  function authenticateErp(e) {
    e.preventDefault();
    setErrors({});
    const data = new FormData(e.currentTarget);

    const username = data.get("username");
    const password = data.get("password");

    const { error, isValid } = handleError(username, password);

    if (!isValid) return setErrors(error);

    const values = { username, password };
    axios
      .post(`${API_ENDPOINT}/api/authenticate`, values, {
        body: JSON.stringify(values),
      })
      .then((response) => {
        if (values.username === response.data.data.userName) {
          axios
            .get(`${API_ENDPOINT}/api/findRoles/${response.data.data.userId}`, {
              headers: {
                Authorization: `Bearer ${response.data.data.token}`,
                "ngrok-skip-browser-warning": true,
              },
            })
            .then((res) => {
              if (res.data.data.length > 0) {
                sessionStorage.setItem(
                  "AcharyaErpUser",
                  JSON.stringify({
                    login: true,
                    userId: response.data.data.userId,
                    userName: response.data.data.userName,
                    token: response.data.data.token,
                    roleId: res.data.data[0].role_id,
                    roleName: res.data.data[0].role_name,
                    roleShortName: res.data.data[0].role_short_name,
                    userType: res.data.data[0].usertype,
                  })
                );
              } else {
                sessionStorage.setItem(
                  "AcharyaErpUser",
                  JSON.stringify({
                    login: true,
                    userId: response.data.data.userId,
                    userName: response.data.data.userName,
                    token: response.data.data.token,
                    userType: res.data.data.usertype,
                  })
                );
              }
              setAlertMessage({ severity: "success", message: "" });
              if (
                response?.data?.data?.token &&
                res?.data?.data[0]?.role_id === 3
              ) {
                navigate("/Dashboard", { replace: true });
              } else if (
                response?.data?.data?.token &&
                res?.data?.data[0]?.role_id === 4
              ) {
                navigate("/Dashboard", { replace: true });
              } else if (
                response?.data?.data?.token &&
                res?.data?.data[0]?.role_id === 16
              ) {
                navigate("/Dashboard", { replace: true });
              } else if (
                response?.data?.data?.token &&
                res?.data?.data[0]?.role_id === 18
              ) {
                navigate("/Dashboard", { replace: true });
              } else if (
                response?.data?.data?.token &&
                res?.data?.data[0]?.role_id === 12
              ) {
                navigate("/Dashboard", { replace: true });
              } else if (response?.data?.data?.token) {
                navigate("/Dashboard", { replace: true });
              } else {
                navigate("/Login");
              }
              // navigate("/Dashboard", { replace: true });
              window.location.reload();
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((error) => {
        console.error(error);
        const msg = error.response?.data.message;
        const statusCode = error.response?.status;
        if (statusCode === 406) {
          setUserModalOpen(true);
          sendOTP();
          return;
        }
        if (msg === null || msg === undefined || statusCode !== 401) {
          setAlertMessage({
            severity: "error",
            message: "Failed to check, Please try after some time.",
          });
          setAlertOpen(true);
          return;
        }

        if (msg.includes("Username")) {
          setErrors({ username: msg });
          return;
        } else if (msg.includes("Password")) {
          setErrors({ password: msg });
          return;
        }
      });
  }

  const handleChange = (value, index) => {
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

  const sendOTP = () => {
    const username = document.getElementById("username").value;
    axios
      .post(`${API_ENDPOINT}/api/forgotPassword?username=${username}`)
      .then((res) => {
        showAlert("success", res.data.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        showAlert("error", "Incorrect OTP, Please try again");
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    const enteredOTP = otp.toString().replaceAll(",", "");
    if (enteredOTP.length < 6)
      return showAlert("error", "Please Enter all the fileds");
    setLoading(true);
    axios
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
    axios
      .put(`${API_ENDPOINT}/api/resetPassword`, {
        token: enteredOTP,
        password: password,
      })
      .then((res) => {
        showAlert("success", res.data.data?.message);
        setUserModalOpen(false);
        setOtp(new Array(numberOfDigits).fill(""));
        setLoading(false);
        setPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.log(err);
        showAlert("error", "Something went wrong, Please try again!!!");
        setPassword("");
        setConfirmPassword("");
        setErrors({
          minValueValidation: false,
          numberValidation: false,
          capitalLetterValidation: false,
          specialCharacterValidation: false,
        });
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
                      onChange={(e) => handleChange(e.target.value, index)}
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
      <Box component="form" onSubmit={authenticateErp} sx={boxStyle}>
        <Grid container justifyContent="right">
          <Grid
            item
            xs={12}
            md={3}
            component={Paper}
            p={2}
            sx={{ borderRadius: 2 }}
            mt={2}
          >
            <Grid container rowSpacing={2}>
              <Grid item xs={12} align="center">
                <img src={logo} width={60} height={60} />
              </Grid>

              <Grid item xs={12}>
                <Divider></Divider>
              </Grid>

              <Grid item xs={12}>
                <Grid container rowSpacing={3}>
                  <Grid item xs={12} md={12} align="center">
                    <IconButton>
                      <HowToRegIcon sx={userTypeStyle} />
                    </IconButton>
                    <Typography variant="subtitle2">User</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={errors.username ? true : false}
                      margin="normal"
                      required
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoFocus
                    />
                    {errors.username && (
                      <Typography variant="caption" sx={{ color: "red" }}>
                        {errors.username}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password *
                      </InputLabel>
                      <OutlinedInput
                        id="password"
                        name="password"
                        required
                        error={errors.password ? true : false}
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                      {errors.password && (
                        <Typography
                          variant="caption"
                          sx={{ color: "red", marginTop: "6px" }}
                        >
                          {errors.password}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Button variant="contained" type="submit" sx={buttonStyle}>
                      <Typography variant="subtitle2">LOGIN</Typography>
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Link
                      to="/ForgotPassword"
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "blue.main",
                        }}
                      >
                        Forgot Password ?
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default LoginNew;
