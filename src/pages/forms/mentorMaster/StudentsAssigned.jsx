import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid, styled, tableCellClasses } from "@mui/material";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
    border: "none",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function StudentsAssigned({ studentDetails }) {
  return (
    <>
      <Grid item xs={12} mt={3}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ color: "white" }}>SL.No</StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  Student Name
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>AUID</StyledTableCell>{" "}
                <StyledTableCell sx={{ color: "white" }}>
                  School
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  Program
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  Program Specialization
                </StyledTableCell>
                <StyledTableCell sx={{ color: "white" }}>
                  Academic Year
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentDetails.map((val, i) => (
                <TableRow key={i}>
                  <StyledTableCell>{i + 1}</StyledTableCell>
                  <StyledTableCell>{val.student_name}</StyledTableCell>
                  <StyledTableCell>{val.auid}</StyledTableCell>
                  <StyledTableCell>{val.school_name_short}</StyledTableCell>
                  <StyledTableCell>{val.program_short_name}</StyledTableCell>
                  <StyledTableCell>
                    {val.program_specialization_short_name}
                  </StyledTableCell>
                  <StyledTableCell>{val.ac_year}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
export default StudentsAssigned;
