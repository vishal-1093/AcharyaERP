import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  styled,
  tableCellClasses,
  Paper,
} from "@mui/material";
import axios from "../../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: "6px",
    textAlign: "center",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

function TimeTableViewForCourse() {
  const [academicYearOptions, setAcademicYearOptions] = useState(null);
  const [schoolOptions, setSchoolOptions] = useState(null);
  const [programSpeOptions, setProgramSpeOptions] = useState(null);
  const [programOptions, setProgramOptions] = useState(null);
  const [sectionOptions, setSectionOptions] = useState(null);
  const [courseData, setCourseData] = useState([]);

  const classes = useStyles();
  const { acYearId } = useParams();
  const { schoolId } = useParams();
  const { programSpeId } = useParams();
  const { programId } = useParams();
  const { yearsemId } = useParams();
  const { sectionId } = useParams();
  const { date } = useParams();
  const { courseId } = useParams();
  const { programType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getAcademicyear();
    getSchool();
    getTimeTableDetails();
    getSectionData();
  }, []);

  useEffect(() => {
    getProgramSpeData();
  }, [schoolId]);

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.ac_year_id === Number(acYearId)) {
            setAcademicYearOptions(obj.ac_year);
          }
        });
      })
      .catch((error) => console.error(error));
  };

  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        res.data.data
          .filter((val) => val.school_id === Number(schoolId))
          .map((obj) => setSchoolOptions(obj.school_name_short));
      })
      .catch((error) => console.error(error));
  };

  const getProgramSpeData = async () => {
    if (schoolId)
      await axios
        .get(`/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`)
        .then((res) => {
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === Number(programSpeId)) {
              setProgramOptions(obj.program_short_name);
              setProgramSpeOptions(obj.program_specialization_short_name);
            }
          });
        })
        .catch((err) => console.error(err));
  };

  const getTimeTableDetails = async () => {
    if (Number(programType) === 1) {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_year=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const temp = [];
          res.data.data.filter((obj) => {
            if (obj.course_id === Number(courseId) && obj.start === date) {
              temp.push(obj);
            }
          });
          setCourseData(temp);
        })
        .catch((err) => console.error(err));
    } else {
      await axios
        .get(
          `/api/academic/coursesAssignedDetailsForTimeTableView?ac_year_id=${acYearId}&school_id=${schoolId}&program_id=${programId}&program_specialization_id=${programSpeId}&section_id=${sectionId}&current_sem=${yearsemId}&selected_date=${date}`
        )
        .then((res) => {
          const temp = [];
          res.data.data.filter((obj) => {
            if (obj.course_id === courseId && obj.start === date) {
              temp.push(obj);
            }
          });
          setCourseData(temp);
        })
        .catch((err) => console.error(err));
    }
  };

  const getSectionData = async () => {
    await axios
      .get(`/api/academic/Section`)
      .then((res) => {
        res.data.data.filter((obj) => {
          if (obj.section_id === Number(sectionId)) {
            setSectionOptions(obj.section_name);
          }
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormPaperWrapper>
        <Grid container rowSpacing={2.5} columnSpacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle2" className={classes.bg}>
              Time Table For Faculty
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2}>
              <Grid
                container
                alignItems="center"
                rowSpacing={1.5}
                pl={2}
                pr={2}
                pb={2}
              >
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Ac Year</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {academicYearOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">School</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {schoolOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Program</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {programOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Specialization</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {programSpeOptions}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Year/Sem</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {yearsemId}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2">Section</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="textSecondary">
                    {sectionOptions}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end">
          <Grid item xs={12} md={12} mt={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Faculty</StyledTableCell>
                    <StyledTableCell>EmpCode</StyledTableCell>
                    <StyledTableCell>Code</StyledTableCell>
                    <StyledTableCell>Course</StyledTableCell>
                    <StyledTableCell>Week Day</StyledTableCell>
                    <StyledTableCell>Time Slot</StyledTableCell>
                    <StyledTableCell>Room Code</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseData.length > 0
                    ? courseData.map((obj, i) => {
                        return (
                          <TableRow key={i}>
                            <StyledTableCell>
                              {obj.start
                                ? obj.start
                                    .slice(0, 10)
                                    .split("-")
                                    .reverse()
                                    .join("-")
                                : ""}
                            </StyledTableCell>
                            <StyledTableCell>
                              {obj.employee_name}
                            </StyledTableCell>
                            <StyledTableCell>{obj.empcode}</StyledTableCell>
                            <StyledTableCell>{obj.course_code}</StyledTableCell>
                            <StyledTableCell>{obj.course_name}</StyledTableCell>
                            <StyledTableCell>{obj.week_day}</StyledTableCell>
                            <StyledTableCell>{obj.time}</StyledTableCell>
                            <StyledTableCell>{obj.roomcode}</StyledTableCell>
                          </TableRow>
                        );
                      })
                    : ""}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} textAlign="right" mt={2}>
            <Button
              variant="contained"
              sx={{ borderRadius: 2 }}
              onClick={() =>
                navigate(
                  `/TimeTableFacultyViewPDF/${acYearId}/${schoolId}/${programId}/${programSpeId}/${yearsemId}/${sectionId}/${date}/${courseId}/${programType}`
                )
              }
            >
              PRINT
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default TimeTableViewForCourse;
