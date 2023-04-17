import { useState, useEffect } from "react";
import { Box, Button, IconButton, Grid, Typography } from "@mui/material";
import GridIndex from "../../../components/GridIndex";
import { Check, HighlightOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import ModalWrapper from "../../../components/ModalWrapper";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  acYearId: 1,
  courseId: null,
  employeeId: null,
};

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

  const navigate = useNavigate();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const columns = [
    {
      field: "ac_year",
      headerName: "AC Year",
      flex: 1,
    },
    { field: "school_name_short", headerName: " School Name", flex: 1 },
    {
      field: "program_specialization_short_name",
      headerName: "Specialization",
      flex: 1,
      valueGetter: (params) =>
        params.row.program_specialization_short_name
          ? params.row.program_specialization_short_name
          : "NA",
    },
    { field: "current_year", headerName: "Year/Sem", flex: 1 },
    { field: "from_date", headerName: "From Date", flex: 1, hide: true },
    { field: "to_date", headerName: "To Date", flex: 1, hide: true },
    { field: "week_day", headerName: "Week Day", flex: 1 },
    { field: "timeSlots", headerName: "Time Slots", flex: 1 },
    {
      field: "interval_type_short",
      headerName: "Interval Type",
      flex: 1,
    },
    {
      field: "employee_name",
      headerName: "Employee",
      flex: 1,
    },
    { field: "course", headerName: "Course", flex: 1, hide: true },
    { field: "selected_date", headerName: "Selected date", flex: 1 },
    { field: "room_code", headerName: "Room Code", flex: 1 },
    {
      field: "section_name",
      headerName: "Section",
      flex: 1,
      valueGetter: (params) =>
        params.row.section_name ? params.row.section_name : "NA",
    },
    {
      field: "batch_name",
      headerName: "Batch",
      flex: 1,
      valueGetter: (params) =>
        params.row.batch_name ? params.row.batch_name : "NA",
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
      field: "created_username",
      headerName: "Created By",
      flex: 1,
      hide: true,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      flex: 1,
      type: "date",
      hide: true,
      valueGetter: (params) =>
        params.row.created_date ? params.row.created_date.slice(0, 10) : "",
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
    getAcYearData();
    getCourseData();
  }, [values.acYearId, values.employeeId]);

  const getAcYearData = async () => {
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

  const getData = async () => {
    if (values.acYearId)
      await axios
        .get(
          `/api/academic/fetchAllTimeTableDetailsForIndex/${values.acYearId}`
        )
        .then((res) => {
          setRows(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setIds(selectedRowsData.map((val) => val.id));
  };

  const handleChangeAdvance = async (name, newValue) => {
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

  const getCourseData = async () => {
    if (values.employeeId)
      await axios
        .get(`/api/academic/getAssignedCourses/${values.employeeId}`)
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.course_id,
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
          setEmployeeDetailsOpen(false);
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
      </Box>
    </>
  );
}
export default TimetableForSectionIndex;
