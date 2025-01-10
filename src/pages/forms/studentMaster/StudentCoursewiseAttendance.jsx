import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Backdrop,
  Box,
  CircularProgress,
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
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import moment from "moment";

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
  const [loading, setLoading] = useState(false);

  let count = 0;

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getCourses = async () => {
    const { yearSem } = values;
    if (!yearSem) return null;
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getCourseData = async () => {
    const { courseId } = values;
    if (!courseId) return;
    try {
      setLoading(true);
      const { data: courseRes } = await axios.get(
        `/api/student/getAttendanceData/${studentData.id}/${courseId}/${values.yearSem}`
      );
      let courseResData = courseRes.data.attendanceDetails;
      courseResData.sort((a, b) => {
        const dateA = new Date(
          a.date_and_time_of_class.split("  ")[0] +
            " " +
            a.time_slot.split("-")[0]
        );
        const dateB = new Date(
          b.date_and_time_of_class.split("  ")[0] +
            " " +
            b.time_slot.split("-")[0]
        );
        return dateA - dateB;
      });
      if (courseResData.length === 0) {
        setAlertMessage({
          severity: "error",
          message: "No attendance records found for the selected course !!",
        });
        setAlertOpen(true);
        return;
      }
      setCourseData(courseResData);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const attendanceStatus = (presentStatus, count) => (
    <Typography
      variant="subtitle2"
      sx={{
        color:
          presentStatus === true
            ? "success.main"
            : presentStatus === false
            ? "error.main"
            : "transparent",
      }}
    >
      {presentStatus === true
        ? `P - ${count}`
        : presentStatus === false
        ? `A - ${count}`
        : ""}
    </Typography>
  );

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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

            <Grid item xs={12} align="center" mt={2}>
              {courseData.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {/* <StyledTableCell>Sl No.</StyledTableCell> */}
                        {/* <StyledTableCell>Faculty</StyledTableCell> */}
                        <StyledTableCell sx={{ width: "6%" }}>
                          Date
                        </StyledTableCell>
                        <StyledTableCell sx={{ width: "10%" }}>
                          Time
                        </StyledTableCell>
                        <StyledTableCell>Attendance</StyledTableCell>
                        <StyledTableCell>Topic Taught</StyledTableCell>
                        <StyledTableCell>Teaching Aid</StyledTableCell>
                        <StyledTableCell>Type</StyledTableCell>
                        <StyledTableCell>Learning Style</StyledTableCell>
                        <StyledTableCell>Teaching Mode</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {courseData.map((obj, i) => {
                        if (obj.present_status) {
                          count = count + 1;
                        }
                        return (
                          <StyledTableRow key={i}>
                            {/* <StyledTableCellBody>{i + 1}</StyledTableCellBody> */}
                            <StyledTableCellBody>
                              {moment(obj.date_of_class).format("DD-MM-YYYY")}
                            </StyledTableCellBody>
                            <StyledTableCellBody sx={{ textAlign: "justify" }}>
                              {obj.time_slot}
                            </StyledTableCellBody>
                            <StyledTableCellBody sx={{ textAlign: "center" }}>
                              {attendanceStatus(obj.present_status, count)}
                            </StyledTableCellBody>
                            <StyledTableCellBody sx={{ textAlign: "justify" }}>
                              {obj.topic_name}
                            </StyledTableCellBody>
                            <StyledTableCellBody sx={{ textAlign: "justify" }}>
                              {obj.concatenated_content_teachingaid}
                            </StyledTableCellBody>
                            <StyledTableCellBody>
                              {obj.type}
                            </StyledTableCellBody>
                            <StyledTableCellBody>
                              {obj.learning_style}
                            </StyledTableCellBody>
                            <StyledTableCellBody sx={{ textAlign: "center" }}>
                              {obj.teaching_mode}
                            </StyledTableCellBody>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default StudentCoursewiseAttendance;
