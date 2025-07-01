import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "../../../services/Api";

// Color logic
const getColor = (percentage) => {
  if (percentage >= 75) return "#4caf50"; // Green
  if (percentage >= 60) return "#ff9800"; // Amber
  return "#f44336"; // Red
};

const Row = ({ student }) => {
  const [open, setOpen] = useState(false);
  const overall =
    student.studentAttendanceDetail.find((d) => d.overallAttendance)
      ?.overallAttendance ?? "N/A";

  const courseRows = student.studentAttendanceDetail
    .filter((d) => !d.overallAttendance)
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (v) =>
            v.course_id === value.course_id &&
            v.course_assignment_id === value.course_assignment_id
        )
    );

  return (
    <>
      <TableRow
        hover
        sx={{ transition: "0.3s", "&:hover": { backgroundColor: "#f9fbfd" } }}
      >
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>{student.auid}</TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>{student.auid}</TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>{student.studentName}</TableCell>
        <TableCell sx={{ color: "#2e3a59" }}>1/1</TableCell>
        <TableCell>
          <strong style={{ color: getColor(overall), fontWeight: 600 }}>
            {overall}%
          </strong>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          colSpan={6}
          sx={{ paddingBottom: 0, paddingTop: 0, border: "none" }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                backgroundColor: "#fafbfc",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#37474f" }}
              >
                Course-wise Attendance
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
                    <TableCell>
                      <strong>Course Code</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Course Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Present</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>
                      <strong>%</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseRows.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {course.course_assignment_coursecode}
                      </TableCell>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell>{course.present}</TableCell>
                      <TableCell>{course.total}</TableCell>
                      <TableCell>
                        <strong
                          style={{
                            color: getColor(course.percentage),
                            fontWeight: 500,
                          }}
                        >
                          {course.percentage}%
                        </strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const AttendanceTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `/api/student/overallAttendanceInYearOrSem/6/1/1/52/1/6`
      );

      if (response.data.data.length > 0) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box padding={2}>
      <TableContainer
        component={Paper}
        sx={{
          mt: 1,
          borderRadius: 3,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          fontFamily: `"Inter", "Roboto", "Segoe UI", sans-serif`,
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f4f8" }}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                AUID
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                USN
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                Student Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                Year/Sem
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#2e3a59" }}>
                Overall Attendance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((student, idx) => (
              <Row key={idx} student={student} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTable;
