import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const initialValues = {
  date: null,
  schoolId: null,
  timeSlotId: null,
  roomId: null,
  empId: null,
};

const requiredFields = ["date", "schoolId", "timeSlotId", "roomId"];

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    border: "1px solid rgba(224, 224, 224, 1)",
    textAlign: "center",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

function InternalRoomAssignment() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [timeSlotOptions, setTimeslotOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [empOptions, setEmpOptions] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    setCrumbs([
      { name: "Internal Assesment", link: "/internals" },
      { name: "Room Assignment", link: "/internals/room-assignment" },
    ]);
  }, []);

  useEffect(() => {
    getTimeSlots();
  }, [values.schoolId]);

  const fetchData = async () => {
    try {
      const schoolResponse = await axios.get("/api/institute/school");
      const schoolOptionData = [];
      schoolResponse.data.data.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });

      setSchoolOptions(schoolOptionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load schools !!",
      });
      setAlertOpen(true);
    }
  };

  const getTimeSlots = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;
    try {
      const [slotResponse, roomResponse] = await Promise.all([
        axios.get(`/api/academic/getTimeSlotsForInternals/${schoolId}`),
        axios.get("/api/academic/getRoomsForInternals"),
      ]);
      const optionData = [];
      slotResponse.data.data.forEach((obj) => {
        optionData.push({
          value: obj.time_slots_id,
          label: obj.timeSlots,
        });
      });

      const roomOptionData = [];
      roomResponse.data.data.forEach((obj) => {
        roomOptionData.push({
          value: obj.room_id,
          label: obj.roomcode,
        });
      });
      setTimeslotOptions(optionData);
      setRoomOptions(roomOptionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the Time Slots",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeStatus = (e) => {
    const { name, checked } = e.target;
    const [field, index] = name.split("-");
    const courseAssignmentId = Number(index);
    setValues((prev) => ({
      ...prev,
      rowData: prev.rowData.map((obj) =>
        obj.courseAssignmentId === courseAssignmentId
          ? { ...obj, [field]: checked }
          : obj
      ),
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { date, timeSlotId, roomId } = values;
    if (!date || !timeSlotId || !roomId) return null;
    try {
      setSubmitLoading(true);
      const formatDate = moment(date).format("DD-MM-YYYY");
      const [courseResponse, empResponse, roomResponse] = await Promise.all([
        axios.get(
          `/api/academic/getCoursesOnDateOfExamAndTimeSlotsId/${formatDate}/${timeSlotId}`
        ),
        axios.get(
          `/api/academic/getUnoccupiedEmployeesForInternals1/${timeSlotId}/${formatDate}`
        ),
        axios.get(
          `/api/academic/getAssignedCoursesOnDateOfExamAndTimeSlotsIdAndRoomId/${formatDate}/${timeSlotId}/${roomId}`
        ),
      ]);
      const courseResponseData = courseResponse.data.data;
      const empResponseData = empResponse.data.data;
      const roomResponseData = roomResponse.data.data;

      const empOptionData = [];
      empResponseData.forEach((obj) => {
        empOptionData.push({
          value: obj.emp_id,
          label: obj.employeeName,
        });
      });

      const assignedInternals = [];
      roomResponseData.forEach((obj) => {
        assignedInternals.push(obj.internal_session_id);
      });
      const valuesData = [];
      courseResponseData.forEach((obj) => {
        const {
          course_assignment_id,
          course,
          max_marks: maxMarks,
          min_marks: minMarks,
          internal_session_id: internalId,
        } = obj;
        const tempObj = {};
        tempObj.courseAssignmentId = course_assignment_id;
        tempObj.course = course;
        tempObj.maxMarks = maxMarks;
        tempObj.minMarks = minMarks;
        tempObj.status = assignedInternals.includes(internalId);
        tempObj.disabled = assignedInternals.includes(internalId);
        tempObj.internalId = internalId;
        valuesData.push(tempObj);
      });

      let empId;
      if (roomResponseData.length > 0) {
        empId = roomResponseData[0].emp_ids;
      }
      setValues((prev) => ({
        ...prev,
        ["rowData"]: valuesData,
        empId,
      }));
      setEmpOptions(empOptionData);
      setRoomData(roomResponseData);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load schools !!",
      });
      setAlertOpen(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  const validate = () => {
    const { empId, rowData } = values;
    const filter = rowData?.filter(
      (obj) => obj.status === true && obj.disabled === false
    );
    if (empId === null || filter.length === 0) return false;
    return true;
  };

  const handleCreate = async () => {
    const { empId, roomId, rowData } = values;
    try {
      setLoading(true);
      const internalIds = [];
      const filterData = rowData.filter(
        (obj) => obj.status === true && obj.disabled === false
      );
      filterData.forEach((obj) => {
        internalIds.push(obj.internalId);
      });

      const postData = {
        active: true,
        internal_session_id: internalIds,
        emp_ids: [empId],
        room_id: roomId,
      };

      const response = await axios.post(
        "/api/academic/internalFacultyRoomAssignment",
        postData
      );

      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Internals has been assigned to room successfully !!",
        });
        setAlertOpen(true);
        navigate("/internals/room-assignment");
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const DisplayTableCell = ({ label, align = "left" }) => (
    <StyledTableCellBody sx={{ textAlign: align }}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </StyledTableCellBody>
  );

  return (
    <Box m={4}>
      <FormPaperWrapper>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="date"
              label="Exam Date"
              value={values.date}
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

          {values.schoolId && (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="timeSlotId"
                label="Time Slot"
                value={values.timeSlotId}
                options={timeSlotOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="roomId"
              label="Room"
              value={values.roomId}
              options={roomOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitLoading || !requiredFieldsValid()}
            >
              {submitLoading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <Typography variant="subtitle2">Submit</Typography>
              )}
            </Button>
          </Grid>

          {values?.rowData?.length > 0 && (
            <>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableHeadCell />
                        <StyledTableHeadCell>Course</StyledTableHeadCell>
                        <StyledTableHeadCell>Max Marks</StyledTableHeadCell>
                        <StyledTableHeadCell>Min Marks</StyledTableHeadCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {values.rowData.map((obj, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            backgroundColor: obj.disabled
                              ? "#dcf7dd"
                              : "transparent",
                          }}
                        >
                          <StyledTableCellBody sx={{ width: "3%" }}>
                            <Checkbox
                              name={`status-${obj.courseAssignmentId}`}
                              onChange={handleChangeStatus}
                              checked={obj.status}
                              disabled={obj.disabled}
                              sx={{
                                padding: 0,
                              }}
                            />
                          </StyledTableCellBody>
                          <DisplayTableCell label={obj.course} />
                          <DisplayTableCell
                            label={obj.maxMarks}
                            align="center"
                          />
                          <DisplayTableCell
                            label={obj.minMarks}
                            align="center"
                          />
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={3}>
                {roomData.length > 0 ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="subtitle2">Invigilator : </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {roomData?.[0]?.employee_name}
                    </Typography>
                  </Box>
                ) : (
                  <CustomAutocomplete
                    name="empId"
                    label="Invigilator"
                    value={values.empId}
                    options={empOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                )}
              </Grid>

              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading || !validate()}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <Typography variant="subtitle2">Assign</Typography>
                  )}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default InternalRoomAssignment;
