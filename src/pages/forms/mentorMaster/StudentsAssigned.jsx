import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      fontSize: "15px",
    },
  },
});

function StudentsAssigned({ studentDetails }) {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} mt={3}>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.headerWhite.main,
              }}
            >
              <TableRow>
                <TableCell>SL.No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>AUID</TableCell>
                <TableCell>USN</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Program Specialization</TableCell>
                <TableCell>Academic Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentDetails.map((val, i) => (
                <TableRow key={i} style={{ height: 10 }}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{val.student_name}</TableCell>
                  <TableCell>{val.auid}</TableCell>
                  <TableCell>{val.usn}</TableCell>
                  <TableCell>{val.school_name_short}</TableCell>
                  <TableCell>{val.program_short_name}</TableCell>
                  <TableCell>{val.program_specialization_short_name}</TableCell>
                  <TableCell>{val.ac_year}</TableCell>
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
