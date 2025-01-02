import React from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Box,
  TableContainer,
  Paper,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../services/Api";
import FacultyDetailsAttendanceView from "./FacultyDetailsAttendanceView";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import OverlayLoader from "../../components/OverlayLoader";
import moment from "moment";
import StudentDetailsByBatch from "./StudentDetailsByBatch";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CustomRadioButtons from "../../components/Inputs/CustomRadioButtons";

const FacultyDetails = () => {
  const [data, setdata] = useState([]);
  const [values, setValues] = useState({ ictStatus: null });
  const [program, setProgram] = useState([]);
  const [showAttendanceView, setShowAttendanceView] = useState(false);
  const [loader, setLoader] = useState(false);
  const [report, setReport] = useState(true);
  const location = useLocation();
  const { eventDetails } = location.state;
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const [attendanceButtonEnabled, setAttendanceButtonEnabled] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    handleButton();
    getdata();
    setCrumbs([
      { name: "Calendar", link: "/Dashboard" },
      { name: "Attendance" },
    ]);
  }, []);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleButton = async () => {
    await axios
      .get(`api/academic/checkAttendanceStatus/${eventDetails.id}`)
      .then((res) => {
        if (
          res.data.data.attendance_status === 1 ||
          res.data.data.attendance_status
        ) {
          setAttendanceButtonEnabled(true);
          setReport(false);
        } else {
          setAttendanceButtonEnabled(false);
        }
      });
  };

  console.log(eventDetails);

  const fetchData = async () => {
    let url = "";
    if (eventDetails.sectionAssignmentId !== null) {
      url = `api/academic/programSpecilizationByBatchAssignmentIdOrSectionAssignmentId?sectionAssignmentId=${eventDetails?.sectionAssignmentId}`;
    } else {
      url = `api/academic/programSpecilizationByBatchAssignmentIdOrSectionAssignmentId?batchAssignmentId=${eventDetails?.batch_assignment_id}`;
    }

    const response = await axios.get(url);

    if (response?.data?.data) {
      setProgram(response?.data?.data);
    }
  };

  const getdata = async () => {
    setLoader(true);
    await axios
      .get(
        `api/academic/fetchDetailsOfFacultyByTimeTableId/${eventDetails.id}/${eventDetails.empId}`
      )
      .then((res) => {
        setdata(res.data.data);
        setLoader(false);
        fetchData();
        const currentTime = new Date();
        const time1 = new Date(currentTime);
        const time2 = new Date(eventDetails?.start);

        // Calculate the end time (start time + 24 hours)
        // const endTime = new Date(eventDetails?.start);
        // endTime.setHours(eventDetails?.start.getHours() + 24);

        // Check if the start time is greater than the current time and within 24 hours && endTime > currentTime
        if (time1 >= time2) {
          console.log("The start time is valid for 24 hours from now.");
          setIsDisable(false);
        } else {
          console.log("The start time is not valid.");
          setIsDisable(true);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {loader ? (
        <OverlayLoader />
      ) : (
        <>
          <h3>Faculty Details</h3>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "rgba(74, 87, 169, 0.1)" }}>
                <TableRow>
                  <TableCell>Class Date</TableCell>
                  <TableCell>Week Day</TableCell>
                  <TableCell>Class Interval</TableCell>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Course Specialisation</TableCell>
                  <TableCell>Sem</TableCell>
                  <TableCell>Section/Batch</TableCell>
                  <TableCell>Room Code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {moment(item.selectedDate).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{item.weekDay}</TableCell>
                    <TableCell>{item.interval}</TableCell>
                    <TableCell>{item.courseCode ?? item.subjectCode}</TableCell>
                    <TableCell>{item.course}</TableCell>
                    <TableCell>
                      {program?.map(
                        (prog) => prog?.program_specialization_short_name
                      )}
                    </TableCell>
                    <TableCell>{item.sem || item.year}</TableCell>
                    <TableCell
                      onClick={() => setShowModel(true)}
                      sx={{ textAlign: "center" }}
                    >
                      <span
                        style={{
                          color: "red",
                          cursor: "pointer",
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        {item.sectionName || item.batchName}
                      </span>
                    </TableCell>
                    <TableCell>{item.roomCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog
            open={showModel}
            onClick={() => setShowModel(false)}
            fullWidth={true}
            maxWidth={"md"}
          >
            <DialogContent sx={{ p: 4 }}>
              <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12} md={6}>
                  <h3>
                    Student Details-
                    {`${eventDetails.section_name || eventDetails.batch_name}-${
                      eventDetails.program_specialization_short_name
                    }-${eventDetails.current_sem}`}{" "}
                  </h3>
                </Grid>
                <Grid item xs={12} md={6} mb={1} align="right">
                  <IconButton color="error" onClick={() => setShowModel(false)}>
                    <HighlightOffRoundedIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>

              <StudentDetailsByBatch eventDetails={eventDetails} />
            </DialogContent>
          </Dialog>

          <Box sx={{ display: "flex" }}>
            <Grid container justifyContent="left" alignItems="center">
              <Grid item xs={12} md={1} mt={1}>
                <CustomRadioButtons
                  name="ictStatus"
                  label="ICT STATUS"
                  value={values.ictStatus}
                  items={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  handleChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={2} mt={1}>
                <Button
                  variant="contained"
                  style={{ borderRadius: 7 }}
                  onClick={() => setShowAttendanceView(true)}
                  color="success"
                  disabled={
                    attendanceButtonEnabled ||
                    isDisable ||
                    values.ictStatus === null
                  }
                  sx={{
                    borderRadius: 7,
                    marginTop: "8px",
                    marginRight: "5px",
                  }}
                >
                  Attendance
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  style={{ borderRadius: 7, marginTop: "8px" }}
                  disabled={report}
                  onClick={() =>
                    navigate("/FacultyDetails/AttendanceReport", {
                      state: { eventDetails: eventDetails },
                    })
                  }
                >
                  Attendance Report
                </Button>
              </Grid>
            </Grid>
          </Box>
          {showAttendanceView && (
            <FacultyDetailsAttendanceView
              eventDetails={eventDetails}
              checkStatus={handleButton}
              values={values}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FacultyDetails;
