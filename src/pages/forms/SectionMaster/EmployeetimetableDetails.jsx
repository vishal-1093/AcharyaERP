import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
  },
}));

function EmployeetimetableDetails({ data, date }) {
  const [employeeData, setEmployeeData] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    getEmployeData();
  }, [data, date]);

  const getEmployeData = async () => {
    if (data && date)
      await axios
        .get(`/api/academic/fetchEmployeeTimetableSchedule/${data}/${date}`)
        .then((res) => {
          setEmployeeData(res.data.data);
        })
        .catch((err) => console.error(err));
  };
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead className={classes.bg}>
          <TableRow>
            <TableCell sx={{ color: "white" }}> Date</TableCell>

            <TableCell sx={{ color: "white" }}>Time Slot</TableCell>
            <TableCell sx={{ color: "white" }}>Institute</TableCell>
            <TableCell sx={{ color: "white" }}>Program</TableCell>
            <TableCell sx={{ color: "white" }}>Specialization</TableCell>
            <TableCell sx={{ color: "white" }}>Course</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeeData.map((obj, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{obj.from_date}</TableCell>

                <TableCell>{obj.timeSlots}</TableCell>
                <TableCell>{obj.school_name_short}</TableCell>
                <TableCell>{obj.program_short_name}</TableCell>
                <TableCell>{obj.program_specialization_short_name}</TableCell>
                <TableCell>{obj.course_short_name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default EmployeetimetableDetails;
