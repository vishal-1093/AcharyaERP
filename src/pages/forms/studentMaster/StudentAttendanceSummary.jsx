import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
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
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import FormWrapper from "../../../components/FormWrapper";

const StudentCoursewiseAttendance = lazy(() =>
  import("./StudentCoursewiseAttendance")
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.tableBg.main,
    color: theme.palette.tableBg.textColor,
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

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

const initialValues = {
  yearSem: null,
};

const at = [
  { label: 1, value: "P" },
  { label: 2, value: "P" },
  { label: 3, value: "P" },
  { label: 4, value: "P" },
  { label: 5, value: "P" },
  { label: 6, value: "P" },
  { label: 7, value: "P" },
  { label: 8, value: "P" },
  { label: 9, value: "P" },
  { label: 10, value: "P" },
  { label: 11, value: "P" },
  { label: 12, value: "P" },
  { label: 13, value: "P" },
  { label: 14, value: "P" },
  { label: 15, value: "P" },
  { label: 16, value: "P" },
  { label: 17, value: "P" },
  { label: 18, value: "P" },
  { label: 19, value: "P" },
  { label: 20, value: "P" },
  { label: 21, value: "P" },
  { label: 22, value: "P" },
  { label: 23, value: "P" },
  { label: 24, value: "P" },
  { label: 25, value: "P" },
  { label: 26, value: "P" },
  { label: 27, value: "P" },
  { label: 28, value: "P" },
  { label: 29, value: "P" },
  { label: 30, value: "P" },
  { label: 31, value: "P" },
  { label: 32, value: "P" },
  { label: 33, value: "P" },
  { label: 34, value: "P" },
  { label: 35, value: "P" },
  { label: 36, value: "P" },
  { label: 37, value: "P" },
  { label: 38, value: "P" },
  { label: 39, value: "P" },
  { label: 40, value: "P" },
  { label: 41, value: "P" },
  { label: 42, value: "P" },
  { label: 43, value: "P" },
  { label: 44, value: "P" },
  { label: 45, value: "P" },
  { label: 46, value: "P" },
  { label: 47, value: "P" },
  { label: 48, value: "P" },
  { label: 49, value: "P" },
  { label: 50, value: "P" },
  { label: 51, value: "P" },
  { label: 52, value: "P" },
  { label: 53, value: "P" },
  { label: 54, value: "P" },
  { label: 55, value: "P" },
  { label: 56, value: "P" },
  { label: 57, value: "P" },
  { label: 58, value: "P" },
  { label: 59, value: "P" },
  { label: 60, value: "P" },
  { label: 61, value: "P" },
  { label: 62, value: "P" },
  { label: 63, value: "P" },
  { label: 64, value: "P" },
  { label: 65, value: "P" },
  { label: 66, value: "P" },
  { label: 67, value: "P" },
  { label: 68, value: "P" },
  { label: 69, value: "P" },
  { label: 70, value: "P" },
  { label: 71, value: "P" },
  { label: 72, value: "P" },
  { label: 73, value: "P" },
  { label: 74, value: "P" },
  { label: 75, value: "P" },
  { label: 76, value: "P" },
  { label: 77, value: "P" },
  { label: 78, value: "P" },
  { label: 79, value: "P" },
  { label: 80, value: "P" },
];
function StudentAttendanceSummary() {
  const [values, setValues] = useState(initialValues);
  const [studentData, setStudentData] = useState([]);
  const [data, setData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getAttedanceData(studentData.id, values.yearSem);
  }, [values.yearSem]);

  const getData = async () => {
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
  };

  // const getData = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       `/api/student/studentAttendanceDetails?auid=${auid}`
  //     );

  //     const responseData = response.data.data?.[0];
  //     if (responseData.candidate_id) {
  //       const registrationResponse = axios.get(
  //         `/api/student/findAllDetailsPreAdmission1/${responseData.candidate_id}`
  //       );
  //       const registrationResponseData = registrationResponse.data.data[0];
  //       setRegistrationData(registrationResponseData);
  //     }
  //     setData(response.data.data[0]);
  //   } catch (err) {
  //     setAlertMessage({
  //       severity: "error",
  //       message: err.response?.data?.message || "An error occured",
  //     });
  //     setAlertOpen(true);
  //     navigate("/dashboard");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getAttedanceData = async (studentId, currentYearSem) => {
    const { data: attResponse } = await axios.get(
      `/api/student/studentAttendanceDetails/${studentId}/${currentYearSem}`
    );
    const attResponseData = attResponse.data;
    console.log("attResponse", attResponseData);
    setData(attResponseData);
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const ProgressWithLabel = ({ value }) => {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={value} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            value
          )}%`}</Typography>
        </Box>
      </Box>
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
          {data.length > 0 && (
            <>
              {/* <Grid item xs={12}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Couse</StyledTableCell>
                        <StyledTableCell>Total Class</StyledTableCell>
                        <StyledTableCell>Present Class</StyledTableCell>
                        <StyledTableCell>Percentage (%)</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((obj, i) => (
                        <StyledTableRow key={i}>
                          <StyledTableCellBody>{`${obj.course_name} - ${obj.course_code}`}</StyledTableCellBody>
                          <StyledTableCellBody>{obj.total}</StyledTableCellBody>
                          <StyledTableCellBody>
                            {obj.present}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {obj.percentage}
                          </StyledTableCellBody>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid> */}

              <Grid item xs={12}>
                {data.map((obj, i) => (
                  <Paper
                    elevation={3}
                    sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}
                  >
                    <Accordion key={i}>
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                          marginRight={1}
                        >
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            component="span"
                          >
                            {`${obj.course_name} - ${obj.course_code}`}
                          </Typography>

                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
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
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              {`${obj.percentage}%`}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>

                      {/* <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                          alignItems="center"
                        >
                          <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            component="span"
                          >
                            {`${obj.course_name} - ${obj.course_code}`}
                          </Typography>

                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                            >
                              {`${obj.present}/${obj.total}`}
                            </Typography>
                            <Box position="relative" display="inline-flex">
                              <CircularProgress
                                variant="determinate"
                                value={obj.percentage}
                                size={30}
                                thickness={3}
                                sx={{
                                  color: progressColor(obj.percentage),
                                }}
                              />
                              <Box
                                position="absolute"
                                top={0}
                                left={0}
                                bottom={0}
                                right={0}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  sx={{ fontSize: 9 }}
                                >
                                  {`${obj.percentage}%`}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </AccordionSummary> */}
                      <AccordionDetails>
                        {/* <StudentCoursewiseAttendance /> */}
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
                                  {at.map((obj) => (
                                    <StyledTableCell>
                                      {obj.label}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  {at.map((obj) => (
                                    <StyledTableCell>
                                      {obj.value}
                                    </StyledTableCell>
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
            </>
          )}
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default StudentAttendanceSummary;
