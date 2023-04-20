import { useState, useEffect } from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { makeStyles } from "@mui/styles";
import axios from "../../../services/Api";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },

  table: {
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
      padding: 5,
      textAlign: "center",
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function FacultyWorkloadDaywise() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rowTotal, setRowTotal] = useState([]);

  const { empId, year, month } = useParams();

  const setCrumbs = useBreadcrumbs();

  const classes = useStyles();

  useEffect(() => {
    getEmployeeDetails();
    getData();
  }, []);

  const getEmployeeDetails = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${empId}`)
      .then((res) => {
        setCrumbs([
          { name: "Faculty Work Load" },
          { name: res.data.data[0].employee_name },
          { name: monthNames[month - 1] },
          { name: year },
        ]);
      })
      .catch();
  };

  const getData = async () => {
    const fromDate = year + "-" + month + "-" + "01";
    const toDate =
      year + "-" + month + "-" + new Date(year, month, 0).getDate();

    await axios
      .get(
        `/api/academic/getEmployeeSubjectDailyWorkedHours/${fromDate}/${toDate}/${empId}`
      )
      .then((res) => {
        const getCourses = res.data.data.map((obj) => obj.course_name);
        const uniqueCourses = getCourses.filter(
          (obj, i) => getCourses.indexOf(obj) === i
        );

        const daysTemp = [];
        const getDays = new Date(year, month, 0).getDate();

        for (let i = 1; i <= getDays; i++) {
          daysTemp.push({
            label: "a",
            value: i,
            day: dayNames[new Date(year + "-" + month + "-" + i).getDay()],
          });
        }

        const temp = {};
        const tempTotal = {};

        daysTemp.forEach((obj) => {
          uniqueCourses.forEach((item) => {
            res.data.data.filter((val) => {
              if (val.course_name === item && obj.value in val === true) {
                // total = total + val[obj.value];
                temp[item + "-" + obj.value] = val[obj.value];
              } else {
                temp[item + "-" + obj.value] = "";
              }
            });
          });
        });

        uniqueCourses.forEach((item) => {
          let total = 0;
          daysTemp.forEach((obj) => {
            total = total + Number(temp[item + "-" + obj.value]);
          });
          tempTotal[item] = total;
        });
        console.log(tempTotal);

        setDays(daysTemp);
        setCourses(uniqueCourses);
        setData(temp);
        setRowTotal(tempTotal);
      })
      .catch((err) => console.error());
  };

  return (
    <>
      <Box>
        <FormPaperWrapper>
          <Grid container rowSpacing={{ xs: 4, md: 2 }} columnSpacing={4}>
            <Grid item xs={12}>
              <TableContainer component={Paper} elevation={3}>
                <Table size="small" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell rowSpan={2}>Course</StyledTableCell>
                      {days.map((obj, i) => {
                        return (
                          <StyledTableCell key={i}>{obj.value}</StyledTableCell>
                        );
                      })}
                      <StyledTableCell rowSpan={2}>Total</StyledTableCell>
                    </TableRow>

                    <TableRow>
                      {days.map((obj, i) => {
                        return (
                          <StyledTableCell key={i}>{obj.day}</StyledTableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {courses?.map((obj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell
                            style={{ width: "100px", textAlign: "justify" }}
                          >
                            <Typography variant="body2">{obj}</Typography>
                          </TableCell>
                          {days.map((item) => {
                            return (
                              <TableCell
                                style={{
                                  backgroundColor:
                                    data[obj + "-" + item.value] === ""
                                      ? "#BFCCB5"
                                      : "",
                                }}
                              >
                                {data[obj + "-" + item.value]}
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <Typography variant="subtitle2">
                              {rowTotal[obj]}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default FacultyWorkloadDaywise;
