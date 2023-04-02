import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function StudentsAssigned({ studentDetails }) {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} mt={3}>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead className={classes.bg}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>SL.No</TableCell>
                <TableCell sx={{ color: "white" }}>Student Name</TableCell>
                <TableCell sx={{ color: "white" }}>AUID</TableCell>
                <TableCell sx={{ color: "white" }}>USN</TableCell>
                <TableCell sx={{ color: "white" }}>School</TableCell>
                <TableCell sx={{ color: "white" }}>Program</TableCell>
                <TableCell sx={{ color: "white" }}>
                  Program Specialization
                </TableCell>
                <TableCell sx={{ color: "white" }}>Academic Year</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentDetails.map((val, i) => (
                <TableRow key={i}>
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
