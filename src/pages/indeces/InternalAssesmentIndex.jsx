import { useState, useEffect } from "react";
import axios from "../../services/Api";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import GridIndex from "../../components/GridIndex";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import EditIcon from "@mui/icons-material/Edit";
import { convertToDMY } from "../../utils/DateTimeUtils";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  internalId: null,
};

function InternalAssesmentIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    year_sem: false,
    min_marks: false,
    max_marks: false,
    created_username: false,
    created_date: false
  });

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Internal Assesment" },
      { name: "Room Assignment", link: "/internals/room-assignment" },
    ]);
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
      const [acyearRes, schoolResponse, internalResponse, empResponse] =
        await Promise.all([
          axios.get("/api/academic/academic_year"),
          axios.get("/api/institute/school"),
          axios.get("api/academic/InternalTypes"),
          axios.get(`/api/employee/getEmployeeDataByUserID/${userId}`),
        ]);
      const empResponseData = empResponse.data.data;
      const school = empResponseData.school_id;

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
        schoolId: roleShortName === "SAA" ? null : school,
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
    const { acyearId, schoolId, programId, internalId } = values;
    if (!acyearId) return;
    try {
      setLoading(true);
      const url = "/api/academic/fetchAllInternalSessionAssignment1?page=0";
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
      setRows(response.data.data);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
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

  const handleUpdate = (id) => {
    navigate(`/internals/assesment-update/${id}`);
  };

  const handleAddMarks = (id) => {
    navigate(`/internal-marks/${id}/SAA`);
  };

  const columns = [
    { field: "internal_short_name", headerName: "Internal Name", flex: 1 },
    { field: "course_with_coursecode", headerName: "Course", flex: 1 },
    { field: "ac_year", headerName: "Ac Year", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (params) =>
        params.row.program_short_name +
        " - " +
        params.row.program_specialization_short_name,
    },
    {
      field: "year_sem",
      headerName: "Year/Sem",
      flex: 1,
      //  hide: true,
      valueGetter: (value, row) =>
        `${row?.current_year} / ${row?.current_sem}`,
    },
    {
      field: "min_marks",
      headerName: "Min Marks",
      flex: 1,
      //  hide: true 
    },
    {
      field: "max_marks",
      headerName: "Max Marks",
      flex: 1,
      //  hide: true 
    },
    {
      field: "date_of_exam",
      headerName: "Exam Date",
      flex: 1,
      valueGetter: (params) => params.row.date_of_exam,
    },
    { field: "timeSlots", headerName: "Time Slot", flex: 1 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      //  hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      //  hide: true,
      valueGetter: (value, row) =>
        moment(row?.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "id",
      headerName: "Update",
      flex: 1,
      renderCell: (params) =>
        new Date() <= new Date(convertToDMY(params.row.date_of_exam)) ? (
          <IconButton onClick={() => handleUpdate(params.row.id)}>
            <EditIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ) : (
          <></>
        ),
    },
  ];

  if (roleShortName === "SAA") {
    columns.push({
      field: "studentId",
      headerName: "Add Marks",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleAddMarks(params.row.id)}>
          <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
        </IconButton>
      ),
    });
  }

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          onClick={() => navigate("/internals/assesment-creation")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>

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
          <GridIndex
            rows={rows}
            columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            setColumnVisibilityModel={setColumnVisibilityModel} />
        </Box>
      </Box>
    </>
  );
}

export default InternalAssesmentIndex;
