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
    backgroundColor: theme.palette.auzColor.main,
  },
}));

function EmployeetimetableDetails({
  data,
  date,
  toDate,
  weekDay,
  selectedDay,
}) {
  const [employeeData, setEmployeeData] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    getEmployeData();
  }, [data, date, toDate, weekDay, selectedDay]);

  const getEmployeData = async () => {
    if (data && date && toDate && (weekDay || selectedDay))
      await axios
        .get(
          `/api/academic/fetchEmployeeTimetableSchedule/${data}/${date}/${toDate}/${
            weekDay ? weekDay : selectedDay
          }`
        )
        .then((res) => {
          setEmployeeData(res.data.data);
        })
        .catch((err) => console.error(err));
  };
  return (
    <>
      {employeeData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead className={classes.bg}>
              <TableRow>
                <TableCell sx={{ color: "white" }}> Employee</TableCell>
                <TableCell sx={{ color: "white" }}> Date</TableCell>
                <TableCell sx={{ color: "white" }}>Time Slot</TableCell>
                <TableCell sx={{ color: "white" }}>Institute</TableCell>
                <TableCell sx={{ color: "white" }}>Program</TableCell>
                <TableCell sx={{ color: "white" }}>Specialization</TableCell>
                <TableCell sx={{ color: "white" }}>Section</TableCell>
                <TableCell sx={{ color: "white" }}>Sem</TableCell>
                <TableCell sx={{ color: "white" }}>Course</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeData.map((obj, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>{obj.employee_name}</TableCell>
                    <TableCell>
                      {obj.selected_date.split("-").reverse().join("-")}
                    </TableCell>
                    <TableCell>{obj.timeSlots}</TableCell>
                    <TableCell>{obj.school_name_short}</TableCell>
                    <TableCell>{obj.program_short_name}</TableCell>
                    <TableCell>
                      {obj.program_specialization_short_name}
                    </TableCell>
                    <TableCell>{obj.section_name}</TableCell>
                    <TableCell>{obj.year_sem}</TableCell>
                    <TableCell>{obj.course_short_name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <></>
      )}
    </>
  );
}
export default EmployeetimetableDetails;
