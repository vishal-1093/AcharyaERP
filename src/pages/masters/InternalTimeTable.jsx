import React from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import GridIndex from "../../components/GridIndex";
import moment from "moment";
import CustomTextField from "../../components/Inputs/CustomTextField";
import useAlert from "../../hooks/useAlert";

const InternalTimeTable = () => {
  const [data, setdata] = useState([]);
  const location = useLocation();
  const eventDetails = location.state?.eventDetails;
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const [selectAll, setSelectAll] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [showAttendanceView, setShowAttendanceView] = useState(false);
  const [attendanceButtonEnabled, setAttendanceButtonEnabled] = useState(false);

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedData = data.map((item) => ({
      ...item,
      selected: !selectAll,
      present: selectAll ? "P" : "A",
    }));
    setdata(updatedData);
  };

  const handleButton = async () => {
    await axios
      .get(`/api/academic/checkInternalExamAttendanceStatus/${eventDetails.id}`)
      .then((res) => {
        if (res.data.data.attendance_status === true) {
          setAttendanceButtonEnabled(true);
        } else {
          setAttendanceButtonEnabled(false);
        }
      });
  };

  useEffect(() => {
    setCrumbs([
      { name: "Calendar", link: "/SchedulerMaster" },
      { name: "Attendance" },
    ]);
    getData();
    handleButton();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `/api/student/studentDetailsByStudentIds/${eventDetails.student_ids}`
      )
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          const updatedData = res.data.data.map((item, index) => ({
            ...item,
            id: index,
            selected: false,
            present: "P",
          }));

          setdata(updatedData);
        } else {
          console.error("Data is not an array.");
        }
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "slNo",
      headerName: "Sl No",
      flex: 1,
      renderCell: (params) => params.api.getRowIndex(params.id) + 1,
    },
    {
      field: "selected",
      headerName: (
        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
      ),
      flex: 1,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={params.row.selected}
          onChange={() => {
            const updatedData = [...data];
            updatedData[params.row.id].selected = !params?.row?.selected;
            updatedData[params.row.id].present = params?.row?.selected
              ? "A"
              : "P";

            setdata(updatedData);
          }}
        />
      ),
    },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "student_name", headerName: "Student Name", flex: 1 },
    {
      field: "Present",
      headerName: "Attendance",
      flex: 1,
      renderCell: (params) => (
        <CustomTextField
          type="text"
          value={params.row.present}
          style={{
            backgroundColor: params.row.present === "P" ? "#90EE90" : "	#ff3333",
            width: "36px",
          }}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    const payload = data?.map((_data) => {
      return {
        active: true,
        course_assignment_id: eventDetails.course_assignment_id,
        course_id: eventDetails.course_id,
        emp_id: eventDetails.emp_ids,
        exam_date: eventDetails.date_of_exam,
        exam_room_id: eventDetails.room_id,
        exam_time: eventDetails.exam_time,
        internal_id: eventDetails.internal_id,
        internal_time_table_id: eventDetails.internal_time_table_id,
        internal_timetable_assignment_id: eventDetails.id,
        present_status: _data.present,
        remarks: eventDetails.remarks,
        room_id: eventDetails.room_id,
        student_id: _data.student_id,
        week_day: eventDetails.week_day,
      };
    });
    await axios
      .post(`/api/academic/internalAttendance`, payload)
      .then((res) => {
        if (res.data.success) {
          setAlertMessage({
            severity: "success",
            message: <>Attendance submitted successfully!</>,
          });
          handleButton();
          setAlertOpen(true);
          setShowAttendanceView(false);
        } else {
          setAlertMessage({
            severity: "error",
            message: <>Error while submitting attendance!</>,
          });
          setAlertOpen(true);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err?.response?.data?.message || "error",
        });
        setAlertOpen(true);
      });
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "rgba(74, 87, 169, 0.1)" }}>
            <TableRow>
              <TableCell>Internal Name</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Selected Date</TableCell>
              <TableCell>Course</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{eventDetails.internal_name}</TableCell>
              <TableCell>{eventDetails.timeSlots}</TableCell>
              <TableCell>
                {moment(eventDetails.date_of_exam).format("DD-MM-YYYY")}
              </TableCell>
              <TableCell>{eventDetails?.course_with_coursecode}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", gap: "20px" }}>
        <Button
          variant="contained"
          style={{ borderRadius: 7 }}
          onClick={() => setShowAttendanceView(true)}
          color="success"
          disabled={attendanceButtonEnabled}
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
          disabled={!attendanceButtonEnabled}
          onClick={() =>
            navigate("/InternalTimeTable/AttendanceReport", {
              state: { eventDetails: eventDetails },
            })
          }
        >
          Attendance Report
        </Button>
      </Box>

      {showAttendanceView && (
        <>
          <GridIndex rows={data} columns={columns} style={{ marginTop: 50 }} />
          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              backgroundColor: "green",
              color: "white",
              float: "right",
            }}
            onClick={handleSubmit}
            disabled={data?.length === 0}
          >
            SUBMIT
          </Button>
        </>
      )}
    </>
  );
};

export default InternalTimeTable;
