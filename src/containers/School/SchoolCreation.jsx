import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomSelectSearch from "../../components/Inputs/CustomSelectSearch";
import ApiUrl from "../../services/Api";
import CustomSnackbar from "../../components/CustomSnackbar";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import axios from "axios";
function SchoolCreation() {
  useEffect(() => {
    getOrganization();
    getJobType();
  }, []);
  const [values, setValues] = useState({
    school_name: "",
    school_name_short: "",
    org_id: null,
    email_id: "",
    ref_no: "",
    priority: "",
    school_color: "",
    web_status: "",
    active: true,
  });

  const [formValid, setFormValid] = useState({
    school_name: false,
    school_name_short: false,
    org_id: false,
    email_id: false,
  });

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [orgdata, setOrgdata] = useState([]);
  const [jobtype, setJobtype] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    severity: "error",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const getOrganization = () => {
    axios.get(`${ApiUrl}/institute/org`).then((Response) => {
      setOrgdata(Response.data.data);
    });
  };
  const getJobType = () => {
    axios.get(`${ApiUrl}/employee/JobType`).then((Response) => {
      setJobtype(Response.data.data);
    });
  };

  const options = orgdata.map((m) => ({
    label: m.org_name,
    value: m.org_id,
  }));
  const Jobtypeoptions = jobtype.map((m) => ({
    label: m.job_short_name,
    value: m.job_type_id,
  }));

  const handleJobtype = (e, v) => {
    v.map((m) => {
      data1.push(m.value);
      data2.push(m.label);
    });
    setData1([]);
    setData2([]);
    setValues({
      ...values,
      job_type_id: data1.toString(),
      job_type_name: data2.toString(),
    });
  };

  const handleEmail = (e) => {
    setValues((prev) => ({
      ...prev,
      email_id: e.target.value,
    }));
  };
  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      active: true,
    }));
  };
  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formValid).includes(false)) {
      setSnackbarMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setSnackbarOpen(true);
    } else {
      console.log("submitted");
      console.log(values);
      await axios
        .post(`${ApiUrl}/institute/school`, values)
        .then((response) => {
          console.log(response);
          setSnackbarMessage({
            severity: "success",
            message: response.data.data,
          });
          if (response.status === 200) {
            window.location.href = "/SchoolIndex";
          }
          if (response.status === 201) {
            window.location.href = "/SchoolIndex";
          }
        })
        .catch((error) => {
          setSnackbarMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setSnackbarOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" style={{ padding: "40px" }}>
        <FormLayout>
          <Box>
            <Grid
              container
              justifycontents="flex-start"
              alignItems="center"
              rowSpacing={2}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <CustomSnackbar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                severity={snackbarMessage.severity}
                message={snackbarMessage.message}
              />
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="school_name"
                  label="School"
                  value={values.school_name}
                  handleChange={handleChange}
                  fullWidth
                  errors={["This field required", "Enter Only Characters"]}
                  checks={[
                    values.school_name !== "",
                    /^[A-Za-z ]+$/.test(values.school_name),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="school_name_short"
                  label="Short Name"
                  value={values.school_name_short}
                  handleChange={handleChange}
                  inputProps={{
                    style: { textTransform: "uppercase" },
                    minLength: 3,
                    maxLength: 3,
                  }}
                  fullWidth
                  errors={[
                    "This field required",
                    "Enter characters and its length should be three",
                  ]}
                  checks={[
                    values.school_name_short !== "",
                    /^[A-Za-z ]{3,3}$/.test(values.school_name_short),
                  ]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="org_id"
                  label="Acharya Group"
                  value={values.org_id}
                  options={options}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomSelectSearch
                  options={Jobtypeoptions}
                  label="Job Type"
                  handleChange={handleJobtype}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="email"
                  name="email_id"
                  label="Email"
                  handleChange={handleEmail}
                  fullWidth
                  errors={["This field required"]}
                  checks={[values.email_id !== ""]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="number"
                  name="ref_no"
                  label="Reference Number"
                  value={values.ref_no}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="number"
                  name="priority"
                  label="Priority"
                  value={values.priority}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  type="color"
                  name="school_color"
                  label="Select Color "
                  value={values.school_color}
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomRadioButtons
                  name="web_status"
                  label="Web Status "
                  value={values.web_status}
                  items={[
                    {
                      value: "Yes",
                      label: "Yes",
                    },
                    {
                      value: "No",
                      label: "No",
                    },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
          </Box>
        </FormLayout>
      </Box>
    </>
  );
}
export default SchoolCreation;
