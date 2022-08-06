import { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import CustomSnackbar from "../../components/CustomSnackbar";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomSelect from "../../components/Inputs/CustomSelect";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../components/Inputs/CustomDatePicker";

const emailExists = false;

function FormExample() {
  // every field in this
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    link: "", // optional field
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
    phone: false,
    gender: false,
    maritalStatus: false,
    country: false,
    joinDate: false,
  });
  const [submitError, setSubmitError] = useState(true);
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
    if (Object.values(formValid).includes(false)) {
      setSubmitError(true);
      console.log("failed");
      setSnackbarOpen(true);
    } else {
      setSubmitError(false);
      console.log("submitted");
      setSnackbarOpen(true);
      // ... rest of the lines after submitting
    }
  };

  // useEffect(() => console.log(formValid), [formValid]);
  // useEffect(() => console.log(values), [values]);

  return (
    <Box component="form" style={{ padding: "40px" }}>
      <CustomSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        severity={submitError ? "error" : "success"}
        message={
          submitError ? "Please fill all required fields" : "Form submitted"
        }
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
              fullWidth
              helperText="As per aadhaar card"
              errors={["this field required"]}
              checks={[values.name !== ""]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="email"
              label="Email"
              value={values.email}
              handleChange={handleChange}
              fullWidth
              errors={["invalid email", "email already exists"]}
              checks={[
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  values.email
                ),
                !emailExists,
              ]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="phone"
              value={values.phone}
              handleChange={handleChange}
              fullWidth
              label="Phone"
              errors={["invalid phone"]}
              checks={[/^[0-9]{10}$/.test(values.phone)]}
              setFormValid={setFormValid}
              required
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

        {/* 3rd row */}
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

        {/* 4th row */}
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

        {/* 5th row */}
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

        <Grid item xs={4}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FormExample;
