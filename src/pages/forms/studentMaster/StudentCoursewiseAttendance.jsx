import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import FormPaperWrapper from "../../../components/FormPaperWrapper";

const initialValues = {
  yearSem: null,
  courseId: null,
};

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
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
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseData, setCourseData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getCourses();
  }, [values.yearSem]);

  useEffect(() => {
    getCourseData();
  }, [values.courseId]);

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${userName}`
      );
      const responseData = response.data[0];
      if (!responseData) return;
      const {
        program_type_name: programType,
        number_of_semester: sems,
        number_of_years: years,
        current_sem: currentSem,
        current_year: currentYear,
      } = responseData;
      let totalYearSem, type;

      if (programType?.toLowerCase() === "semester") {
        totalYearSem = sems;
        type = "Sem";
      } else {
        totalYearSem = years;
        type = "Year";
      }
      const currentYearSem = type === "Sem" ? currentSem : currentYear;
      const optionData = [];
      for (let i = 1; i <= totalYearSem; i++) {
        optionData.push({
          value: i,
          label: `${type} ${i}`,
        });
      }
      setValues((prev) => ({
        ...prev,
        ["yearSem"]: currentYearSem,
      }));
      setYearSemOptions(optionData);
      setStudentData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    }
  };

  const getCourses = async () => {
    const { yearSem } = values;
    if (!yearSem) return null;
    try {
      const { data: response } = await axios.get(
        `/api/student/getAttendanceReportForStudentProfileByStudentId/${studentData.id}/${yearSem}`
      );
      const optionData = [];
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.course_id,
          label: `${obj.course_name} - ${obj.course_assignment_coursecode}`,
        });
      });
      setCourseOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    }
  };

  const getCourseData = async () => {
    const { courseId } = values;
    if (!courseId) return;
    try {
      const { data: courseRes } = await axios.get(
        `/api/student/getAttendanceData/${studentData.id}/${courseId}/${values.yearSem}`
      );
      const courseResData = courseRes.data;
      setCourseData(courseResData.attendanceDetails);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <Box m={{ xs: 1, md: 2, lg: 4 }}>
      <FormPaperWrapper>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="yearSem"
              label={studentData.program_type_code}
              value={values.yearSem}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} align="center">
            {courseData.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Sl No.</StyledTableCell>
                      {/* <StyledTableCell>Faculty</StyledTableCell> */}
                      <StyledTableCell>Topic Taught</StyledTableCell>
                      <StyledTableCell>Teaching Aid</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell>Learning Style</StyledTableCell>
                      <StyledTableCell>Teaching Mode</StyledTableCell>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Attendance Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courseData.map((obj, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCellBody>{i + 1}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {obj.topic_name}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {obj.concatenated_content_teachingaid}
                        </StyledTableCellBody>
                        <StyledTableCellBody>{obj.type}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {obj.learning_style}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {obj.teaching_mode}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {obj.date_and_time_of_class}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {obj.present_status === true
                            ? "P"
                            : obj.present_status === false
                            ? "A"
                            : ""}
                        </StyledTableCellBody>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                variant="subtitle2"
                sx={{ color: "error.main", fontSize: 14 }}
              >
                Attendance Not Found !!
              </Typography>
            )}
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default StudentCoursewiseAttendance;
