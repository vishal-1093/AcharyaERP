import { useEffect, useState } from "react";
import axios from "../../services/Api";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import { Backdrop, Box, CircularProgress, Grid, Paper } from "@mui/material";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";

const initialValues = { acyearId: null, internalId: null };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function InternalMarksDeptIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment Marks" }]);
    fetchData();
  }, []);

  useEffect(() => {
    getData();
  }, [values.deptId, values.acyearId, values.internalId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empResponse, acyearRes, internalResponse] = await Promise.all([
        axios.get(`/api/employee/getEmployeeDataByUserID/${userId}`),
        axios.get("/api/academic/academic_year"),
        axios.get("api/academic/InternalTypes"),
      ]);
      const empResponseData = empResponse.data.data;
      const deptId = empResponseData.dept_id;
      if (!deptId) {
        throw new Error(
          "Department ID not found! Please check the ID and try again !!"
        );
      }

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
      setInternalOptions(internalOptionData);
      setValues((prev) => ({
        ...prev,
        deptId,
        acyearId: latestAcYearId.value,
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
    const { deptId, acyearId, internalId } = values;
    if (!deptId) return null;
    try {
      setLoading(true);
      let url = "/api/student/fetchFromStudentMarksWithFilteredData?page=0";
      const response = await axios.get(url, {
        params: {
          page_size: 10000,
          sort: "created_date",
          dept_id: deptId,
          ...(acyearId && { ac_year_id: acyearId }),
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

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  function formatNumber(value) {
    let num = Number(value);
    if (isNaN(num)) return "Invalid number";
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  }

  const columns = [
    { field: "school_name_short", headerName: "School", flex: 1, hide: true },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (value, row) =>
        `${row?.program_short_name}-${row?.program_specialization_name}`,
    },
    {
      field: "course_name",
      headerName: "Course",
      flex: 1,
      valueGetter: (value, row) =>
        `${row.course_name}-${row.course_code}`,
    },
    { field: "internal_short_name", headerName: "Internal", flex: 1 },
    { field: "studentAuid", headerName: "AUID", flex: 1 },
    { field: "usn", headerName: "USN", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    {
      field: "current_year",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (value, row) => `${row?.current_year}/${row?.current_sem}`,
    },
    { field: "total_marks_internal", headerName: "Max Marks", flex: 1 },
    {
      field: "marks_obtained_internal",
      headerName: "Scored",
      flex: 1,
      // valueGetter: (params) => formatNumber(params?.value),
      valueGetter: (value, row) => formatNumber(value),
    },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 1,
      // valueGetter: (params) => `${params?.value}%`,
      valueGetter: (value, row) => `${value}%`,
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
        sx={{ display: "flex", flexDirection: "column", gap: 3, padding: 3 }}
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

export default InternalMarksDeptIndex;
