import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
  Tooltip,
  tooltipClasses,
  Paper,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const initialValues = {
  acYearId: null,
  courseId: null,
  employeeId: null,
  roomId: null,
};

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 300,
    fontSize: 12,
    // border: "1px solid rgba(224, 224, 224, 1)",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
  },
}));

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {},
  },
  bg: {
    backgroundColor: theme.palette.primary.main,
    textAlign: "center",
  },
  red: {
    background: "#ff9999 !important",
  },
}));

function TimetableForSectionIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalSelectContent, setModalSelectContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelectOpen, setModalSelectOpen] = useState(false);
  const [ids, setIds] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [employeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [previousEmployeeId, setPreviousEmployeeId] = useState(null);
  const [timeTableId, setTimeTableId] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [studentListOpen, setStudentListOpen] = useState(false);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [roomSwapOpen, setRoomSwapOpen] = useState(false);
  const [roomOptions, setRoomOptions] = useState([]);

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const classes = useStyles();

  const columns = [
    {
      field: "ac_year",
      headerName: "AC Year",
      flex: 1,
    },

    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
      valueGetter: (params) =>
        params.row.program_specialization_short_name
          ? params.row.program_specialization_short_name +
            "-" +
            params.row.program_short_name
          : "NA",
    },
    {
      field: "",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_year
          ? params.row.current_year
          : params.row.current_sem,
    },
    { field: "from_date", headerName: "From Date", flex: 1, hide: true },
    { field: "to_date", headerName: "To Date", flex: 1, hide: true },

    { field: "timeSlots", headerName: "Time Slots", flex: 1 },
    {
      field: "interval_type_short",
      headerName: "Interval Type",
      flex: 1,
    },
    {
      field: "week_day",
      headerName: "Week Day",
      flex: 1,
      valueGetter: (params) =>
        params.row.week_day ? params.row.week_day.substr(0, 3) : "",
    },
    {
      field: "selected_date",
      headerName: "Class date",
      flex: 1,
      valueGetter: (params) =>
        moment(params.row.selected_date).format("DD-MM-YYYY"),
    },

    {
      field: "course_code",
      headerName: "Course",
      renderCell: (params) => {
        return (
          <HtmlTooltip title={params.row.course_name}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ cursor: "pointer" }}
            >
              {params.row.course_code}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    {
      field: "empcode",
      headerName: "Employee Code",
      flex: 1,
      renderCell: (params) => {
        return (
          <HtmlTooltip
            title={`Employee : ${params.row.employee_name} & Dept : ${params.row.dept_name}`}
          >
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ cursor: "pointer" }}
            >
              {params.row.empcode}
            </Typography>
          </HtmlTooltip>
        );
      },
    },

    { field: "roomcode", headerName: "Room Code", flex: 1 },
    {
      field: "section_name",
      headerName: "Section",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography
            variant="subtitle2"
            sx={{ cursor: "pointer", fontSize: 14, marginLeft: 2 }}
            onClick={() => handleStudentList(params)}
            color="primary"
          >
            {params.row.section_name ? params.row.section_name : "NA"}
          </Typography>
        );
      },
    },

    {
      field: "batch_name",
      headerName: "Batch",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography
            variant="subtitle2"
            sx={{ cursor: "pointer", fontSize: 14, marginLeft: 2 }}
            onClick={() => handleStudentListForBatch(params)}
            color="primary"
          >
            {params.row.batch_name ? params.row.batch_name : "NA"}
          </Typography>
        );
      },
    },
    {
      field: "swap",
      headerName: "Swap",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleDetails(params)} color="primary">
          <SwapHorizontalCircleIcon />
        </IconButton>,
      ],
    },
    {
      field: "room_swap",
      headerName: "Room Swap",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <IconButton onClick={() => handleRoomSwap(params)} color="primary">
          <SwapHorizontalCircleIcon />
        </IconButton>,
      ],
    },

    {
      field: "created_username",
      headerName: "Created By",
      flex: 1,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      hide: true,
      valueGetter: (params) =>
        params.row.created_date
          ? moment(params.row.created_date).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        params.row.active === true ? (
          <IconButton
            style={{ color: "green" }}
            onClick={() => handleActive(params)}
          >
            <Check />
          </IconButton>
        ) : (
          <IconButton
            style={{ color: "red" }}
            onClick={() => handleActive(params)}
          >
            <HighlightOff />
          </IconButton>
        ),
      ],
    },
  ];

  useEffect(() => {
    getData();

    getCourseData();
  }, [values.acYearId, values.employeeId, userId]);

  useEffect(() => {
    getAcYearData();
  }, []);

  const getAcYearData = async () => {
    try {
      const response = await axios.get("/api/academic/academic_year");
      const newResponse = response.data.data.filter(
        (obj) => obj.current_year >= 2024
      );

      const optionData = [];
      const ids = [];
      newResponse.forEach((obj) => {
        optionData.push({ value: obj.ac_year_id, label: obj.ac_year });
        ids.push(obj.current_year);
      });
      const latestYear = Math.max(...ids);
      const latestYearId = response.data.data.filter(
        (obj) => obj.current_year === 2024
      );
      setAcademicYearOptions(optionData);
      setValues((prev) => ({
        ...prev,
        acYearId: latestYearId[0].ac_year_id,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Failed to fetch the academic years !!",
      });
      setAlertOpen(true);
    }
  };

  const getData = async () => {
    if (values.acYearId)
      await axios
        .get(
          `/api/academic/fetchAllTimeTableDetailsForIndex?page=${0}&page_size=${1000000}&sort=created_date&ac_year_id=${
            values.acYearId
          }`
        )
        .then((res) => {
          setRows(res.data.data.Paginated_data.content);
        })
        .catch((err) => console.error(err));
  };

  const handleStudentList = async (params) => {
    setStudentList([]);
    setStudentListOpen(true);
    const data = params.row;
    await axios
      .get(
        `/api/academic/assignedStudentBySectionAssignmentId/${data.section_assignment_id}`
      )
      .then((res) => {
        setStudentList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleStudentListForBatch = async (params) => {
    setStudentList([]);
    setStudentListOpen(true);
    await axios
      .get(
        `/api/academic/studentDetailsWithBatchName/${params.row.batch_assignment_id}`
      )
      .then((res) => {
        setStudentList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setIds(selectedRowsData.map((val) => val.id));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "employeeId") {
      await axios
        .get(
          `/api/employee/getEmployeesUnderDepartment/${data.row.emp_id}/${data.row.selected_date}/${data.row.time_slots_id}`
        )
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.emp_id === newValue) {
              setUserId(obj.userDetail_id);
            }
          });
        })
        .catch((err) => console.error(err));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/deactivateTimeTableEmployee/${ids.toString()}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateTimeTableEmployee/${ids.toString()}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true && ids.length > 0
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : params.row.active === false && ids.length > 0
      ? setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Please select the checkbox !!!",
        });
    setModalOpen(true);
  };

  const handleSelectOpen = () => {
    const handleSectionCreation = () => {
      navigate("/TimetableMaster/Timetable/Section/New");
    };
    const handleBatchCreation = () => {
      navigate("/TimetableMaster/Timetable/Batch/New");
    };
    setModalSelectOpen(true);
    setModalSelectContent({
      title: "Create Timetable For",
      message: "",
      buttons: [
        { name: "Section", color: "primary", func: handleSectionCreation },
        { name: "Batch", color: "primary", func: handleBatchCreation },
      ],
    });
  };

  const handleDetails = async (params) => {
    setPreviousEmployeeId(params.row.emp_id);
    setTimeTableId(params.row.id);
    setData(params);
    setValues((prev) => ({
      ...prev,
      ["courseId"]: null,
      ["employeeId"]: null,
      ["roomId"]: null,
    }));
    await axios
      .get(
        `/api/employee/getEmployeesUnderDepartment/${params.row.emp_id}/${params.row.selected_date}/${params.row.time_slots_id}`
      )
      .then((res) => {
        setEmployeeOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employeeName,
          }))
        );
      })
      .catch((err) => console.error(err));
    setEmployeeDetailsOpen(true);
  };

  const handleRoomSwap = async (params) => {
    setPreviousEmployeeId(params.row.emp_id);
    setTimeTableId(params.row.id);
    setData(params);
    setValues((prev) => ({
      ...prev,
      ["courseId"]: null,
      ["employeeId"]: null,
      ["roomId"]: null,
    }));
    await axios
      .get(
        `/api/roomsForTimeTableRoomSwapping/${params.row.time_slots_id}/${params.row.selected_date}`
      )
      .then((res) => {
        setRoomOptions(
          res.data.data.map((obj) => ({
            value: obj.room_id,
            label: obj.concate_room_name,
          }))
        );
      })
      .catch((err) => console.error(err));
    setRoomSwapOpen(true);
  };

  const getCourseData = async () => {
    if (userId)
      await axios
        .get(`/api/academic/getAssignedCourses/${userId}`)
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.subjet_assign_id,
              label: obj.course_name_with_code,
            }))
          );
        })
        .catch((error) => console.error(error));
  };

  const handleSubmit = async () => {
    await axios
      .put(
        `/api/academic/updateEmployeeIdForSwapping/${timeTableId}/${previousEmployeeId}/${values.employeeId}/${values.courseId}`
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Swapped" });
          setAlertOpen(true);
          setRoomSwapOpen(false);
          employeeDetailsOpen(false);
          getData();
        } else {
          setAlertMessage({ severity: "error", message: "Error" });
          setAlertOpen(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleAssignRoom = async () => {
    await axios
      .put(
        `/api/academic/updateRoomForSwapping/${timeTableId}/${values.roomId}`
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Swapped" });
          setAlertOpen(true);
          setRoomSwapOpen(false);
          getData();
        } else {
          setAlertMessage({ severity: "error", message: "Error" });
          setAlertOpen(true);
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <CustomModal
        open={modalSelectOpen}
        setOpen={setModalSelectOpen}
        title={modalSelectContent.title}
        message={modalSelectContent.message}
        buttons={modalSelectContent.buttons}
      />
      <ModalWrapper
        title="Student List"
        maxWidth={850}
        open={studentListOpen}
        setOpen={setStudentListOpen}
      >
        <Grid container>
          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell
                      sx={{
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Student Name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      AUID
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Reporting Date
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Year/Sem
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Section
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList.length > 0 ? (
                    studentList.map((val, i) => (
                      <TableRow key={i} style={{ height: 10 }}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.student_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.auid}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.auid}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.auid}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.section_name}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>

      <ModalWrapper
        title="Student List"
        maxWidth={900}
        open={studentListOpen}
        setOpen={setStudentListOpen}
      >
        <Grid container>
          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small" className={classes.table}>
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell
                      sx={{
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Student Name
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      AUID
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      USN
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Reporting Date
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Year/Sem
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Batch
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      Section
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentList.length > 0 ? (
                    studentList.map((val, i) => (
                      <TableRow key={i} style={{ height: 10 }}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.student_name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.auid}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.usn}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.reporting_date
                            ? moment(val.reporting_date).format("DD-MM-YYYY")
                            : "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {`${val.current_year}/${val.current_sem}`}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.concat_batch_name ?? "NA"}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {val.section_name ?? "NA"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box>
        <FormWrapper>
          <Grid
            container
            justifyContent="flex-start"
            rowSpacing={2}
            columnSpacing={4}
          >
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="acYearId"
                value={values.acYearId}
                label="Academic Year"
                options={academicYearOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={10} textAlign="right">
              <Button
                onClick={handleSelectOpen}
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 2,
                }}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            </Grid>
            <Grid item xs={12} md={12}>
              <GridIndex
                rows={rows}
                columns={columns}
                checkboxSelection
                onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
              />
            </Grid>
          </Grid>
        </FormWrapper>
        <ModalWrapper
          maxWidth={800}
          open={employeeDetailsOpen}
          setOpen={setEmployeeDetailsOpen}
        >
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="employeeId"
                label="Employee"
                value={values.employeeId}
                options={employeeOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="courseId"
                label="Course"
                value={values.courseId}
                options={courseOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={handleSubmit}
              >
                SWAP
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>

        <ModalWrapper
          open={roomSwapOpen}
          setOpen={setRoomSwapOpen}
          maxWidth={800}
          title="Swap Room"
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={4}
            columnSpacing={2}
          >
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="roomId"
                label="Rooms"
                handleChangeAdvance={handleChangeAdvance}
                options={roomOptions}
                value={values.roomId}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                sx={{ borderRadius: 2 }}
                onClick={handleAssignRoom}
              >
                Assign
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>
      </Box>
    </>
  );
}
export default TimetableForSectionIndex;
