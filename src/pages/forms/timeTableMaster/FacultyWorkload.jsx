import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
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
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link } from "react-router-dom";
import { convertDateToString } from "../../../utils/DateTimeUtils";

const initialValues = {
  schoolId: "",
  deptId: "",
  fromMonth: null,
  toMonth: null,
};

const requiredFields = ["schoolId", "deptId", "fromMonth", "toMonth"];

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function FacultyWorkload() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isSubmit, setIssubmit] = useState(false);
  const [data, setData] = useState([]);
  const [months, setMonths] = useState([]);
  const [total, setTotal] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    schoolId: [values.schoolId !== ""],
    deptId: [values.deptId !== ""],
    fromMonth: [values.fromMonth !== null],
    toMonth: [values.toMonth !== null],
  };

  const errorMessages = {
    salaryStructureId: ["This field required"],
    salaryHeadId: ["This field required"],
    salaryCategory: ["This field required"],
    remarks: ["This field required"],
  };

  useEffect(() => {
    setCrumbs([{ name: "Faculty Work Load" }]);
    getSchoolOptions();
  }, []);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  const getSchoolOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          setDepartmentOptions(
            res.data.data.map((obj) => ({
              value: obj.dept_id,
              label: obj.dept_name,
            }))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };

  const getMonths = async () => {
    const temp = [];

    let from = new Date(values.fromMonth).getMonth() + 1;
    let to = new Date(values.toMonth).getMonth() + 1;

    for (let i = from; i <= to; i++) {
      temp.push({ label: monthNames[i - 1], value: i });
    }

    const fromDate = convertDateToString(values.fromMonth.$d)
      .split("/")
      .reverse()
      .join("-");

    const toDate = convertDateToString(values.toMonth.$d)
      .split("/")
      .reverse()
      .join("-");

    await axios
      .get(
        `/api/academic/getEmployeeMonthlyWorkedHours/${fromDate}/${toDate}/${values.deptId}`
      )
      .then((res) => {
        const tempTotal = {};

        for (let i = from; i <= to; i++) {
          tempTotal[i] = res.data.data
            .map((obj) => (i in obj === true ? obj[i] : 0))
            .reduce((a, b) => a + b);
        }

        setTotal(tempTotal);
        setData(res.data.data);
      })
      .catch((err) => console.error(err));

    setMonths(temp);
    setIssubmit(true);
  };

  const handleSubmit = () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      getMonths();
    }
  };

  return (
    <>
      <Box mt={2}>
        <FormPaperWrapper>
          <Grid container rowSpacing={{ xs: 4, md: 2 }} columnSpacing={4}>
            {isSubmit ? (
              <Grid item xs={12} align="right">
                <IconButton onClick={() => setIssubmit(!isSubmit)}>
                  <FilterListIcon fontSize="large" color="primary" />
                </IconButton>
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <Grid
                    container
                    rowSpacing={{ xs: 4, md: 2 }}
                    columnSpacing={4}
                  >
                    <Grid item xs={12} md={3}>
                      <CustomAutocomplete
                        name="schoolId"
                        label="School"
                        value={values.schoolId}
                        options={schoolOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.schoolId}
                        errors={errorMessages.schoolId}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <CustomAutocomplete
                        name="deptId"
                        label="Department"
                        value={values.deptId}
                        options={departmentOptions}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.deptId}
                        errors={errorMessages.deptId}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <CustomDatePicker
                        views={["month", "year"]}
                        openTo="month"
                        name="fromMonth"
                        label="From"
                        inputFormat="MM/YYYY"
                        helperText="mm/yyyy"
                        value={values.fromMonth}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.fromMonth}
                        errors={errorMessages.fromMonth}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <CustomDatePicker
                        views={["month", "year"]}
                        openTo="month"
                        name="toMonth"
                        label="To"
                        inputFormat="MM/YYYY"
                        helperText="mm/yyyy"
                        value={values.toMonth}
                        handleChangeAdvance={handleChangeAdvance}
                        checks={checks.toMonth}
                        errors={errorMessages.toMonth}
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    GO
                  </Button>
                </Grid>
              </>
            )}

            {data.length > 0 ? (
              <>
                <Grid item xs={12} align="right">
                  <Typography variant="subtitle2" color="error">
                    * Number count is in hours.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  {data.length > 0 ? (
                    <>
                      <TableContainer component={Paper} elevation={3}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Employee</StyledTableCell>
                              <StyledTableCell>Employment Type</StyledTableCell>
                              {months.map((obj, i) => {
                                return (
                                  <StyledTableCell key={i}>
                                    {obj.label}
                                  </StyledTableCell>
                                );
                              })}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data?.map((obj, i) => {
                              return (
                                <StyledTableRow key={i}>
                                  <TableCell>{obj.employee_name}</TableCell>
                                  <TableCell>{obj.emp_type}</TableCell>
                                  {months.map((item, j) => {
                                    return (
                                      <TableCell key={j}>
                                        {obj[item.value] ? (
                                          <Link
                                            to={`/FacultyMonthwiseWorkLoad/${item.value}`}
                                            style={{ textDecoration: "none" }}
                                            target="_blank"
                                          >
                                            <Typography
                                              variant="subtitle2"
                                              color="primary"
                                            >
                                              {obj[item.value]}
                                            </Typography>
                                          </Link>
                                        ) : (
                                          0
                                        )}
                                      </TableCell>
                                    );
                                  })}
                                </StyledTableRow>
                              );
                            })}
                            <TableRow>
                              <TableCell colSpan={2}>Total</TableCell>
                              {months.map((obj, i) => {
                                return (
                                  <TableCell key={i}>
                                    {total[obj.value]}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  ) : (
                    <></>
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default FacultyWorkload;
