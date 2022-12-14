import { useState, useEffect } from "react";
import { Grid, Button, CircularProgress, Box } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = {
  acYearId: "",
  schoolId: "",
  programId: "",
  programTypeId: "",
  graduationId: "",
  numberOfYears: "",
  numberOfSemester: "",
};

const requiredFields = ["numberOfYears"];

function ProgramAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);
  const [academicData, setAcademicData] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [graduationOptions, setGraduationOptions] = useState([]);
  const [programtypeOptions, setProgramtypeOptions] = useState([]);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  useEffect(() => {
    getAcademicyear();
    getSchool();
    getProgram();
    getGraduation();
    getProgramType();
    if (pathname.toLowerCase() === "/academicmaster/programassignment/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster/Assign" },
        { name: "Assignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getProgramAssignmentData();
    }
  }, []);

  const checks = {
    numberOfYears: [values.numberOfYears !== ""],
  };

  const errorMessages = {
    acYearId: ["This field required"],
    schoolId: ["This field required"],
    programId: ["This field required"],
    programTypeId: ["This field required"],
    graduationId: ["This field required"],
    numberOfYears: ["This field required"],
  };

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicData(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getProgram = async () => {
    await axios
      .get(`/api/academic/Program`)
      .then((res) => {
        setProgramOptions(
          res.data.data.map((obj) => ({
            value: obj.program_id,
            label: obj.program_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getGraduation = async () => {
    await axios
      .get(`/api/employee/graduation`)
      .then((res) => {
        setGraduationOptions(
          res.data.data.map((obj) => ({
            value: obj.graduation_id,
            label: obj.graduation_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getProgramType = async () => {
    await axios
      .get(`/api/academic/ProgramType`)
      .then((res) => {
        setProgramtypeOptions(
          res.data.data.map((obj) => ({
            value: obj.program_type_id,
            label: obj.program_type_name,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getProgramAssignmentData = async () => {
    await axios.get(`/api/academic/ProgramAssigment/${id}`).then((res) => {
      setValues({
        acYearId: res.data.data.ac_year_id,
        schoolId: res.data.data.school_id,
        programId: res.data.data.program_id,
        programTypeId: res.data.data.program_type_id,
        graduationId: res.data.data.graduation_id,
        numberOfYears: res.data.data.number_of_years,
        numberOfSemester: res.data.data.number_of_semester,
      });
      setProgramAssignmentId(res.data.data.program_assignment_id);
      setCrumbs([
        { name: "AcademicMaster", link: "/AcademicMaster/Assign" },
        { name: "Assignment" },
        { name: "Update" },
      ]);
    });
  };

  function handleChange(e) {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_type_id = values.programTypeId;
      temp.graduation_id = values.graduationId;
      temp.number_of_years = values.numberOfYears;
      temp.number_of_semester = values.numberOfSemester;
      await axios
        .post(`/api/academic/ProgramAssigment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicMaster/Assign", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Program Assignment Created",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.program_assignment_id = programAssigmentId;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programId;
      temp.program_type_id = values.programTypeId;
      temp.graduation_id = values.graduationId;
      temp.number_of_years = values.numberOfYears;
      temp.number_of_semester = values.numberOfSemester;
      await axios
        .put(`/api/academic/ProgramAssigment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Program Assignment Updated",
            });
            navigate("/AcademicMaster/Assign", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
        });
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicData}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="programId"
              label="Program"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="graduationId"
              label="Graduation"
              value={values.graduationId}
              options={graduationOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAutocomplete
              name="programTypeId"
              label="Program Pattern"
              value={values.programTypeId}
              options={programtypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="numberOfYears"
              label="Number Of Year"
              value={values.numberOfYears}
              handleChange={(e) => {
                handleChange(e);
                setValues((prev) => ({
                  ...prev,
                  numberOfSemester: prev.numberOfYears * 2,
                }));
              }}
              errors={errorMessages.numberOfYears}
              checks={checks.numberOfYears}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="numberOfSemester"
              label="Number Of Semester"
              handleChange={handleChange}
              value={values.numberOfSemester ?? ""}
              disabled
            />
          </Grid>

          <Grid item textAlign="right">
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
      </FormWrapper>
    </Box>
  );
}

export default ProgramAssignmentForm;
