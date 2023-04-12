import { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import background from "../../assets/background.jpeg";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomPassword from "../../components/Inputs/CustomPassword";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const styles = makeStyles((theme) => ({
  form: {
    padding: "10px 0",
    background: `url(${background})`,
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  },
  textField: {
    cursor: "none",
  },
  btn: {
    fontStyle: "normal",
  },
  anchorTag: {
    textDecoration: "none",
    color: theme.palette.blue.main,
    fontStyle: "normal",
  },
}));

function StaffLogin({ setAlertOpen, setAlertMessage }) {
  const [values, setValues] = useState({
    active: true,
    username: "",
    password: "",
  });

  const classes = styles();

  const navigate = useNavigate();

  function authenticateErp(e) {
    e.preventDefault();
    if (!(values.username && values.password)) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      axios
        .post(
          `https://www.stageapi-acharyainstitutes.in/api/authenticate`,
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
                `https://www.stageapi-acharyainstitutes.in/api/findRoles/${response.data.data.userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${response.data.data.token}`,
                  },
                }
              )
              .then((res) => {
                localStorage.setItem(
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

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box component="form" height="70%">
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={2}
      >
        <Grid item xs={12} mt={1}>
          <CustomTextField
            name="username"
            label="Enter Username"
            value={values.username}
            handleChange={handleChange}
            helperText=" "
            errors={["This field is required"]}
            checks={[values.username !== ""]}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomPassword
            name="password"
            label="Password"
            value={values.password}
            handleChange={handleChange}
            helperText=" "
            errors={["This field is required"]}
            checks={[values.password !== ""]}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            className={classes.btn}
            variant="contained"
            onClick={authenticateErp}
          >
            LOGIN
          </Button>
        </Grid>
        <Grid item xs={12} textAlign="left" mt={1} ml={1}>
          <a href="/ForgotPassword" className={classes.anchorTag}>
            Forgot Password?
          </a>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StaffLogin;
