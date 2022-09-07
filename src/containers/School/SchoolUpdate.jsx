import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../components/FormWrapper";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import useAlert from "../../hooks/useAlert";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomColorInput from "../../components/Inputs/CustomColorInput";
import ApiUrl from "../../services/Api";
import axios from "axios";

const initialValues = {
  schoolName: "",
  shortName: "",
  orgId: null,
  emailId: null,
  referenceNumber: "",
  priority: "",
  schoolColor: "",
  webStatus: "",
  jobTypeId: [],
};

function SchoolUpdate() {
  const { id } = useParams();

  const [values, setValues] = useState(initialValues);

  const [formValid, setFormValid] = useState({
    schoolName: true,
    shortName: true,
    orgId: true,
    emailId: true,
    referenceNumber: true,
    priority: true,
    schoolColor: true,
    webStatus: true,
    jobTypeId: true,
  });

  const [orgdata, setOrgdata] = useState([]);
  const [email, setEmail] = useState([]);
  const [jobtype, setJobtype] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schoolId, setSchoolId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();

  const navigate = useNavigate();

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
    axios.get(`${ApiUrl}/institute/school/${id}`).then((res) => {
      console.log(res.data.data);
      setValues({
        schoolName: res.data.data.school_name,
        shortName: res.data.data.school_name_short,
        orgId: res.data.data.org_id,
        emailId: res.data.data.user_id_for_email,
        referenceNumber: res.data.data.ref_no,
        priority: res.data.data.priority,
        schoolColor: res.data.data.school_color,
        webStatus: res.data.data.web_status,
        jobTypeId: res.data.data.job_type_id,
      });
      setSchoolId(res.data.data.school_id);
    });
  };
  const getEmail = () => {
    axios.get(`${ApiUrl}/UserAuthentication`).then((res) => {
      console.log(res.data.data);
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
      const temp = {};
      temp.active = true;
      temp.school_id = schoolId;
      temp.school_name = values.schoolName;
      temp.school_name_short = values.shortName;
      temp.org_id = values.orgId;
      temp.user_id_for_email = values.emailId;
      temp.ref_no = values.referenceNumber;
      temp.priority = values.priority;
      temp.school_color = values.schoolColor;
      temp.web_status = values.webStatus;
      temp.job_type_id = values.jobTypeId;

      await axios
        .put(`${ApiUrl}/institute/school/${id}`, temp)
        .then((res) => {
          setLoading(true);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
            navigate("/InstituteMaster/SchoolIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data.message,
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.res ? error.res.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
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
                name="schoolName"
                label="School"
                disabled
                value={values.schoolName}
                handleChange={handleChange}
                fullWidth
                errors={["This field required", "Enter Only Characters"]}
                checks={[
                  values.schoolName !== "",
                  /^[A-Za-z ]+$/.test(values.schoolName),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="shortName"
                label="Short Name"
                disabled
                value={values.shortName}
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
                  values.shortName !== "",
                  /^[A-Za-z ]{3,3}$/.test(values.shortName),
                ]}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="orgId"
                label="Acharya Group"
                value={values.orgId}
                options={orgdata}
                handleChangeAdvance={handleChangeAdvance}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomMultipleAutocomplete
                name="jobTypeId"
                label="Job Type"
                value={values.jobTypeId}
                options={jobtype}
                handleChangeAdvance={handleChangeJobtype}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="emailId"
                label="Email"
                value={values.emailId}
                options={email}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="referenceNumber"
                label="Reference Number"
                value={values.referenceNumber}
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
                name="schoolColor"
                label="Select Color "
                value={values.schoolColor}
                handleChange={handleChange}
                setFormValid={setFormValid}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomRadioButtons
                name="webStatus"
                label="Web Status "
                value={values.webStatus ?? ""}
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
