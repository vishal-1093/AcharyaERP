import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import ApiUrl from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import axios from "axios";
import CustomModal from "../../../components/CustomModal";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  candidateName: "",
  dob: null,
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
function ApplicationForm() {
  const [values, setValues] = useState(initialValues);
  const { id } = useParams();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();
  const [isNew, setIsNew] = useState(true);
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
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

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
    dob: ["This field required", "test"],
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
    if (pathname.toLowerCase() === "/candidatewalkinmaster/candidate/new") {
      setIsNew(true);
      setCrumbs([
        { name: "CandidateWalkinMaster", link: "/CandidateWalkinMaster" },
        { name: "Candidate" },
        { name: "New" },
      ]);
    } else {
      setIsNew(false);
    }
  }, [pathname]);

  useEffect(() => {
    getSpecialization();
    getProgram();
    getSchool();
    getAcyear();
  }, []);

  const getSpecialization = () => {};
  const getProgram = () => {};

  const getAcyear = async () => {
    await axios
      .get(`${ApiUrl}/academic/academic_year`)
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
      .get(`${ApiUrl}/institute/school`)
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

  const handleschool = (name, newValue) => {
    axios.get(`${ApiUrl}/academic/fetchProgram1/${newValue}`).then((res) => {
      setProgram(
        res.data.data.map((obj) => ({
          value: obj.program_id,
          label: obj.program_name,
        }))
      );
    });

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleProgram = (name, newValue) => {
    axios
      .get(
        `${ApiUrl}/academic/FetchProgramSpecialization/${values.schoolId}/${newValue}`
      )
      .then((res) => {
        setSpecialization(
          res.data.data.map((obj) => ({
            value: obj.program_specialization_id,
            label: obj.program_specialization_name,
          }))
        );
      });
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
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const temp = {};
      temp.active = true;
      temp.candidate_name = values.candidateName;
      temp.date_of_birth = values.dob;
      temp.gender = values.gender;
      temp.father_name = values.fatherName;
      temp.program_id = values.programId;
      temp.candidate_email = values.email;
      temp.mobile_number = values.phoneNumber;
      temp.school_id = values.schoolId;
      temp.program_specilaization_id = values.SpecializationID;
      temp.ac_year_id = values.acyearId;

      await axios
        .post(`${ApiUrl}/student/Candidate_Walkin1`, temp)
        .then((response) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/CandidateWalkinMaster", { replace: true });
        })
        .catch((error) => {
          setLoading(false);
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
              alignItems="center"
              rowSpacing={4}
              columnSpacing={{ xs: 2, md: 4 }}
            >
              <Grid item xs={12} md={6}>
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

              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="candidateName"
                  label="Candidate Name"
                  value={values.candidateName ?? ""}
                  handleChange={handleChange}
                  checks={checks.candidateName}
                  errors={errorMessages.candidateName}
                  required
                  helperText=" "
                />
              </Grid>

              <Grid item xs={12} md={6}>
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

              <Grid item xs={12} md={6}>
                <CustomSelect
                  name="gender"
                  label="Gender"
                  items={[
                    { value: "M", label: "Male" },
                    { value: "F", label: "Female" },
                  ]}
                  value={values.gender ?? ""}
                  handleChange={handleChange}
                  checks={checks.gender}
                  errors={errorMessages.gender}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="fatherName"
                  label="Father Name"
                  value={values.fatherName}
                  handleChange={handleChange}
                  checks={checks.fatherName}
                  errors={errorMessages.fatherName}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="email"
                  label="Email"
                  helperText=" "
                  value={values.email}
                  handleChange={handleChange}
                  checks={checks.email}
                  errors={errorMessages.email}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="phoneNumber"
                  label="Phone Number"
                  value={values.phoneNumber}
                  handleChange={handleChange}
                  checks={checks.phoneNumber}
                  errors={errorMessages.phoneNumber}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="schoolId"
                  label="Select School"
                  options={school}
                  handleChangeAdvance={handleschool}
                  value={values.schoolId}
                  checks={checks.schoolId}
                  errors={errorMessages.schoolId}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="programId"
                  label="Select Program"
                  options={program}
                  handleChangeAdvance={handleProgram}
                  value={values.programId}
                  checks={checks.programId}
                  errors={errorMessages.programId}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomAutocomplete
                  name="SpecializationID"
                  label="Select Specialization"
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
export default ApplicationForm;
