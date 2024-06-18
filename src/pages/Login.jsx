import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
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

const initialValues = {
  username: "",
  password: "",
};

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
  const [values, setValues] = useState(initialValues);
  const [type, setType] = useState("staff");

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("AcharyaErpUser"));
    if (token) return navigate("/Dashboard");
  }, []);

  const checks = {
    username: [values.username !== ""],
    password: [values.password !== ""],
  };

  const errorMessages = {
    username: ["This field required"],
    password: ["This field required"],
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  function authenticateErp(e) {
    e.preventDefault();
    if (!(values.username && values.password)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      axios
        .post(
          `https://96e8-106-51-60-204.ngrok-free.app/api/authenticate`,
          values,
          {
            // headers: {
            //   "Content-Type": "application/json",
            //   Accept: "application/json",
            // },
            body: JSON.stringify(values),
          }
        )
        .then((response) => {
          if (values.username === response.data.data.userName) {
            axios
              .get(
                `https://96e8-106-51-60-204.ngrok-free.app/api/findRoles/${response.data.data.userId}`,
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
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
          setAlertOpen(true);
        });
    }
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
                <Divider>
                  <Typography variant="subtitle2">
                    Select Account Type
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <Grid container rowSpacing={3}>
                  <Grid item xs={6} md={6} align="center">
                    <IconButton onClick={() => setType("staff")}>
                      {type === "staff" ? (
                        <HowToRegIcon sx={userTypeStyle} />
                      ) : (
                        <PermIdentityIcon sx={{ fontSize: 40 }} />
                      )}
                    </IconButton>
                    <Typography variant="subtitle2">STAFF</Typography>
                  </Grid>

                  <Grid item xs={6} md={6} align="center">
                    <IconButton onClick={() => setType("student")}>
                      {type === "student" ? (
                        <HowToRegIcon sx={userTypeStyle} />
                      ) : (
                        <PermIdentityIcon sx={{ fontSize: 40 }} />
                      )}
                    </IconButton>
                    <Typography variant="subtitle2">STUDENT</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <CustomTextField
                      name="username"
                      label={type === "student" ? "AUID" : "Username"}
                      value={values.username}
                      handleChange={handleChange}
                      checks={checks.username}
                      errors={errorMessages.username}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CustomPassword
                      name="password"
                      label="Password"
                      value={values.password}
                      handleChange={handleChange}
                      checks={checks.username}
                      errors={errorMessages.username}
                    />
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
