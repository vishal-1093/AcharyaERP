import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import ModalWrapper from "../../components/ModalWrapper";
import EditIcon from "@mui/icons-material/Edit";

const UpdateInternalMarks = lazy(() =>
  import("../forms/academicMaster/UpdateInternalMarks")
);

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
  internalId: null,
};

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function InternalResultAnalysis() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ModalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment Result Analysis" }]);
    fetchData();
  }, []);

  useEffect(() => {
    getData();
  }, [
    values.acyearId,
    values.schoolId,
    values.programId,
    values.yearSem,
    values.internalId,
  ]);

  useEffect(() => {
    getPrograms();
  }, [values.schoolId]);

  useEffect(() => {
    getYearSems();
  }, [values.programId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [acyearRes, schoolResponse, internalResponse, empResponse] =
        await Promise.all([
          axios.get("/api/academic/academic_year"),
          axios.get("/api/institute/school"),
          axios.get("api/academic/InternalTypes"),
          axios.get(`/api/employee/getEmployeeDataByUserID/${userId}`),
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

      const internalResponseData = internalResponse.data.data.filter((obj) => {
        const shortName = obj.internal_short_name?.trim().toLowerCase();
        return shortName !== "assignment" && shortName !== "external";
      });
      const internalOptionData = [];
      internalResponseData.forEach((obj) => {
        internalOptionData.push({
          value: obj.internal_short_name,
          label: obj.internal_name,
        });
      });

      const latestAcYearId = acyearOptionData.reduce((acc, next) => {
        return next.value > acc.value ? next : acc;
      }, acyearOptionData[0]);

      setAcyearOptions(acyearOptionData);
      setSchoolOptions(schoolOptionData);
      setInternalOptions(internalOptionData);
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
    const { acyearId, schoolId, programId, yearSem, internalId } = values;
    if (!acyearId) return;
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
      const url =
        "/api/student/fetchFromStudentMarksAndAttendanceWithFilteredData?page=0";
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
          ...(internalId && { internal_short_name: internalId }),
        },
      });
      setRows(response.data.data.Paginated_data.content);
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
        responseData = responseData.filter((obj) => obj.dept_id === deptId);
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

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  function formatNumber(value) {
    let num = Number(value);
    if (isNaN(num)) return "Invalid number";
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  }

  const handleUpdate = (data) => {
    setRowData(data);
    setModalWrapperOpen(true);
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

  function formatNumber(value) {
    let num = Number(value);
    if (isNaN(num)) return "Invalid number";
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  }

  const columns = [
    {
      field: "course_code",
      headerName: "Course Code",
      flex: 1,
    },
    { field: "course_name", headerName: "Course", flex: 1, hide: true },
    { field: "employee_names", headerName: "Faculty", flex: 1 },
    { field: "internal_short_name", headerName: "Internal", flex: 1 },
    {
      field: "current_year",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.current_year} / ${params.row.current_sem}`,
    },
    { field: "total_students", headerName: "Total", flex: 1 },
    {
      field: "attended",
      headerName: "Appeared",
      flex: 1,
      valueGetter: (params) => params.row.present + params.row.absent,
    },
    { field: "absent", headerName: "Absent", flex: 1 },
    { field: "pass", headerName: "Pass", flex: 1 },
    { field: "fail", headerName: "Fail", flex: 1 },
    {
      field: "percentage",
      headerName: "Pass Percentage",
      flex: 1,
      valueGetter: (params) =>
        formatNumber((params.row.pass / params.row.total_students) * 100),
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

      <ModalWrapper
        open={ModalWrapperOpen}
        setOpen={setModalWrapperOpen}
        maxWidth={600}
        title={rowData.internal_name}
      >
        <UpdateInternalMarks
          rowData={rowData}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setModalWrapperOpen={setModalWrapperOpen}
        />
      </ModalWrapper>

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
          <Grid item xs={12} md={2}>
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
              />
            </Grid>
          )}
          <Grid item xs={12} md={2.5}>
            <CustomAutocomplete
              name="internalId"
              label="Internal"
              value={values.internalId}
              options={internalOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
        </Grid>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}

export default InternalResultAnalysis;
