// StudentAttendancePopup.js

import React, { useEffect, useState } from "react";
import {
  TableContainer,
  styled,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  tableCellClasses,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../services/Api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: 0,
    textAlign: "center",
  },
}));

const StyledTableCell1 = styled(TableCell)(({ theme, present_status }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: 0,
    textAlign: "center",
    color: present_status
      ? theme.palette.success.main
      : theme.palette.error.main,
  },
}));

const StudentAttendancePopup = ({ open, onClose, studentId, data, applicantData }) => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (open) getAttendanceData();
  }, [open]);

  const getAttendanceData = async () => {
    const { ac_year_id, course_assignment_id, course_id, year_or_sem } = data;
    try {
      const res = await axios.get(
        `/api/student/getDetailedStudentAttendanceOfStudentByCourse/${studentId}/${ac_year_id}/${course_assignment_id}/${course_id}/${year_or_sem}`
      );
      setAttendanceData(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Attendance for {applicantData?.student_name} - {applicantData?.auid}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table size="small" sx={{ borderCollapse: "separate", borderSpacing: "1px" }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>AUID</StyledTableCell>
                  <StyledTableCell>Student Name</StyledTableCell>
                  {attendanceData.map((_, index) => (
                    <StyledTableCell1 key={index}>{index + 1}</StyledTableCell1>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ outline: "1px solid rgba(224, 224, 224, 1)" }}>
                  <StyledTableCell>{applicantData.auid}</StyledTableCell>
                  <StyledTableCell>{applicantData.student_name}</StyledTableCell>
                  {attendanceData.map((subject, index) => (
                    <StyledTableCell1
                      key={index}
                      present_status={subject.present_status}
                    >
                      {subject.present_status ? "P" : "A"}
                    </StyledTableCell1>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default StudentAttendancePopup;
