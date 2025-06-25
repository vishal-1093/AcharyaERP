import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../../components/CustomModal";
import { useLocation } from "react-router-dom";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import moment from "moment";

const initialValues = {
  candidateName: "",
  //min DOB shold be 15 years befor than current year
  dob: new Date(`12/31/${new Date().getFullYear() - 15}`),
  gender: "",
  fatherName: "",
  email: "",
  phoneNumber: "",
  schoolId: null,
  programId: null,
  acyearId: null,
};

const requiredFields = [
  "candidateName",
  "dob",
  "gender",
  "fatherName",
  "email",
  "phoneNumber",
  "schoolId",
  "programId",
  "acyearId",
];

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function CandidateWalkinForm() {
  const [values, setValues] = useState(initialValues);
  const [programOptions, setProgramOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [programData, setProgramData] = useState();
  const [highlightError, setHighlightError] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  const checks = {
    candidateName: [
      values.candidateName !== "",
      values.candidateName.trim().split(/ +/).join(" "),
    ],
    dob: [values.dob !== null],
    gender: [values.gender !== ""],
    fatherName: [
      values.fatherName !== "",
      values.fatherName.trim().split(/ +/).join(" "),
    ],
    email: [
      values.email !== "",
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        values.email
      ),
      values.email.trim().split(/ +/).join(" "),
    ],
    phoneNumber: [
      values.phoneNumber !== "",
      /^[0-9]{10}$/.test(values.phoneNumber),
    ],
    schoolId: [values.schoolId !== null],
    acyearId: [values.acyearId !== null],
    programId: [values.programId !== null],
  };

  const errorMessages = {
    candidateName: ["This field required"],
    dob: ["This field required"],
    gender: ["This field is required"],
    fatherName: ["This field is required"],
    email: ["This field is required", "Invalid email"],
    phoneNumber: ["This field is required", "Invalid phone"],
    schoolId: ["This field is required"],
    acyearId: ["This field is required"],
    programId: ["This field is required"],
  };

  useEffect(() => {
    getDetails();
  }, [pathname]);

  useEffect(() => {
    getProgram();
  }, [values.schoolId]);

  const getDetails = async () => {
    try {
      const [{ data: acyearResponse }, { data: schoolResponse }] =
        await Promise.all([
          axios.get("/api/academic/academic_year"),
          axios.get("/api/institute/school"),
        ]);

      const acyearOptionData = [];
      const filteredAcyear = acyearResponse?.data.filter(
        (obj) => obj.current_year >= 2024
      );
      filteredAcyear?.forEach((obj) => {
        acyearOptionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });

      const schoolOptionData = [];
      schoolResponse?.data?.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });

      setAcyearOptions(acyearOptionData);
      setSchoolOptions(schoolOptionData);

      setCrumbs([{ name: "Candidate Walkin" }, { name: "Create" }]);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data",
      });
      setAlertOpen(true);
    }
  };

  const getProgram = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});
      setProgramOptions(optionData);
      setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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
    const {
      candidateName,
      dob,
      gender,
      fatherName,
      programId,
      email,
      phoneNumber,
      schoolId,
      acyearId,
    } = values;

    try {
      setLoading(true);
      const schoolName = schoolOptions.find(
        (obj) => obj.value === schoolId
      )?.label;
      const postData = {
        active: true,
        candidate_name: candidateName,
        date_of_birth: moment(dob).format("DD-MM-YYYY"),
        candidate_sex: gender,
        father_name: fatherName,
        program_assignment_id: programData[programId].program_assignment_id,
        program_id: programData[programId].program_id,
        candidate_email: email,
        mobile_number: phoneNumber,
        school_id: schoolId,
        ac_year_id: acyearId,
        program_specilaization_id: programId,
        counselor_id: userId,
        counselor_name: userName,
        application_status: "Submitted",
      };

      const { data: response } = await axios.post(
        "/api/student/Candidate_Walkin1",
        postData
      );
      if (response.status) {
        setAlertMessage({
          severity: "success",
          message: "Candidate has been created successfully",
        });
        setAlertOpen(true);
        setValues(initialValues);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to create the candidate",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <FormPaperWrapper>
        <Box>
          <Grid container columnSpacing={4} rowSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={4}>
              <CustomTextField
                key="candidateName"
                name="candidateName"
                label="Candidate Name"
                value={values.candidateName}
                handleChange={handleChange}
                checks={checks.candidateName}
                errors={errorMessages.candidateName}
                highlightError={highlightError}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="dob"
                label="Date of Birth"
                handleChangeAdvance={handleChangeAdvance}
                maxDate={new Date(`12/31/${new Date().getFullYear() - 15}`)}
                value={values.dob}
                checks={checks.dob}
                errors={errorMessages.dob}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomRadioButtons
                name="gender"
                label="Gender"
                items={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
                value={values.gender}
                handleChange={handleChange}
                checks={checks.gender}
                errors={errorMessages.gender}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                key="fatherName"
                name="fatherName"
                label="Father Name"
                value={values.fatherName}
                handleChange={handleChange}
                checks={checks.fatherName}
                errors={errorMessages.fatherName}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                key="email"
                name="email"
                label="Email"
                value={values.email}
                handleChange={handleChange}
                checks={checks.email}
                errors={errorMessages.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                key="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                value={values.phoneNumber}
                handleChange={handleChange}
                checks={checks.phoneNumber}
                errors={errorMessages.phoneNumber}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="acyearId"
                label="Ac Year"
                options={acyearOptions}
                handleChangeAdvance={handleChangeAdvance}
                value={values.acyearId}
                checks={checks.acyearId}
                errors={errorMessages.acyearId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                value={values.schoolId}
                checks={checks.schoolId}
                errors={errorMessages.schoolId}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="programId"
                label="Program"
                options={programOptions}
                handleChangeAdvance={handleChangeAdvance}
                value={values.programId}
                checks={checks.programId}
                errors={errorMessages.programId}
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading || !requiredFieldsValid()}
                onClick={handleCreate}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Create"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormPaperWrapper>
    </Box>
  );
}
export default CandidateWalkinForm;
