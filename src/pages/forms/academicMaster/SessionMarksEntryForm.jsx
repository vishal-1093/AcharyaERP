import { useState, useEffect } from "react";
import { Grid, Button, CircularProgress, Box } from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";
import { makeStyles } from "@mui/styles";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programIdForUpdate: null,
  programSpeId: null,
  yearsemId: null,
  sectionId: null,
  courseId: null,
  internalId: null,
};

const requiredFields = [
  "acYearId",
  "schoolId",
  "programSpeId",
  "yearsemId",
  "sectionId",
];

const useStyles = makeStyles((theme) => ({
  iconButton: {
    display: "flex",
    fontSize: 14,
  },
}));

function SessionMarksEntryForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [programType, setProgramType] = useState("Sem");
  const [programId, setProgramId] = useState(null);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("AcharyaErpUser")).userId;

  useEffect(() => {
    getAcademicyear();
    getSchool();

    if (pathname.toLowerCase() === "/sessionmarksentryform") {
      setIsNew(true);
    } else {
      setIsNew(false);
    }
  }, []);

  useEffect(() => {
    getCourseData();
    getProgramSpeData();
    getSectionData();
    getYearSemForUpdate();
  }, [
    values.acYearId,
    values.schoolId,
    values.programSpeId,
    values.yearsemId,
    values.sectionId,
    values.yearsemId,
    programType,
  ]);

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
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
      .catch((error) => console.error(error));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getSectionData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/academic/fetchSectionBySchool/${values.schoolId}`)
        .then((res) => {
          setSectionOptions(
            res.data.data.map((obj) => ({
              value: obj.section_id,
              label: obj.section_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getYearSemForUpdate = async () => {
    if (!isNew)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);

              setProgramAssignmentId(obj.program_assignment_id);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getCourseData = async () => {
    if (
      values.acYearId &&
      values.schoolId &&
      values.programSpeId &&
      values.sectionId &&
      values.yearsemId &&
      programType === "Year"
    ) {
      await axios
        .get(
          `/api/academic/courseAssignedToEmployeeForStudentMarks?user_id=${userId}&ac_year_id=${values.acYearId}&school_id=${values.schoolId}&program_id=${programId}&program_specialization_id=${values.programSpeId}&section_id=${values.sectionId}&current_year=${values.yearsemId}`
        )
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.course_id,
              label: obj.course_name_code,
            }))
          );
        })
        .catch((error) => console.error(error));
    } else if (
      values.acYearId &&
      values.schoolId &&
      values.programSpeId &&
      values.sectionId &&
      values.yearsemId &&
      programType === "Sem"
    ) {
      await axios
        .get(
          `/api/academic/courseAssignedToEmployeeForStudentMarks?user_id=${userId}&ac_year_id=${values.acYearId}&school_id=${values.schoolId}&program_id=${programId}&program_specialization_id=${values.programSpeId}&section_id=${values.sectionId}&current_sem=${values.yearsemId}`
        )
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.course_id,
              label: obj.course_name_code,
            }))
          );
        })
        .catch((error) => console.error(error));
    }
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === newValue) {
              yearsem.push(obj);
              setProgramId(obj.program_id);
              setProgramAssignmentId(obj.program_assignment_id);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramId(obj.program_id);
              setProgramAssignmentId(obj.program_assignment_id);
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType("Sem");
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleCreate = () => {
    navigate(
      `/SessionMarksEntry/${values.acYearId}/${values.schoolId}/${values.programSpeId}/${programId}/${values.yearsemId}/${values.sectionId}/${values.courseId}/${values.internalId}`
    );
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="sectionId"
              label="Section"
              value={values.sectionId}
              options={sectionOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="internalId"
              label="Internal"
              value={values.internalId}
              options={sectionOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
                <strong>SUBMIT</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default SessionMarksEntryForm;
