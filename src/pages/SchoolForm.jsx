import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../components/FormWrapper";
import CustomTextField from "../components/Inputs/CustomTextField";
import CustomRadioButtons from "../components/Inputs/CustomRadioButtons";
import CustomMultipleAutocomplete from "../components/Inputs/CustomMultipleAutocomplete";
import CustomAutocomplete from "../components/Inputs/CustomAutocomplete";
import CustomColorInput from "../components/Inputs/CustomColorInput";
import CustomModal from "../components/CustomModal";
import useAlert from "../hooks/useAlert";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import ApiUrl from "../services/Api";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  schoolName: "",
  shortName: "",
  orgId: null,
  emailId: null,
  refNumber: "",
  priority: "",
  schoolColor: "",
  jobTypeId: [],
  webStatus: "",
};

const requiredFields = [
  "schoolName",
  "shortName",
  "orgId",
  "emailId",
  "refNumber",
  "priority",
  "schoolColor",
  "jobTypeId",
  "webStatus",
];

function SchoolForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [formValid, setFormValid] = useState({});
  const [orgOptions, setOrgOptions] = useState([]);
  const [emailOptions, setEmailOptions] = useState([]);
  const [jobTypeOptions, setJobTypeOptions] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [schoolId, setSchoolId] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    getOrgOptions();
    getJobTypeOptions();
    getEmailOptions();

    if (pathname.toLowerCase() === "/institutemaster/school/new") {
      setIsNew(true);
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: false }))
      );
      setCrumbs([
        { name: "InstituteMaster", link: "/InstituteMaster" },
        { name: "School" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSchoolData();
      requiredFields.forEach((keyName) =>
        setFormValid((prev) => ({ ...prev, [keyName]: true }))
      );
    }
  }, [pathname]);

  const getOrgOptions = () => {
    axios
      .get(`${ApiUrl}/institute/org`)
      .then((res) => {
        setOrgOptions(
          res.data.data.map((obj) => ({
            value: obj.org_id,
            label: obj.org_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getJobTypeOptions = () => {
    axios
      .get(`${ApiUrl}/employee/JobType`)
      .then((res) => {
        setJobTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.job_type_id,
            label: obj.job_short_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getEmailOptions = () => {
    axios
      .get(`${ApiUrl}/UserAuthentication`)
      .then((res) => {
        setEmailOptions(
          res.data.data.map((obj) => ({ value: obj.id, label: obj.email }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getSchoolData = async () => {
    await axios
      .get(`${ApiUrl}/institute/school/${id}`)
      .then((res) => {
        setValues({
          schoolName: res.data.data.school_name,
          shortName: res.data.data.school_name_short,
          orgId: res.data.data.org_id,
          emailId: res.data.data.user_id_for_email,
          refNumber: res.data.data.ref_no,
          priority: res.data.data.priority,
          schoolColor: res.data.data.school_color,
          webStatus: res.data.data.web_status,
          jobTypeId: res.data.data.job_type_id,
        });
        setSchoolId(res.data.data.school_id);
        setCrumbs([
          { name: "InstituteMaster", link: "/InstituteMaster" },
          { name: "School" },
          { name: "Update" },
          { name: res.data.data.school_name },
        ]);
      })
      .catch((err) => console.error(err));
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
    requiredFields.forEach((keyName) =>
      setFormValid((prev) => ({ ...prev, [keyName]: false }))
    );
  };

  const handleChange = (e) => {
    if (e.target.name === "shortName") {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.toUpperCase(),
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
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

  const handleCreate = async () => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.school_name = values.schoolName;
      temp.school_name_short = values.shortName;
      temp.org_id = values.orgId;
      temp.user_id_for_email = values.emailId;
      temp.ref_no = values.refNumber;
      temp.priority = values.priority;
      temp.school_color = values.schoolColor;
      temp.job_type_id = values.jobTypeId;
      temp.web_status = values.webStatus;
      await axios
        .post(`${ApiUrl}/institute/school`, temp)
        .then((res) => {
          setLoading(false);
          if (res.data.status === 200 || res.data.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form submitted successfully!",
            });
            setAlertOpen(true);
            navigate("/InstituteMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (Object.values(formValid).includes(false)) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.school_id = schoolId;
      temp.school_name = values.schoolName;
      temp.school_name_short = values.shortName;
      temp.org_id = values.orgId;
      temp.user_id_for_email = values.emailId;
      temp.ref_no = values.refNumber;
      temp.priority = values.priority;
      temp.school_color = values.schoolColor;
      temp.web_status = values.webStatus;
      temp.job_type_id = values.jobTypeId;
      await axios
        .put(`${ApiUrl}/institute/school/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.data.status === 200 || res.data.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form submitted successfully!",
            });
            setAlertOpen(true);
            navigate("/InstituteMaster", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
            setAlertOpen(true);
          }
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response ? err.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="schoolName"
              label="School"
              value={values.schoolName}
              handleChange={handleChange}
              disabled={!isNew}
              errors={["This field required", "Enter only characters"]}
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
              value={values.shortName}
              handleChange={handleChange}
              disabled={!isNew}
              inputProps={{
                style: { textTransform: "uppercase" },
                minLength: 3,
                maxLength: 3,
              }}
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
              options={orgOptions}
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
              options={jobTypeOptions}
              handleChangeAdvance={handleChangeJobtype}
              errors={["This field is required"]}
              checks={[values.jobTypeId.length > 0]}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="emailId"
              label="Email"
              value={values.emailId}
              options={emailOptions}
              handleChangeAdvance={handleChangeAdvance}
              setFormValid={setFormValid}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="refNumber"
              label="Reference Number"
              value={values.refNumber}
              handleChange={handleChange}
              errors={["This field is required"]}
              checks={[values.refNumber.length > 0]}
              setFormValid={setFormValid}
              required
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
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomColorInput
              name="schoolColor"
              label="Select Color"
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
              value={values.webStatus}
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
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              textAlign="right"
            >
              <Grid item xs={6} sm={4} md={2}>
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

              <Grid item xs={6} sm={4} md={2}>
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  onClick={isNew ? handleCreate : handleUpdate}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <strong>{isNew ? "Create" : "Update"}</strong>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SchoolForm;
