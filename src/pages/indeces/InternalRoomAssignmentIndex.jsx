import { lazy, useEffect, useState } from "react";
import axios from "../../services/Api";
import {
  Backdrop,
  Badge,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useAlert from "../../hooks/useAlert";
import GridIndex from "../../components/GridIndex";
import { HighlightOff } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ModalWrapper from "../../components/ModalWrapper";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import CustomAutocomplete from "../../components/Inputs/CustomAutocomplete";
import moment from "moment";
import { convertUTCtoTimeZone } from "../../utils/DateTimeUtils";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const StudentRoomAssignment = lazy(() =>
  import("../forms/academicMaster/StudentRoomAssignment")
);
const InvigilatorSwapForm = lazy(() =>
  import("../forms/academicMaster/InvigilatorSwapForm")
);
const RoomSwapForm = lazy(() => import("../forms/academicMaster/RoomSwapForm"));

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  internalId: null,
};

function InternalRoomAssignmentIndex() {
  const [values, setValues] = useState(initialValues);
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [wrapperOpen, setWrapperOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [swapOpen, setSwapOpen] = useState(false);
  const [swapRoomOpen, setSwapRoomOpen] = useState(false);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "Internal Assesment", link: "/internals" },
      { name: "Room Assignment" },
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
      const url = "/api/academic/fetchAllInternalFacultyRoomAssignment?page=0";
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

  const handleActive = (params) => {
    const { id, active } = params.row;

    try {
      let title;
      let message;
      let url;

      if (active) {
        title = "Deactivate";
        message = "Do you want to make it Inactive?";
        url = `/api/academic/internalFacultyRoomAssignment/${id}`;
      } else {
        title = "Activate";
        message = "Do you want to make it Active?";
        url = `/api/academic/activateInternalFacultyRoomAssignment/${id}`;
      }

      const handleConfirm = async () => {
        const response = await axios.delete(url);

        if (response.data.success) {
          getData();
          setAlertMessage({
            severity: "success",
            message: active
              ? "Deactivated successfully !!"
              : "Activated Successfully !!",
          });
          setAlertOpen(true);
        }
      };

      setModalContent({
        title: title,
        message: message,
        buttons: [
          { name: "Yes", color: "primary", func: handleConfirm },
          { name: "No", color: "primary", func: () => {} },
        ],
      });
      setModalOpen(true);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    }
  };

  const handleAddStudents = (data) => {
    setWrapperOpen(true);
    setRowData(data);
  };

  const handleSwap = (data) => {
    setRowData(data);
    setSwapOpen(true);
  };

  const handleSwapRoom = (data) => {
    setRowData(data);
    setSwapRoomOpen(true);
  };

  const checkDate = (date, timeSlot) => {
    const [day, month, year] = date.split("-").map(Number);
    const examDate = new Date(Date.UTC(year, month - 1, day));
    const startTimeStr = timeSlot.split(" - ")[0];
    const [time, modifier] = startTimeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    examDate.setUTCHours(hours, minutes, 0, 0);
    const currentDate = new Date();
    return (
      convertUTCtoTimeZone(currentDate.toISOString()) >
      convertUTCtoTimeZone(examDate.toISOString())
    );
  };

  const columns = [
    { field: "internal_short_name", headerName: "Internal", flex: 1 },
    { field: "school_name_short", headerName: "School", flex: 1 },
    {
      field: "program_short_name",
      headerName: "Program",
      flex: 1,
      valueGetter: (params) =>
        `${params.row.program_short_name}-${params.row.program_specialization_short_name}`,
    },
    { field: "course_with_coursecode", headerName: "Course", flex: 1 },
    { field: "date_of_exam", headerName: "Exam Date", flex: 1 },
    { field: "timeSlot", headerName: "Time Slot", flex: 1 },
    { field: "roomcode", headerName: "Room", flex: 1 },
    { field: "facultyName", headerName: "Invigilator", flex: 1 },
    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        moment(params.row.created_date).format("DD-MM-YYYY"),
    },
    {
      field: "studentId",
      headerName: "Add Students",
      flex: 1,
      renderCell: (params) => {
        if (
          params.row.attendance_status ||
          !params.row.active ||
          checkDate(params.row.date_of_exam, params.row.timeSlot)
        ) {
          return null;
        }
        const hasStudents = params.row.student_ids?.length > 0;
        const studentCount = params.row.student_ids?.split(",").length || 0;
        return (
          <IconButton onClick={() => handleAddStudents(params.row)}>
            {hasStudents ? (
              <Badge
                badgeContent={studentCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    left: -10,
                  },
                }}
              />
            ) : (
              <AddBoxIcon color="primary" sx={{ fontSize: 22 }} />
            )}
          </IconButton>
        );
      },
    },
    {
      field: "InvigilatorSwap",
      headerName: "Invigilator Swap",
      flex: 1,
      renderCell: (params) =>
        !params.row.attendance_status &&
        !checkDate(params.row.date_of_exam, params.row.timeSlot) &&
        params.row.active && (
          <IconButton onClick={() => handleSwap(params.row)}>
            <SwapHorizontalCircleIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ),
    },
    {
      field: "room_id",
      headerName: "Room Swap",
      flex: 1,
      renderCell: (params) =>
        !params.row.attendance_status &&
        !checkDate(params.row.date_of_exam, params.row.timeSlot) &&
        params.row.active && (
          <IconButton onClick={() => handleSwapRoom(params.row)}>
            <SwapHorizontalCircleIcon color="primary" sx={{ fontSize: 22 }} />
          </IconButton>
        ),
    },
    {
      field: "id",
      headerName: "Active",
      flex: 1,
      renderCell: (params) =>
        params.row.attendance_status ||
        checkDate(params.row.date_of_exam, params.row.timeSlot) ? (
          <></>
        ) : params.row.active === true ? (
          <IconButton
            label="Result"
            onClick={() => {
              handleActive(params);
            }}
            sx={{ padding: 0, color: "success.main" }}
          >
            <CheckCircleIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => handleActive(params)}
            sx={{ padding: 0, color: "error.main" }}
          >
            <HighlightOff />
          </IconButton>
        ),
    },
  ];

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <ModalWrapper
        open={wrapperOpen}
        setOpen={setWrapperOpen}
        maxWidth={1200}
        title={`${rowData.internal_name} - ${rowData.roomcode}`}
      >
        <StudentRoomAssignment
          rowData={rowData}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
          setWrapperOpen={setWrapperOpen}
        />
      </ModalWrapper>

      <ModalWrapper
        open={swapOpen}
        setOpen={setSwapOpen}
        maxWidth={1000}
        title={`Swap Invigilator ( ${rowData.internal_name} - ${rowData.roomcode} )`}
      >
        <InvigilatorSwapForm
          rowData={rowData}
          setSwapOpen={setSwapOpen}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
        />
      </ModalWrapper>

      <ModalWrapper
        open={swapRoomOpen}
        setOpen={setSwapRoomOpen}
        maxWidth={1000}
        title={`Swap Room ( ${rowData.internal_name} - ${rowData.roomcode} )`}
      >
        <RoomSwapForm
          rowData={rowData}
          setSwapRoomOpen={setSwapRoomOpen}
          getData={getData}
          setAlertMessage={setAlertMessage}
          setAlertOpen={setAlertOpen}
        />
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          onClick={() => navigate("/internals/room-assign")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Assign
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
          <GridIndex rows={rows} columns={columns} />
        </Box>
      </Box>
    </>
  );
}

export default InternalRoomAssignmentIndex;
