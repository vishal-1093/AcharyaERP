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
  internalId: null,
};

function InternalMarksInstituteIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ModalWrapperOpen, setModalWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment Report" }]);
    fetchData();
  }, []);

  useEffect(() => {
    getData();
  }, [values.acyearId, values.schoolId, values.programId, values.internalId]);

  useEffect(() => {
    getPrograms();
  }, [values.schoolId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [acyearRes, schoolResponse, internalResponse] = await Promise.all([
        axios.get("/api/academic/academic_year"),
        axios.get("/api/institute/school"),
        axios.get("api/academic/InternalTypes"),
      ]);

      const acyearOptionData = [];
      const filterAcyear = acyearRes.data.data.filter(
        (obj) => obj.ac_year_id > 5
      );
      filterAcyear?.forEach((obj) => {
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
    const { acyearId, schoolId, programId, internalId } = values;
    if (!acyearId) return;
    try {
      setLoading(true);
      const url = "/api/student/fetchFromStudentMarksWithFilteredData?page=0";
      const response = await axios.get(url, {
        params: {
          page_size: 10000,
          sort: "created_date",
          ...(acyearId && { ac_year_id: acyearId }),
          ...(schoolId && { school_id: schoolId }),
          ...(programId && { program_specialization_id: programId }),
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
    const { schoolId } = values;
    if (!schoolId) return null;
    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      responseData.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      setProgramOptions(optionData);
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

  const columns = [
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        `${params.row.program_short_name}-${params.row.program_specialization_name}`,
    },
    {
      field: "course_name",
      headerName: "Course",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.course_name}-${params.row.course_code}`,
    },
    { field: "internal_short_name", headerName: "Internal", flex: 1 },
    { field: "studentAuid", headerName: "AUID", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    {
      field: "current_year",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.current_year}/${params.row.current_sem}`,
    },
    { field: "total_marks_internal", headerName: "Max Marks", flex: 1 },
    {
      field: "marks_obtained_internal",
      headerName: "Scored",
      flex: 1,
      valueGetter: (params) => formatNumber(params.value),
    },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 1,
      valueGetter: (params) => `${params.value}%`,
    },
    {
      field: "id",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleUpdate(params.row)}>
          <EditIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      ),
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
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

export default InternalMarksInstituteIndex;
