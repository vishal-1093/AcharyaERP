import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Password } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "80vw",
    margin: "25px auto",
    padding: "20px",
    minHeight: "400px",
    [theme.breakpoints.down("md")]: {
      width: "90vw",
    },
  },
  form: {
    padding: "10px 0",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const initialState = {
  userName: "",
  userEmail: "",
  userRole: "",
  userType: "",
};

export default function UserCreationForm() {
  const classes = useStyles();
  const [userForm, setUserForm] = useState(initialState);

  const onChange = (event) => {
    setUserForm({
      ...userForm,
      [event.target.name]: event.target.value,
    });
  };

  const onBlurUserName = (event) => {
    if (userForm.userName) {
      setUserForm({
        ...userForm,
        userEmail: `${userForm.userName}@acharya.ac.in`,
      });
    }
  };
  const handleClear = () => {
    console.log("clearing");
    setUserForm(initialState);
  };

  const handleSubmit = () => {
    console.log("User submitted", userForm);
    setUserForm(initialState);
    let url =
      "https://www.stageapi-acharyainstitutes.in/api/UserAuthentication";
    axios.post(url, userForm).then((response) => {
      // localStorage.setItem('userData',response);
      // username:"userForm.userName",
      // userEmail: "userForm.userEmail",
      console.log("postrequest", response);
    });
  };
  return (
    <Paper elevation={2} sx={{ borderRadius: 3 }} className={classes.paper} >
      <Box component="form" className={classes.form}>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <>
            <Grid item xs={12}>
              <center>
                {" "}
                <h2>Guest User Creation</h2>
              </center>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                id="Username"
                fullWidth
                label="Username*"
                size="small"
                variant="outlined"
                name="userName"
                value={userForm.userName}
                onChange={onChange}
                onBlur={onBlurUserName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="Email"
                fullWidth
                label="Email*"
                size="small"
                variant="outlined"
                name="userEmail"
                value={userForm.userEmail}
                onChange={onChange}
              />
            </Grid>
          </>

          <>
            <Grid item xs={12} md={6}>
              <FormControl sx={{ minWidth: 505 }}>
                <InputLabel id="demo-simple-select-label">Role*</InputLabel>
                <Select
                  fullWidth
                  name="userRole"
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={userForm.userRole}
                  label="Role"
                  onChange={onChange}
                >
                  <MenuItem value={"developer"}>Developer</MenuItem>
                  <MenuItem value={"manager"}>Manager</MenuItem>
                  <MenuItem value={"tester"}>Tester</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl sx={{ minWidth: 505 }}>
                <InputLabel id="demo-simple-select-label">UserType</InputLabel>
                <Select
                  fullWidth
                  name="userType"
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={userForm.userType}
                  label="UserType"
                  onChange={onChange}
                >
                  <MenuItem value={"teaching"}>Teaching</MenuItem>
                  <MenuItem value={"non-teaching"}>Non Teaching</MenuItem>
                  <MenuItem value={"staff"}>staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>
          <Grid item xs={12} className={classes.footer}>
            {/* <Button variant="outlined" style={{ marginTop: '10px', marginRight: '8px', borderRadius: '20px' }} onClick={handleClear}>Clear</Button> */}
            <Button
              variant="contained"
              style={{ marginTop: "10px", borderRadius: "20px" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
