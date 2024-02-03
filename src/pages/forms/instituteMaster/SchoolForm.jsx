import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress, Stack } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomColorInput from "../../../components/Inputs/CustomColorInput";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initialValues = {
  schoolName: "",
  shortName: "",
  orgId: null,
  jobTypeId: [],
  emailId: null,
  refNumber: "",
  priority: "",
  schoolColor: "#000000",
  webStatus: "No",
  displayName: "",
  academicStatus: false,
  saturdayWeekOff: false,
  saturdayHalfDay: false,
};

const requiredFields = [
  "schoolName",
  "shortName",
  "orgId",
  "jobTypeId",
  "emailId",
  "refNumber",
  "priority",
  "schoolColor",
  "webStatus",
  "displayName",
];

function SchoolForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
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

  const checks = {
    schoolName: [
      values.schoolName !== "",
      /^[A-Za-z ]+$/.test(values.schoolName),
    ],
    shortName: [
      values.shortName !== "",
      /^[A-Za-z ]{3,3}$/.test(values.shortName),
    ],
    jobTypeId: [values.jobTypeId.length > 0],
    refNumber: [values.refNumber],
    priority: [values.priority !== "", /^[0-9]*$/.test(values.priority)],
    displayName: [values.displayName !== ""],
  };

  const errorMessages = {
    schoolName: ["This field required", "Enter only characters"],
    shortName: [
      "This field required",
      "Enter characters and its length should be three",
    ],
    jobTypeId: ["This field is required"],
    refNumber: ["This field is required"],
    priority: ["This field is required", "Please enter a number"],
    displayName: ["This field is required"],
  };

  useEffect(() => {
    getOrgOptions();
    getJobTypeOptions();
    getEmailOptions();

    if (pathname.toLowerCase() === "/institutemaster/school/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Institute Master", link: "/InstituteMaster/School" },
        { name: "School" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getSchoolData();
    }
  }, [pathname]);

  const getOrgOptions = () => {
    axios
      .get(`/api/institute/org`)
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
      .get(`/api/employee/JobType`)
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
      .get(`/api/UserAuthentication`)
      .then((res) => {
        setEmailOptions(
          res.data.data.map((obj) => ({ value: obj.id, label: obj.email }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school/${id}`)
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
          displayName: res.data.data.display_name,
          academicStatus: res.data.data.academic_status,
        });
        setSchoolId(res.data.data.school_id);
        setCrumbs([
          { name: "InstituteMaster", link: "/InstituteMaster/School" },
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

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
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
      temp.display_name = values.displayName;
      temp.academic_status = values.academicStatus;
      temp.saturday_weekoff = values.saturdayWeekOff;
      temp.saturday_halfday = values.saturdayHalfDay;

      await axios
        .post(`/api/institute/school`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster/School", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "School created successfully !!",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
          }
          setAlertOpen(true);
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
    if (!requiredFieldsValid()) {
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
      temp.display_name = values.displayName;
      temp.academic_status = values.academicStatus;
      temp.saturday_weekoff = values.saturdayWeekOff;
      temp.saturday_halfday = values.saturdayHalfDay;

      await axios
        .put(`/api/institute/school/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/InstituteMaster/School", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "School updated successfully !!",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error",
            });
          }
          setAlertOpen(true);
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
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="schoolName"
              label="School"
              value={values.schoolName}
              handleChange={handleChange}
              disabled={!isNew}
              checks={checks.schoolName}
              errors={errorMessages.schoolName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
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
              checks={checks.shortName}
              errors={errorMessages.shortName}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="orgId"
              label="Acharya Group"
              value={values.orgId}
              options={orgOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomMultipleAutocomplete
              name="jobTypeId"
              label="Job Type"
              value={values.jobTypeId}
              options={jobTypeOptions}
              handleChangeAdvance={handleChangeJobtype}
              errors={errorMessages.jobTypeId}
              checks={checks.jobTypeId}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="emailId"
              label="Email"
              value={values.emailId}
              options={emailOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="refNumber"
              label="Reference Number"
              value={values.refNumber}
              handleChange={handleChange}
              errors={errorMessages.refNumber}
              checks={checks.refNumber}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="priority"
              label="Priority"
              value={values.priority}
              handleChange={handleChange}
              checks={checks.priority}
              errors={errorMessages.priority}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="displayName"
              label="Display Name"
              value={values.displayName}
              handleChange={handleChange}
              checks={checks.displayName}
              errors={errorMessages.displayName}
              required
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="academicStatus"
              label="Academic Status"
              value={values.academicStatus}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomColorInput
              name="schoolColor"
              label="Select Color"
              value={values.schoolColor}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={2}>
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

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="saturdayWeekOff"
              label="Saturday Week Off"
              value={values.saturdayWeekOff}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <CustomRadioButtons
              name="saturdayHalfDay"
              label="Saturday Half Day"
              value={values.saturdayHalfDay}
              items={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={1} justifyContent="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="error"
                disabled={loading}
                onClick={() => handleModalOpen("discard")}
              >
                <strong>Discard</strong>
              </Button>

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
            </Stack>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SchoolForm;
