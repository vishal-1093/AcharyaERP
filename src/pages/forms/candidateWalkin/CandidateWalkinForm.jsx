import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../../components/CustomModal";
import { useNavigate, useLocation } from "react-router-dom";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

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
  SpecializationID: null,
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
  "SpecializationID",
  "acyearId",
];
function CandidateWalkinForm() {
  const [values, setValues] = useState(initialValues);
  const [specialization, setSpecialization] = useState([]);
  const [program, setProgram] = useState([]);
  const [school, setSchool] = useState([]);
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
  const navigate = useNavigate();
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
    SpecializationID: [values.SpecializationID !== null],
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
    SpecializationID: ["This field is required"],
  };

  useEffect(() => {
    getAcyear();
    getSchool();
    setCrumbs([
      { name: "Candidate Walkin", link: "/candidatewalkinindex" },
      { name: "Creation" },
    ]);
  }, [pathname]);

  useEffect(() => {
    getProgram();
    getSpecialization();
  }, [values.schoolId, values.programId]);

  const getSpecialization = async () => {
    if (values.schoolId && values.programId) {
      await axios
        .get(
          `/api/academic/FetchProgramSpecialization/${values.schoolId}/${
            programData[values.programId]
          }`
        )
        .then((res) => {
          setSpecialization(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.program_specialization_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getProgram = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/academic/fetchAllProgramsWithProgramType/${values.schoolId}`)
        .then((res) => {
          const programTemp = {};
          res.data.data.forEach((obj) => {
            programTemp[obj.program_assignment_id] = obj.program_id;
          });

          setProgramData(programTemp);
          setProgram(
            res.data.data.map((obj) => ({
              value: obj.program_assignment_id,
              label: obj.program_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const getAcyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcyearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchool(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
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
  const requiredFieldsValid = () => {
    setHighlightError(false);
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
      setHighlightError(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.candidate_name = values.candidateName;
      temp.date_of_birth = values.dob;
      temp.candidate_sex = values.gender;
      temp.father_name = values.fatherName;
      temp.program_assignment_id = values.programId;
      temp.program_id = programData[values.programId];
      temp.candidate_email = values.email;
      temp.mobile_number = values.phoneNumber;
      temp.school_id = values.schoolId;
      temp.program_specilaization_id = values.SpecializationID;
      temp.ac_year_id = values.acyearId;

      setLoading(true);
      await axios
        .post(`/api/student/Candidate_Walkin1`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/CandidateWalkinIndex", { replace: true });
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />
        <FormWrapper>
          <Box>
            <Grid
              container
              justifycontents="flex-start"
              rowSpacing={4}
              columnSpacing={{ xs: 2, md: 4 }}
            >
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
                  options={school}
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
                  options={program}
                  handleChangeAdvance={handleChangeAdvance}
                  value={values.programId}
                  checks={checks.programId}
                  errors={errorMessages.programId}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="SpecializationID"
                  label="Specialization"
                  options={specialization}
                  handleChangeAdvance={handleChangeAdvance}
                  value={values.SpecializationID}
                  checks={checks.SpecializationID}
                  errors={errorMessages.SpecializationID}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent="flex-end"
                  textAlign="right"
                  rowSpacing={3}
                >
                  <Grid item xs={12} md={1}>
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

                  <Grid item xs={12} md={1}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={handleCreate}
                    >
                      {loading ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        <strong>Create</strong>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </FormWrapper>
      </Box>
    </>
  );
}
export default CandidateWalkinForm;
