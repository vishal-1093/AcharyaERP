import { memo, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Grid } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";

const genderList = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];

const PersonalDetailsForm = memo(
  ({ values, setValues, checks, errorMessages }) => {
    const [country, setCountry] = useState([]);
    const { setAlertMessage, setAlertOpen } = useAlert();

    useEffect(() => {
      getCountry();
    }, []);

    const getCountry = async () => {
      try {
        const { data: response } = await axios("/api/nationality");
        const optionData = [];
        response.forEach((obj) => {
          optionData.push({
            value: obj.nationality_id,
            label: obj.nationality,
          });
        });
        setCountry(optionData);
      } catch (err) {
        setAlertMessage({
          severity: "error",
          message:
            err.response?.data?.message || "Failed to fetch country data",
        });
        setAlertOpen(true);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeAdvance = (name, newValue) => {
      setValues((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
      <Grid container rowSpacing={3} columnSpacing={3}>
        <Grid item xs={12} md={3}>
          <CustomTextField
            name="studentName"
            label="Student Name"
            value={values.studentName}
            handleChange={handleChange}
            checks={checks.studentName}
            errors={errorMessages.studentName}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomDatePicker
            name="dob"
            label="Date of Birth"
            value={values.dob}
            handleChangeAdvance={handleChangeAdvance}
            maxDate={new Date(`12/31/${new Date().getFullYear() - 15}`)}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomRadioButtons
            name="gender"
            label="Gender"
            value={values.gender}
            items={genderList}
            handleChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="mobileNo"
            label="Mobile No."
            value={values.mobileNo}
            handleChange={handleChange}
            checks={checks.mobileNo}
            errors={errorMessages.mobileNo}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="alternateMobile"
            label="Alternate Mobile No."
            value={values.alternateMobile}
            handleChange={handleChange}
            checks={checks.alternateMobile}
            errors={errorMessages.alternateMobile}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="whatsAppNo"
            label="Whatapp No."
            value={values.whatsAppNo}
            handleChange={handleChange}
            checks={checks.whatsAppNo}
            errors={errorMessages.whatsAppNo}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="email"
            label="Personal Email"
            value={values.email}
            handleChange={handleChange}
            checks={checks.email}
            errors={errorMessages.email}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="religion"
            label="Religion"
            value={values.religion}
            handleChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="casteCategory"
            label="Caste Category"
            value={values.casteCategory}
            handleChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="bloodGroup"
            label="Blood Group"
            value={values.bloodGroup}
            handleChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="maritalStatus"
            label="Marital Status"
            value={values.maritalStatus}
            handleChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomTextField
            name="aadharNo"
            label="Aadhar No."
            value={values.aadharNo}
            handleChange={handleChange}
            checks={checks.aadharNo}
            errors={errorMessages.aadharNo}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <CustomAutocomplete
            name="nationality"
            label="Nationality"
            value={Number(values.nationality)}
            options={country}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>
      </Grid>
    );
  }
);

export default PersonalDetailsForm;
