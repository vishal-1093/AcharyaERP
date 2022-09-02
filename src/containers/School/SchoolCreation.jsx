import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormLayout from "../../components/FormLayout";
import CustomTextField from "../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";
import CustomMultipleAutocomplete from "../../components/Inputs/CustomMultipleAutocomplete";
import ApiUrl from "../../services/Api";
import CustomAlert from "../../components/CustomAlert";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomColorInput from "../../components/Inputs/CustomColorInput";
import axios from "axios";
import CustomModal from "../../components/CustomModal";
import { useNavigate } from "react-router-dom";
const initialValues = {
  school_name: "",
  school_name_short: "",
  org_id: null,
  user_id_for_email: null,
  ref_no: "",
  priority: "",
  school_color: "",
  web_status: "",
  job_type: [],
};

function SchoolCreation() {
  useEffect(() => {
    getOrganization();
    getJobType();
    getEmail();
  }, []);
  const [values, setValues] = useState(initialValues);

  const [formValid, setFormValid] = useState({
    school_name: false,
    school_name_short: false,
    org_id: false,
    user_id_for_email: false,
    job_type: false,
    ref_no: false,
    priority: false,
  });

  const [orgdata, setOrgdata] = useState([]);
  const [jobtype, setJobtype] = useState([]);
  const [email, setEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    severity: "error",
    message: "",
  });
  const navigate = useNavigate();

  const [alertOpen, setAlertOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const getOrganization = () => {
    axios.get(`${ApiUrl}/institute/org`).then((res) => {
      setOrgdata(
        res.data.data.map((obj) => ({ value: obj.org_id, label: obj.org_name }))
      );
    });
  };
  const getJobType = () => {
    axios.get(`${ApiUrl}/employee/JobType`).then((res) => {
      console.log(res);
      setJobtype(
        res.data.data.map((obj) => ({
          value: obj.job_type_id,
          label: obj.job_short_name,
        }))
      );
    });
  };

  const getEmail = () => {
    axios.get(`${ApiUrl}/UserAuthentication`).then((res) => {
      setEmail(
        res.data.data.map((obj) => ({ value: obj.id, label: obj.email }))
      );
    });
  };

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
  const handleModalOpen = (action) => {
    if (action === "discard") {
      setModalContent({
        title: "",
        message: "Are you sure ? All fields will be discarded.",
        buttons: [
          {
            name: "Continue",
            color: "primary",
            func: handleDiscard,
          },
        ],
      });
      setModalOpen(true);
    }
  };

  const handleDiscard = () => {
    setValues(initialValues);
    setFormValid({
      school_name: false,
      school_name_short: false,
      org_id: false,
      user_id_for_email: false,
      job_type: false,
      ref_no: false,
      priority: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(values);
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      await axios
        .post(`${ApiUrl}/institute/school`, values)
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
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <FormLayout>
          <Box>
            <Grid
              container
              justifycontents="flex-start"
              alignItems="center"
              rowSpacing={4}
              columnSpacing={{ xs: 2, md: 4 }}
            >
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
                  options={orgdata}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomMultipleAutocomplete
                  name="job_type"
                  label="Job Type"
                  value={values.job_type}
                  options={jobtype}
                  handleChangeAdvance={handleChangeJobtype}
                  errors={["This field is required"]}
                  checks={[values.job_type.length > 0]}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="user_id_for_email"
                  label="Email"
                  value={values.user_id_for_email}
                  options={email}
                  handleChangeAdvance={handleChangeAdvance}
                  setFormValid={setFormValid}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="ref_no"
                  label="Reference Number"
                  value={values.ref_no}
                  handleChange={handleChange}
                  errors={["This field is required"]}
                  checks={[values.ref_no.length > 0]}
                  setFormValid={setFormValid}
                  required
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
                  errors={["This field is required"]}
                  checks={[values.priority.length > 0]}
                  setFormValid={setFormValid}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomColorInput
                  name="school_color"
                  label="Select Color"
                  value={values.school_color}
                  handleChange={handleChange}
                  setFormValid={setFormValid}
                  required
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
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                >
                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="error"
                      disabled={loading}
                      onClick={() => handleModalOpen("discard")}
                    >
                      <strong>Discard</strong>
                    </Button>
                  </Grid>

                  <Grid item xs={2}>
                    <Button
                      style={{ borderRadius: 7 }}
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
                        <strong>Submit</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </FormLayout>
      </Box>
    </>
  );
}
export default SchoolCreation;
