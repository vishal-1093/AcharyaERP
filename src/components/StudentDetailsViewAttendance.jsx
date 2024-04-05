import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "../services/Api";
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
} from "@mui/material";
import useBreadcrumbs from "../hooks/useBreadcrumbs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
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
    backgroundColor: theme.palette.auzColor.main,
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

const StudentDetailsViewAttendance = () => {
  const location = useLocation();
  const { data, id, applicantData } = location.state;
  const { studentId } = useParams();

  const setCrumbs = useBreadcrumbs();
  const [Data, setData] = useState([]);
  useEffect(() => {
    setCrumbs([
      {
        name: "Student Details",
        link: `/StudentDetailsMaster/StudentsDetails/${studentId}`,
      },
      { name: applicantData?.student_name + "-" + applicantData?.auid },
    ]);
  }, [applicantData]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { ac_year_id, course_assignment_id, course_id, year_or_sem } = data;
    await axios
      .get(
        `/api/student/getDetailedStudentAttendanceOfStudentByCourse/${studentId}/${ac_year_id}/${course_assignment_id}/${course_id}/${year_or_sem}`
      )
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Box mt={2} p={3}>
        <TableContainer component={Paper}>
          <Table
            size="small"
            sx={{ borderCollapse: "separate", borderSpacing: "1px" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>Auid</StyledTableCell>
                <StyledTableCell>Student Name</StyledTableCell>
                {Data.map((row, index) => (
                  <>
                    <StyledTableCell1>{index + 1}</StyledTableCell1>
                  </>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ outline: "1px solid rgba(224, 224, 224, 1)" }}>
                <StyledTableCell>{applicantData.auid}</StyledTableCell>
                <StyledTableCell>{applicantData.student_name}</StyledTableCell>

                {Data.map((subject, index) => (
                  <>
                    <StyledTableCell1
                      key={index}
                      present_status={subject.present_status}
                    >
                      {subject.present_status ? "P" : "A"}
                    </StyledTableCell1>
                  </>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default StudentDetailsViewAttendance;
