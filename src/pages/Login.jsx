import { useEffect, useState } from "react";
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
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CustomTextField from "../components/Inputs/CustomTextField";
import CustomPassword from "../components/Inputs/CustomPassword";
import { Link, useNavigate } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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

const userTypeStyle = { fontSize: 40, color: "blue.main" };

function LoginNew() {
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"));
    if (token) return navigate("/Dashboard");
  }, []);

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
      .post(`http://192.168.0.104:8080/api/authenticate`, values, {
        // headers: {
        //   "Content-Type": "application/json",
        //   Accept: "application/json",
        // },
        body: JSON.stringify(values),
      })
      .then((response) => {
        if (values.username === response.data.data.userName) {
          axios
            .get(
              `http://192.168.0.104:8080/api/findRoles/${response.data.data.userId}`,
              {
                headers: {
                  Authorization: `Bearer ${response.data.data.token}`,
                  "ngrok-skip-browser-warning": true,
                },
              }
            )
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
                  })
                );
              }

              setAlertMessage({ severity: "success", message: "" });
              navigate("/Dashboard", { replace: true });
              window.location.reload();
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((error) => {
        console.error(error);
        const msg = error.response?.data.message;
        const statusCode = error.response?.status;
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

  return (
    <>
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
