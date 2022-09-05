import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomAlert from "../../components/CustomAlert";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomColorInput from "../../components/Inputs/CustomColorInput";
import ApiUrl from "../../services/Api";
import axios from "axios";

const initialValues = {
  school_name: "",
  school_name_short: "",
  org_id: null,
  email_id: null,
  ref_no: "",
  priority: "",
  school_color: "",
  web_status: "",
  job_type_id: [],
};

function SchoolUpdate() {
  const { id } = useParams();

  const [values, setValues] = useState(initialValues);

  const [formValid, setFormValid] = useState({
    school_name: true,
    school_name_short: true,
    org_id: true,
    email_id: true,
    ref_no: true,
    priority: true,
    school_color: true,
    web_status: true,
    priority: true,
    job_type_id: true,
  });

  const [orgdata, setOrgdata] = useState([]);
  const [email, setEmail] = useState([]);
  const [jobtype, setJobtype] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });

  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const getOrganization = () => {
    axios.get(`${ApiUrl}/institute/org`).then((res) => {
      setOrgdata(
        res.data.data.map((obj) => ({ value: obj.org_id, label: obj.org_name }))
      );
    });
  };
  const getJobType = () => {
    axios.get(`${ApiUrl}/employee/JobType`).then((res) => {
      setJobtype(
        res.data.data.map((obj) => ({
          value: obj.job_type_id,
          label: obj.job_short_name,
        }))
      );
    });
  };

  const getSchool = () => {
    axios.get(`${ApiUrl}/institute/school/${id}`).then((Response) => {
      setValues(Response.data.data);
    });
  };
  const getEmail = () => {
    axios.get(`${ApiUrl}/UserAuthentication`).then((res) => {
      setEmail(
        res.data.data.map((obj) => ({ value: obj.id, label: obj.email }))
      );
    });
  };

  useEffect(() => {
    getOrganization();
    getJobType();
    getSchool();
    getEmail();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "school_name_short") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
        active: true,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        active: true,
      }));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeJobtype = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formValid).includes(false)) {
      console.log("failed");
      setAlertMessage({
        severity: "error",
        message: "Error",
      });
      setAlertOpen(true);
    } else {
      await axios
        .put(`${ApiUrl}/institute/school/${id}`, values)
        .then((response) => {
          console.log(response);
          setAlertMessage({
            severity: "success",
            message: response.data.data,
          });
          navigate("/InstituteMaster/SchoolIndex", { replace: true });
        })
        .catch((error) => {
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <CustomAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          severity={alertMessage.severity}
          message={alertMessage.message}
        />
        <FormWrapper>
          <Grid
            container
            justifycontents="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="school_name"
                label="School"
                disabled
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
                disabled
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
                options={orgdata}
                handleChangeAdvance={handleChangeAdvance}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomMultipleAutocomplete
                name="job_type_id"
                label="Job Type"
                value={values.job_type_id}
                options={jobtype}
                handleChangeAdvance={handleChangeJobtype}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="email_id"
                label="Email"
                value={values.user_id_for_email}
                options={email}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="ref_no"
                label="Reference Number"
                value={values.ref_no ?? ""}
                handleChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="priority"
                label="Priority"
                value={values.priority}
                handleChange={handleChange}
                errors={["This field is required", "Please enter a number"]}
                checks={[
                  values.priority !== "",
                  /^[0-9]*$/.test(values.priority),
                ]}
                setFormValid={setFormValid}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomColorInput
                name="school_color"
                label="Select Color "
                value={values.school_color}
                handleChange={handleChange}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomRadioButtons
                name="web_status"
                label="Web Status "
                value={values.web_status ?? ""}
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
                fullWidth
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
                  <>Update</>
                )}
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default SchoolUpdate;
