import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

function StudentCoursewiseAttendance() {
  const [data, setData] = useState([]);
  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Sl No.</StyledTableCell>
              <StyledTableCell>Faculty</StyledTableCell>
              <StyledTableCell>Topic Taught </StyledTableCell>
              <StyledTableCell>Teaching Aid </StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Time Slot</StyledTableCell>
              <StyledTableCell>Attendance Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((obj, i) => (
              <StyledTableRow key={i}>
                <StyledTableCellBody>{`${obj.course_name} - ${obj.course_code}`}</StyledTableCellBody>
                <StyledTableCellBody>{obj.total}</StyledTableCellBody>
                <StyledTableCellBody>{obj.present}</StyledTableCellBody>
                <StyledTableCellBody>{obj.percentage}</StyledTableCellBody>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StudentCoursewiseAttendance;
