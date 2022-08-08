import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomSnackbar from "../../components/CustomSnackbar";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomSelect from "../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";
import CustomPassword from "../../components/Inputs/CustomPassword";
import axios from "axios";

function FormExample() {
  // every field in this
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "", // optional field
    link: "", // optional field
    password: "",
    gender: "",
    status: "", // optional field
    maritalStatus: "",
    degree: "", // optional field
    country: null,
    city: null, // optional field
    joinDate: null,
    completeDate: null, // optional field
  });

  // only required fields in this
  const [formValid, setFormValid] = useState({
    name: false,
    email: false,
    password: false,
    gender: false,
    maritalStatus: false,
    country: false,
    joinDate: false,
  });
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "error",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // for autocomplete and date picker
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setSnackbarMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setSnackbarOpen(true);
    } else {
      // setLoading(true);
      await axios
        .post(``)
        .then((res) => {
          // setLoading(false);
          setSnackbarMessage({
            severity: "success",
            message: res.data.message,
          });
          setSnackbarOpen(true);
        })
        .catch((err) => {
          // setLoading(false);
          setSnackbarMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setSnackbarOpen(true);
          console.log(err);
        });
    }
  };

  // useEffect(() => console.log(formValid), [formValid]);
  useEffect(() => console.log(values), [values]);

  return (
    <Box component="form" style={{ padding: "40px" }}>
      <CustomSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        severity={snackbarMessage.severity}
        message={snackbarMessage.message}
      />

      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        rowSpacing={4}
        columnSpacing={{ xs: 2, md: 4 }}
      >
        {/* first row */}
        <>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="name"
              label="Name"
              value={values.name}
              handleChange={handleChange}
              helperText="As per aadhaar card"
              errors={["This field is required"]} // every required text field first check should be empty or not.
              checks={[values.name !== ""]}
              setFormValid={setFormValid}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="email"
              label="Email"
              value={values.email}
              handleChange={handleChange}
              helperText=" "
              errors={["This field is required", "Invalid email"]} // this is required field so first check has to be empty or not.
              checks={[
                values.email !== "",
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  values.email
                ),
              ]}
              setFormValid={setFormValid}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomPassword
              name="password"
              label="Password"
              helperText="Helper text"
              value={values.password}
              handleChange={handleChange}
              errors={[
                "This field is required",
                "Must be longer than 4 characters",
                "Must be shorter than 10 characters",
                "Must contain at least one alphabet",
                "Must contain at least one number",
                "Must contain at least one special character",
              ]}
              checks={[
                values.password !== "",
                values.password.length > 4,
                values.password.length < 10,
                /[a-zA-Z]/.test(values.password),
                /[0-9]/.test(values.password),
                /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(values.password),
              ]}
              setFormValid={setFormValid}
              fullWidth
            />
          </Grid>
        </>

        {/* second row */}
        <>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="link"
              label="Link"
              value={values.link}
              handleChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="phone"
              value={values.phone}
              handleChange={handleChange}
              label="Phone"
              errors={["Invalid phone"]} // since this is optional field we do not add the check for empty or not. only checking other things.
              checks={[/^[0-9]{10}$/.test(values.phone)]}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4} />
        </>

        {/* 3rd row */}
        <>
          <Grid item xs={12} md={4}>
            Radio buttons
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="gender"
              label="Gender"
              value={values.gender}
              items={[
                { value: "M", label: "Male" },
                { value: "F", label: "Female" },
              ]}
              handleChange={handleChange}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="status"
              label="Status"
              value={values.status}
              items={[
                { value: "W", label: "Working" },
                { value: "N", label: "Not working" },
              ]}
              handleChange={handleChange}
            />
          </Grid>
        </>

        {/* 4th row */}
        <>
          <Grid item xs={12} md={4}>
            Select field
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="maritalStatus"
              label="Marital Status"
              value={values.maritalStatus}
              items={[
                { value: "M", label: "Married" },
                { value: "U", label: "Unmarried" },
                { value: "D", label: "Divorced" },
                { value: "W", label: "Widow" },
              ]}
              handleChange={handleChange}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomSelect
              name="degree"
              label="Degree"
              value={values.degree}
              items={[
                { value: "BE", label: "BE" },
                { value: "ME", label: "ME" },
                { value: "BSc", label: "BSc" },
              ]}
              handleChange={handleChange}
            />
          </Grid>
        </>

        {/* 5th row */}
        <>
          <Grid item xs={12} md={4}>
            Autocomplete field
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="country"
              label="Country"
              value={values.country}
              options={[
                { value: 0, label: "India" },
                { value: 1, label: "USA" },
                { value: 2, label: "Egypt" },
                { value: 3, label: "UAE" },
              ]}
              handleChangeAdvance={handleChangeAdvance}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="city"
              label="City"
              value={values.city}
              options={[
                { value: 0, label: "Bangalore" },
                { value: 1, label: "New York" },
                { value: 2, label: "Al Giza" },
                { value: 3, label: "Ajman" },
              ]}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
        </>

        {/* 6th row */}
        <>
          <Grid item xs={12} md={4}>
            Date picker
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="joinDate"
              label="Date of joining"
              value={values.joinDate}
              handleChangeAdvance={handleChangeAdvance}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="completeDate"
              label="Date of completion"
              value={values.completeDate}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
        </>

        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <>Submit</>
            )}
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="secondary"
            disabled={loading}
            onClick={handleSubmit}
          >
            Discard
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FormExample;
