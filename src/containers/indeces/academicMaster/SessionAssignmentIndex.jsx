import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import { makeStyles } from "@mui/styles";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  courseId: null,
  dateOfExam: null,
  timeSlotId: null,
};

const useStyles = makeStyles((theme) => ({
  bg: {
    background: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

function SessionAssignmentIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAssignOpen, setModalAssignOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [timeSlotsOptions, setTimeSlotOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const navigate = useNavigate();
  const classes = useStyles();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const d = new Date(values.dateOfExam);

  const days = weekday[d.getDay()];

  const columns = [
    { field: "internal_name", headerName: "Session", flex: 1 },
    {
      field: "from_date",
      headerName: "From Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.from_date),
    },
    {
      field: "to_date",
      headerName: "To Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.to_date),
    },
    { field: "ac_year", headerName: "AC Year", flex: 1 },
    { field: "school_name_short", headerName: " School Name", flex: 1 },
    { field: "program_short_name", headerName: "Program", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
    },
    { field: "year_sem", headerName: "Year/Sem", flex: 1 },
    { field: "min_marks", headerName: "Min Marks", flex: 1 },
    { field: "max_marks", headerName: "Max Marks", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "created_username", headerName: "Created By", flex: 1 },

    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      valueGetter: (params) => new Date(params.row.created_date),
    },
    {
      field: "add",
      headerName: "Assign",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <IconButton color="primary" onClick={() => handleDetails(params)}>
          <AssignmentIcon />
        </IconButton>,
      ],
    },
    {
      field: "id",
      type: "actions",
      flex: 1,
      headerName: "Update",
      getActions: (params) => [
        <IconButton
          onClick={() =>
            navigate(`/SessionAssignmentForm/Update/${params.row.id}`)
          }
        >
          <EditIcon />
        </IconButton>,
      ],
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
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/academic/fetchAllInternalSessionAssignment?page=${0}&page_size=${100}&sort=created_date`
      )
      .then((res) => {
        setRows(res.data.data.Paginated_data.content);
      })
      .catch((err) => console.error(err));
  };

  const handleActive = async (params) => {
    const id = params.row.id;

    const handleToggle = async () => {
      if (params.row.active === true) {
        await axios
          .delete(`/api/academic/internalSessionAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      } else {
        await axios
          .delete(`/api/academic/activateinternalSessionAssignment/${id}`)
          .then((res) => {
            if (res.status === 200) {
              getData();
            }
          })
          .catch((err) => console.error(err));
      }
    };
    params.row.active === true
      ? setModalContent({
          title: "",
          message: "Do you want to make it Inactive ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        })
      : setModalContent({
          title: "",
          message: "Do you want to make it Active ?",
          buttons: [
            { name: "Yes", color: "primary", func: handleToggle },
            { name: "No", color: "primary", func: () => {} },
          ],
        });
    setModalOpen(true);
  };

  const handleDetails = async (params) => {
    setFromDate(params.row.from_date);
    setToDate(params.row.to_date);
    setModalAssignOpen(true);
    getTableData();
    await axios
      .get(`/api/academic/getTimeSlotsForTimeTable/${params.row.school_id}`)
      .then((res) => {
        setTimeSlotOptions(
          res.data.data.map((obj) => ({
            value: obj.time_slots_id,
            label: obj.timeSlots,
          }))
        );
      })
      .catch((error) => console.error(error));

    await axios
      .get(
        `/api/academic/internalTimeTableForAllData/${params.row.school_id}/${params.row.program_id}/${params.row.program_specialization_id}/${params.row.ac_year_id}/${params.row.year_sem}`
      )
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_id,
            label: obj.course_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getTableData = async () => {
    if (values.dateOfExam)
      await axios
        .get(
          `/api/academic/internalTimeTableDataBasisOfDOE/${values.dateOfExam}`
        )
        .then((res) => {})
        .catch((error) => console.error(error));
  };

  const handleSubmit = async () => {
    const temp = {};
    temp.active = true;
    temp.course_id = values.courseId;
    temp.date_of_exam = values.dateOfExam;
    temp.week_day = days;

    await axios
      .post(`/api/academic/internalTimeTable`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Created" });
          setAlertOpen(true);
          setModalAssignOpen(false);
        } else {
          setAlertMessage({ severity: "error", message: "An error occured" });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
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
      <ModalWrapper open={modalAssignOpen} setOpen={setModalAssignOpen}>
        <Grid
          container
          justifycontents="flex-start"
          rowSpacing={2}
          columnSpacing={2}
          mt={2}
        >
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
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="dateOfExam"
              label="Date of Exam"
              value={values.dateOfExam}
              handleChangeAdvance={handleChangeAdvance}
              required
              minDate={fromDate}
              maxDate={toDate}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="timeSlotId"
              label="Time Slots"
              value={values.timeSlotId}
              options={timeSlotsOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={handleSubmit}
            >
              SUBMIT
            </Button>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} mt={4}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow className={classes.bg}>
                    <TableCell sx={{ color: "white" }}>Exam Time</TableCell>
                    <TableCell sx={{ color: "white" }}>Exam Date</TableCell>
                    <TableCell sx={{ color: "white" }}>Course</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </ModalWrapper>

      <Box sx={{ position: "relative", mt: 8 }}>
        <Button
          onClick={() => navigate("/SessionAssignmentForm")}
          variant="contained"
          disableElevation
          sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
          startIcon={<AddIcon />}
        >
          Create
        </Button>
        <GridIndex rows={rows} columns={columns} />
      </Box>
    </>
  );
}
export default SessionAssignmentIndex;
