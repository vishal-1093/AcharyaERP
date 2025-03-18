import { useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import CustomModal from "../../components/CustomModal";
import moment from "moment";
import LockIcon from "@mui/icons-material/Lock";

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
  courseId: null,
};

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;
const empId = JSON.parse(sessionStorage.getItem("empId"));

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
  const [selectionModel, setSelectionModel] = useState([]);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      const [empResponse, acyearRes, schoolResponse] = await Promise.all([
        axios.get(`/api/employee/getEmployeeDataByUserID/${userId}`),
        axios.get("/api/academic/academic_year"),
        axios.get("/api/institute/school"),
      ]);
      const empResponseData = empResponse.data.data;
      const schoolId = empResponseData.school_id;
      const deptId = empResponseData.dept_id;
      if (roleShortName === "PRN" && !schoolId) {
        throw new Error(
          "School ID not found! Please check the ID and try again !!"
        );
      }
      if (roleShortName === "HOD" && !deptId) {
        throw new Error(
          "Department ID not found! Please check the ID and try again !!"
        );
      }
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
      setValues((prev) => ({
        ...prev,
        acyearId: latestAcYearId.value,
        schoolId,
        deptId,
      }));
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
          external_min_mark,
          faculty_id,
          faculty_status,
          faculty_status_date,
          facultyName,
          facultyEmpcode,
          hod_id,
          hod_status,
          hod_status_date,
          hodName,
          hodEmpcode,
          hoi_id,
          hoi_status,
          hoi_status_date,
          hoiName,
          hoiEmpcode,
        }) => {
          if (!studentMap.has(studentId)) {
            studentMap.set(studentId, {
              id,
              studentId,
              IA1: 0,
              IA2: 0,
              ASSIGNMENT: 0,
              name,
              usn,
              auid,
              faculty_id,
              faculty_status,
              faculty_status_date,
              facultyName,
              facultyEmpcode,
              hod_id,
              hod_status,
              hod_status_date,
              hodName,
              hodEmpcode,
              hoi_id,
              hoi_status,
              hoi_status_date,
              hoiName,
              hoiEmpcode,
              disableSelection:
                (roleShortName === "HOD" && (!faculty_status || hod_status)) ||
                (roleShortName === "PRN" && (!hod_status || hoi_status)),
            });
          }
          const studentObj = studentMap.get(studentId);
          if (internal_short_name === "IA1") {
            studentObj.IA1 = marks_obtained_internal;
          } else if (internal_short_name === "IA2") {
            studentObj.IA2 = marks_obtained_internal;
          } else if (internal_short_name === "ASSIGNMENT") {
            studentObj.ASSIGNMENT = external_min_mark;
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
    const { schoolId, deptId } = values;
    if (!schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      let responseData = response.data;
      if (roleShortName === "HOD") {
        responseData.filter((obj) => obj.dept_id === deptId);
      }
      responseData.forEach((obj) => {
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

  const handleSelectionChange = (newSelection) => {
    setSelectionModel(newSelection);
  };

  const handleLockCreate = async () => {
    try {
      setLoading(true);

      const ids = selectionModel.toString();
      const updateData = {};

      if (roleShortName === "HOD") {
        updateData.hod_status = true;
        updateData.hod_status_date = moment().format("DD-MM-YYYY");
        updateData.hod_id = empId;
      }

      if (roleShortName === "PRN") {
        updateData.hoi_status = true;
        updateData.hoi_status_date = moment().format("DD-MM-YYYY");
        updateData.hoi_id = empId;
      }

      const response = await axios.put(
        `/api/student/updateStudentMarksLock?marksIds=${ids}`,
        updateData
      );
      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Internals marks has been locked successfully !!",
        });
        setAlertOpen(true);
        setValues(initialValues);
        setSelectionModel([]);
        getData();
      }
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLockSubmit = () => {
    setConfirmContent({
      title: "",
      message: "Are you sure want to lock the marks?",
      buttons: [
        { name: "Yes", color: "primary", func: handleLockCreate },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  const columns = [
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "name", headerName: "Student Name", flex: 1 },
    { field: "section", headerName: "Section", flex: 1 },
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
    { field: "ASSIGNMENT", headerName: "Assignment", flex: 1 },
    {
      field: "Total",
      headerName: "Total IA",
      flex: 1,
      valueGetter: (params) =>
        Math.round((params.row.IA1 + params.row.IA2) / 4) +
        params.row.ASSIGNMENT,
    },
    {
      field: "faculty_status",
      headerName: "Faculty Status",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <LockIcon color="primary" sx={{ fontSize: 20 }} />
        ) : (
          <></>
        ),
    },
    { field: "faculty_status_date", headerName: "Faculty Lock Date", flex: 1 },
    {
      field: "facultyName",
      headerName: "Faculty Lock By",
      flex: 1,
      valueGetter: (params) =>
        params.row.facultyName
          ? `${params.row.facultyName} - ${params.row.facultyEmpcode}`
          : "",
    },
    {
      field: "hod_status",
      headerName: "HOD Status",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <LockIcon color="primary" sx={{ fontSize: 20 }} />
        ) : (
          <></>
        ),
    },
    { field: "hod_status_date", headerName: "HOD Lock Date", flex: 1 },
    {
      field: "hodName",
      headerName: "HOD Lock By",
      flex: 1,
      valueGetter: (params) =>
        params.row.hodName
          ? `${params.row.hodName} - ${params.row.hodEmpcode}`
          : "",
    },
    {
      field: "hoi_status",
      headerName: "Principal Status",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <LockIcon color="primary" sx={{ fontSize: 20 }} />
        ) : (
          <></>
        ),
    },
    { field: "hoi_status_date", headerName: "Principal Lock Date", flex: 1 },
    {
      field: "hoiName",
      headerName: "Principal Lock By",
      flex: 1,
      valueGetter: (params) =>
        params.row.hoiName
          ? `${params.row.hoiName} - ${params.row.hoiEmpcode}`
          : "",
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

      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

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
        <Grid
          container
          columnSpacing={4}
          rowSpacing={2}
          justifyContent="flex-start"
        >
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
          {roleShortName === "SAA" && (
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
          )}

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

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
            <Button
              variant="contained"
              onClick={handleLockSubmit}
              disabled={selectionModel.length === 0}
            >
              Lock
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <GridIndex
            rows={rows}
            columns={columns}
            checkboxSelection
            isRowSelectable={(params) => !params.row.disableSelection}
            disableSelectionOnClick
            selectionModel={selectionModel}
            onSelectionModelChange={handleSelectionChange}
          />
        </Grid>
      </Box>
    </>
  );
}

export default InternalFinalMarksIndex;
