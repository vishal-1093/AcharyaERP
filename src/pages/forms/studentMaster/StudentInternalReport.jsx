import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

const initialValues = { yearSem: null, type: false };

const userName = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userName;

function StudentInternalReport() {
  const [values, setValues] = useState(initialValues);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Internal Marks" }]);
  }, []);

  useEffect(() => {
    getInternalData();
  }, [values.yearSem, values.type]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/student/getStudentDetailsBasedOnAuidAndStrudentId?auid=${userName}`
      );
      const responseData = response.data.data[0];
      if (!responseData) return;
      const {
        id: studentId,
        program_type_name: programTypeName,
        number_of_semester: sems,
        number_of_years: years,
        current_sem: currentSem,
        current_year: currentYear,
      } = responseData;
      let totalYearSem, type;
      const programType = programTypeName?.toLowerCase();
      if (programType === "semester") {
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
        programType,
        studentId,
      }));
      setYearSemOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getInternalData = async () => {
    const { yearSem, type, studentId, programType } = values;
    if (!yearSem) return null;
    try {
      setLoading(true);
      const url = `/api/student/fetchStudentInternalsReportWithFilteredData?student_id=${studentId}`;
      const currentYear =
        programType === "semester" ? Math.round(yearSem / 2) : yearSem;
      const currentSem = programType === "semester" ? yearSem : 0;
      const response = await axios.get(url, {
        params: {
          current_year: currentYear,
          current_sem: currentSem,
        },
      });
      const responseData = response.data.data;
      const key = !type
        ? "internal_name"
        : (item) => `${item.course_name}-${item.course_assignment_coursecode}`;

      const filterData = responseData.reduce((acc, next) => {
        const groupKey = typeof key === "function" ? key(next) : next[key];
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(next);

        return acc;
      }, {});
      setData(filterData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSwitchChange = () => {
    setValues((prev) => ({ ...prev, ["type"]: !values.type }));
  };

  const formatNumber = (value) => {
    let num = Number(value);
    if (isNaN(num)) return "Invalid number";
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  const progressColor = (percentage) =>
    percentage < 40 ? "#ef9a9a" : percentage < 75 ? "warning.main" : "#a5d6a7";

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box m={{ xs: 1, md: 2, lg: 4 }}>
        <FormWrapper>
          <Grid container rowSpacing={2} columnSpacing={4}>
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="yearSem"
                label={values.programType === "semester" ? "Sem" : "Year"}
                value={values.yearSem}
                options={yearSemOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Box
                onClick={() => handleSwitchChange()}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {values.type ? (
                  <ToggleOnIcon
                    sx={{
                      fontSize: 40,
                      color: values.type ? "primary.main" : "#e6e6e6",
                    }}
                  />
                ) : (
                  <ToggleOffIcon
                    sx={{
                      fontSize: 40,
                      color: values.type ? "primary.main" : "#e6e6e6",
                    }}
                  />
                )}
                <Typography variant="subtitle2" color="textSecondary">
                  Coursewise
                </Typography>
              </Box>
            </Grid>

            {Object.keys(data).length > 0 && (
              <Grid item xs={12} mt={2}>
                {Object.keys(data).map((obj, i) => (
                  <Paper
                    elevation={3}
                    key={i}
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      mb: 2,
                      transition: "box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minHeight: "32px", // Reduce height
                          "&.Mui-expanded": { minHeight: "12px" }, // Maintain height when expanded
                          padding: "4px 16px", // Reduce padding
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          component="span"
                        >
                          {obj}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          padding: "8px 16px", // Reduce padding
                        }}
                      >
                        <Grid container rowSpacing={2} justifyContent="center">
                          <Grid item xs={12} md={6} align="center">
                            {data[obj].map((item, j) => (
                              <Paper
                                key={j}
                                elevation={2}
                                sx={{
                                  borderRadius: 2,
                                  borderLeft: 6,
                                  borderColor: "success.main",
                                  padding: 2,
                                  marginBottom: 3,
                                }}
                              >
                                <Box
                                  key={j}
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
                                    {values.type
                                      ? item.internal_name
                                      : `${item.course_name} - ${item.course_assignment_coursecode}`}
                                  </Typography>

                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={2}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {`${formatNumber(
                                        item.marks_obtained_internal
                                      )}/${item.total_marks_internal}`}
                                    </Typography>

                                    <Box width={100}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={item.percentage}
                                        sx={{
                                          height: 10,
                                          borderRadius: 5,
                                          backgroundColor: "#e0e0e0",
                                          "& .MuiLinearProgress-bar": {
                                            backgroundColor: progressColor(
                                              item.percentage
                                            ),
                                          },
                                        }}
                                      />
                                    </Box>
                                    <Typography
                                      variant="subtitle2"
                                      color="textSecondary"
                                    >
                                      {`${item.percentage}%`}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            ))}
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                ))}
              </Grid>
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default StudentInternalReport;
