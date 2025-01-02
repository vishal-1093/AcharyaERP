import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  LinearProgress,
  Paper,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

const initialValues = {
  yearSem: null,
};

function StudentAttendanceSummary() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [data, setData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [courseData, setCourseData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getAttedanceData(studentData.id, values.yearSem);
  }, [values.yearSem]);

  const getData = async () => {
    try {
      const { data: response } = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${userName}`
      );
      const responseData = response.data[0];
      if (!responseData) return;
      const {
        id: studentId,
        program_type_name: programType,
        number_of_semester: sems,
        number_of_years: years,
        current_sem: currentSem,
        current_year: currentYear,
      } = responseData;
      let totalYearSem, type;

      if (programType?.toLowerCase() === "semester") {
        totalYearSem = 8;
        type = "Sem";
      } else {
        totalYearSem = 4;
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
      getAttedanceData(studentId, currentYearSem);
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

  const getAttedanceData = async (studentId, currentYearSem) => {
    if (!studentId || !currentYearSem) return null;
    try {
      const [{ data: attResponse }, { data: courseRes }] = await Promise.all([
        axios.get(
          `/api/student/studentAttendanceDetails/${studentId}/${currentYearSem}`
        ),
        axios.get(`/api/student/getPresentAbsentData/${studentId}`),
      ]);
      const attResponseData = attResponse.data;
      const courseResData = courseRes.data;

      const courseObj = {};
      courseResData.forEach((obj) => {
        courseObj[obj.course_id] = obj.details;
      });
      setData(attResponseData);
      setCourseData(courseObj);
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

  const handleAccordionChange = (courseId) => (event, isExpanded) => {
    setExpanded((prev) =>
      isExpanded ? [...prev, courseId] : prev.filter((id) => id !== courseId)
    );
  };

  const progressColor = (percentage) =>
    percentage < 40
      ? "error.main"
      : percentage < 75
      ? "warning.main"
      : "success.main";

  return (
    <Box m={{ xs: 1, md: 2, lg: 4 }}>
      <FormWrapper>
        <Grid container rowSpacing={2}>
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
          {data.length > 0 ? (
            <Grid item xs={12}>
              {data.map((obj, i) => (
                <Paper
                  elevation={3}
                  key={i}
                  sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
                >
                  <Accordion
                    expanded={expanded.includes(obj.course_id)}
                    onChange={handleAccordionChange(obj.course_id)}
                  >
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                        marginRight={1}
                        flexDirection={{ xs: "column", md: "row" }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          component="span"
                        >
                          {`${obj.course_name} - ${obj.course_code}`}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="subtitle2" color="textSecondary">
                            {`${obj.present}/${obj.total}`}
                          </Typography>

                          <Box width={100}>
                            <LinearProgress
                              variant="determinate"
                              value={obj.percentage}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e0e0e0",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: progressColor(
                                    obj.percentage
                                  ),
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="subtitle2" color="textSecondary">
                            {`${obj.percentage}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          width: "100%",
                          maxWidth: "1650px",
                          overflowX: "auto",
                        }}
                      >
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                {courseData[obj.course_id]?.map(
                                  (classHeader, j) => (
                                    <StyledTableCell key={j}>
                                      {j + 1}
                                    </StyledTableCell>
                                  )
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                {courseData[obj.course_id]?.map((ats, k) => (
                                  <StyledTableCellBody key={k}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        color: ats.present_status
                                          ? "success.main"
                                          : "error.main",
                                      }}
                                    >
                                      {ats.present_status ? "P" : "A"}
                                    </Typography>
                                  </StyledTableCellBody>
                                ))}
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              ))}
            </Grid>
          ) : (
            <Grid item xs={12} align="center">
              <Typography
                variant="subtitle2"
                sx={{ color: "error.main", fontSize: 14 }}
              >
                Attendance Not Found !!
              </Typography>
            </Grid>
          )}
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default StudentAttendanceSummary;
