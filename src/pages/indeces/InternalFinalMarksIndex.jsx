import { useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import { Backdrop, Box, CircularProgress, Grid, Paper } from "@mui/material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
  courseId: null,
};

function InternalFinalMarksIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment Final Report" }]);
    fetchData();
  }, []);

  useEffect(() => {
    getData();
  }, [
    values.acyearId,
    values.schoolId,
    values.programId,
    values.yearSem,
    values.courseId,
  ]);

  useEffect(() => {
    getPrograms();
  }, [values.schoolId]);

  useEffect(() => {
    getYearSems();
  }, [values.programId]);

  useEffect(() => {
    getCourses();
  }, [values.programId, values.yearSem, values.schoolId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [acyearRes, schoolResponse] = await Promise.all([
        axios.get("/api/academic/academic_year"),
        axios.get("/api/institute/school"),
        axios.get("api/academic/InternalTypes"),
      ]);

      const acyearOptionData = [];
      acyearRes.data.data?.forEach((obj) => {
        acyearOptionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });

      const schoolOptionData = [];
      schoolResponse.data.data.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });

      const latestAcYearId = acyearOptionData.reduce((acc, next) => {
        return next.value > acc.value ? next : acc;
      }, acyearOptionData[0]);

      setAcyearOptions(acyearOptionData);
      setSchoolOptions(schoolOptionData);
      setValues((prev) => ({ ...prev, acyearId: latestAcYearId.value }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getData = async () => {
    const { acyearId, schoolId, programId, yearSem, courseId } = values;
    if (!acyearId || !courseId) return;
    try {
      setLoading(true);
      let currentYear;
      let currentSem;
      if (
        programData[programId]?.program_type_name?.toLowerCase() === "semester"
      ) {
        currentYear = Math.round(yearSem / 2);
        currentSem = yearSem;
      } else {
        currentYear = yearSem;
        currentSem = 0;
      }
      const url = "/api/student/fetchStudentMarksData?page=0";
      const response = await axios.get(url, {
        params: {
          page_size: 10000,
          sort: "created_date",
          ...(acyearId && { ac_year_id: acyearId }),
          ...(schoolId && { school_id: schoolId }),
          ...(programId && { program_specialization_id: programId }),
          ...(yearSem && {
            current_year: currentYear,
            current_sem: currentSem,
          }),
          ...(courseId && { course_assignment_id: courseId }),
        },
      });

      const studentMap = new Map();
      response.data.data.Paginated_data.content.forEach(
        ({
          internal_short_name,
          marks_obtained_internal,
          student_id: studentId,
          id,
          student_name: name,
          usn,
          auid,
        }) => {
          if (!studentMap.has(studentId)) {
            studentMap.set(studentId, {
              id,
              studentId,
              IA1: 0,
              IA2: 0,
              name,
              usn,
              auid,
            });
          }
          const studentObj = studentMap.get(studentId);
          if (internal_short_name === "IA1") {
            studentObj.IA1 = marks_obtained_internal;
          } else if (internal_short_name === "IA2") {
            studentObj.IA2 = marks_obtained_internal;
          }
        }
      );
      const filterData = Array.from(studentMap.values());
      setRows(filterData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getPrograms = async () => {
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

  const getYearSems = () => {
    const { programId } = values;
    if (!programId) return null;

    if (programId in programData) {
      const {
        program_type_name: programType,
        number_of_semester: sems,
        number_of_years: years,
      } = programData[programId];

      let totalYearSem, type;

      if (programType?.toLowerCase() === "semester") {
        totalYearSem = sems;
        type = "Sem";
      } else {
        totalYearSem = years;
        type = "Year";
      }

      const optionData = [];
      for (let i = 1; i <= totalYearSem; i++) {
        optionData.push({
          value: i,
          label: `${type} ${i}`,
        });
      }
      setYearSemOptions(optionData);
    }
  };

  const getCourses = async () => {
    const { programId, yearSem, schoolId } = values;
    if (!programId || !yearSem || !schoolId) return null;
    try {
      const { data: response } = await axios.get(
        `/api/academic/courseDetailsForStudentsAssignment/${programId}/${yearSem}/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      responseData.forEach((obj) => {
        optionData.push({
          value: obj.course_assignment_id,
          label: obj.course_name_with_code,
        });
      });
      setCourseOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the course data",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "name", headerName: "Student Name", flex: 1 },
    // { field: "section", headerName: "Section", flex: 1 },
    {
      field: "IA1",
      headerName: "IA 1",
      flex: 1,
      valueGetter: (params) => params.value || 0,
    },
    { field: "IA2", headerName: "IA 2", flex: 1 },
    {
      field: "FITM",
      headerName: "FITM",
      flex: 1,
      valueGetter: (params) =>
        Math.round((params.row.IA1 + params.row.IA2) / 4),
    },
  ];

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        component={Paper}
        elevation={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          padding: 3,
        }}
      >
        <Grid container columnSpacing={4} justifyContent="flex-start">
          <Grid item xs={12} md={1.5}>
            <CustomAutocomplete
              name="acyearId"
              label="Ac Year"
              value={values.acyearId}
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvance}
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
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programId"
              label="Program Specialization"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          {values.programId in programData && (
            <Grid item xs={12} md={1.5}>
              <CustomAutocomplete
                name="yearSem"
                label={programData[values.programId].program_type_name}
                value={values.yearSem}
                options={yearSemOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
          {values.yearSem && (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="courseId"
                label="Course"
                value={values.courseId}
                options={courseOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}
        </Grid>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default InternalFinalMarksIndex;
