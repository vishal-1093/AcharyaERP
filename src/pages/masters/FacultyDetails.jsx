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
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../services/Api";
import FacultyDetailsAttendanceView from "./FacultyDetailsAttendanceView";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import OverlayLoader from "../../components/OverlayLoader";
import moment from "moment";
import StudentDetailsByBatch from "./StudentDetailsByBatch";

const FacultyDetails = () => {
  const [data, setdata] = useState([]);
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
      { name: "Calendar", link: "/SchedulerMaster" },
      { name: "Attendance" },
    ]);
  }, []);

  const handleButton = async () => {
    await axios
      .get(`api/academic/checkAttendanceStatus/${eventDetails.id}`)
      .then((res) => {
        if (res.data.data.attendance_status === true) {
          setAttendanceButtonEnabled(true);
          setReport(false);
        } else {
          setAttendanceButtonEnabled(false);
        }
      });
  };

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
        // Calculate the end time (start time + 24 hours)
        // const endTime = new Date(eventDetails?.start);
        // endTime.setHours(eventDetails?.start.getHours() + 24);

        // Check if the start time is greater than the current time and within 24 hours && endTime > currentTime
        if (currentTime >= eventDetails?.start) {
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
                    <TableCell>{item?.subjectCode}</TableCell>
                    <TableCell>{item.course}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: "150px",
                          height: "32px",
                          overflowY: "auto",
                        }}
                      >
                        {program?.map((prog) => (
                          <Chip
                            title={prog?.program_specialization_name}
                            label={prog?.program_specialization_short_name}
                            sx={{ margin: "2px" }}
                          />
                        ))}
                      </Box>
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
            onClose={() => setShowModel(false)}
            fullWidth={true}
            maxWidth={"md"}
          >
            <DialogContent sx={{ p: 4 }}>
              <h3>Student Details</h3>
              <StudentDetailsByBatch eventDetails={eventDetails} />
            </DialogContent>
          </Dialog>

          <Box sx={{ display: "flex", gap: "20px" }}>
            <Button
              variant="contained"
              style={{ borderRadius: 7 }}
              onClick={() => setShowAttendanceView(true)}
              color="success"
              disabled={attendanceButtonEnabled || isDisable}
              sx={{
                borderRadius: 7,
                marginTop: "8px",
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
          </Box>
          {showAttendanceView && (
            <FacultyDetailsAttendanceView
              eventDetails={eventDetails}
              checkStatus={handleButton}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FacultyDetails;
