import { lazy, useEffect, useRef, useState } from "react";
import axios from "../../../services/Api";
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
  TextField,
  Tooltip,
  Typography,
  tableCellClasses,
  tooltipClasses,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/system";
import moment from "moment";
import { useDownloadExcel } from "react-export-table-to-excel";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import SearchIcon from "@mui/icons-material/Search";
const FormPaperWrapper = lazy(() =>
  import("../../../components/FormPaperWrapper")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const OverlayLoader = lazy(() => import("../../../components/OverlayLoader"));

const initialValues = {
  month: convertUTCtoTimeZone(new Date()),
  schoolId: null,
  deptId: null,
  searchItem: "",
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    textAlign: "center",
    padding: 2,
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
    padding: 3,
    border: "1px solid rgba(224, 224, 224, 1)",
    "&:nth-of-type(3)": {
      textAlign: "left",
    },
    "&:nth-of-type(4)": {
      width: "7%",
    },
    "&:nth-of-type(5)": {
      textAlign: "left",
    },
    "&:nth-of-type(6)": {
      textAlign: "left",
    },
  },
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "center",
  },
}));

const dayLable = {
  A: "Absent",
  P: "Present",
  N: "New Joinee",
  R: "Relieved",
  L: "Leave",
  MA: "Manual Attendance",
  WO: "Week Off",
  DH: "Declared Holiday",
  GH: "General Holiday",
  OD: "Official On Duty",
  AL: "Absent Leave",
};

function EmpAttendanceFilterForm() {
  const [values, setValues] = useState(initialValues);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [days, setDays] = useState([]);
  const [rows, setRows] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workingDays, setWorkingDays] = useState();
  const [schoolOptions, setSchoolOptions] = useState([]);

  const tableRef = useRef(null);

  useEffect(() => {
    getSchoolDetails();
    handleSubmit();
  }, []);

  useEffect(() => {
    if (isSubmit === true) {
      tableData();
    }
  }, [isSubmit]);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentOptions = async () => {
    if (values.schoolId) {
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.dept_id,
              label: obj.dept_name,
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSubmit = async () => {
    const getMonthYear = values.month.slice(0, 7).split("-");
    const month = parseInt(getMonthYear[1]);
    const year = parseInt(getMonthYear[0]);
    const temp = {};
    temp.year = year;
    temp.month = month;
    temp.school_id = values.schoolId;
    temp.dept_id = values.deptId;

    setIsLoading(true);
    await axios
      .post(`/api/employee/employeeAttendance`, temp)
      .then((res) => {
        setEmployeeList(res.data.data);
        setRows(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));

    await axios
      .post(`/api/employee/getWorkingDays?month=${month}&year=${year}`)
      .then((res) => {
        setWorkingDays(res.data.data);
      })
      .catch((err) => console.error(err));

    const daysTemp = [];
    const getDays = new Date(
      parseInt(getMonthYear[0]),
      parseInt(getMonthYear[1]),
      0
    ).getDate();

    for (let i = 1; i <= getDays; i++) {
      daysTemp.push({
        label: "a",
        value: i,
        day: dayNames[
          new Date(
            parseInt(getMonthYear[0]) +
              "-" +
              parseInt(getMonthYear[1]) +
              "-" +
              i
          ).getDay()
        ],
      });
    }

    setDays(daysTemp);
    setIsSubmit(true);
  };

  const daysTableHead = () => {
    return days.map((obj, i) => {
      let value = "";
      if (obj.value.toString().length === 1) {
        value = (
          <StyledTableCell key={i}>&nbsp;{obj.value}&nbsp;</StyledTableCell>
        );
      } else {
        value = <StyledTableCell key={i}>{obj.value}</StyledTableCell>;
      }
      return value;
    });
  };

  const tableData = () => (
    <TableContainer component={Paper} elevation={3} sx={{ maxWidth: 1300 }}>
      <Table size="small" ref={tableRef}>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={11 + days.length}
              sx={{
                backgroundColor: "primary.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              Attendance Report
              {" - " + moment(values.month).format("MMMM YYYY")}
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Sl No</StyledTableCell>
            <StyledTableCell>Code</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>DOJ</StyledTableCell>
            <StyledTableCell>Designation</StyledTableCell>
            <StyledTableCell>Department</StyledTableCell>
            {daysTableHead()}
            <StyledTableCell>Pay D</StyledTableCell>
            <StyledTableCell>Prs D</StyledTableCell>
            <StyledTableCell>GH/WO</StyledTableCell>
            <StyledTableCell>LVS</StyledTableCell>
            <StyledTableCell>Ab</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((obj, i) => {
              return (
                <TableRow key={i}>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {i + 1}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.empCode}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.employee_name}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj?.date_of_joining
                        .substr(0, 10)
                        ?.split("-")
                        ?.reverse()
                        ?.join("-")}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.designation}
                    </Typography>
                  </StyledTableCellBody>

                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.branch}
                    </Typography>
                  </StyledTableCellBody>

                  {days.map((item, j) => {
                    return (
                      <StyledTableCellBody key={j}>
                        <HtmlTooltip
                          title={
                            <Box>
                              <Typography>
                                {dayLable?.[obj?.["day" + item.value]]}
                              </Typography>
                            </Box>
                          }
                        >
                          <span>
                            {obj["day" + item.value] === null
                              ? 0
                              : obj["day" + item.value]}
                          </span>
                        </HtmlTooltip>
                      </StyledTableCellBody>
                    );
                  })}

                  <StyledTableCellBody>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "success.main" }}
                    >
                      {obj.payday}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.presentday}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.generalWo}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.leaveTaken}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj.absentday}
                    </Typography>
                  </StyledTableCellBody>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={10 + days.length}
                sx={{ textAlign: "center" }}
              >
                <Typography variant="subtitle2">No Records</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "File",
    sheet: "File",
  });

  const handleChangeSearch = (e) => {
    const filteredRows = employeeList.filter((obj) => {
      const chk = [];
      Object.values(obj).forEach((item) => {
        if (item !== null) {
          chk.push(
            item.toString().toLowerCase().includes(e.target.value.toLowerCase())
          );
        } else {
          chk.push("");
        }
      });

      if (chk.includes(true) === true) {
        return obj;
      }
    });

    setRows(filteredRows);
  };

  return (
    <Box>
      <Grid container rowSpacing={4}>
        {isSubmit ? (
          <>
            <Grid item xs={12} align="right">
              <IconButton
                onClick={() => setIsSubmit(false)}
                sx={{ padding: 0 }}
              >
                <FilterListIcon
                  fontSize="large"
                  sx={{ color: "primary.main" }}
                />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={12} md={3}>
                  <TextField
                    name="searchItem"
                    values={values.searchItem}
                    onChange={handleChangeSearch}
                    size="small"
                    fullWidth
                    InputProps={{
                      endAdornment: <SearchIcon />,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} align="right">
              <Typography display="inline">Working days :&nbsp;</Typography>
              <Typography variant="subtitle2" display="inline">
                {workingDays}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {tableData()}
            </Grid>
          </>
        ) : isLoading ? (
          <Grid item xs={12} align="center">
            <OverlayLoader />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <FormPaperWrapper>
              <Grid container columnSpacing={4}>
                <Grid item xs={12} md={4}>
                  <CustomDatePicker
                    name="month"
                    label="Month"
                    value={values.month}
                    handleChangeAdvance={handleChangeAdvance}
                    views={["month", "year"]}
                    openTo="month"
                    inputFormat="MM/YYYY"
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="schoolId"
                    label="School"
                    value={values.schoolId}
                    options={schoolOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="deptId"
                    label="Department"
                    value={values.deptId}
                    options={departmentOptions}
                    handleChangeAdvance={handleChangeAdvance}
                  />
                </Grid>

                <Grid item xs={12} align="right">
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                      values.month === null || values.month === "Invalid Date"
                    }
                  >
                    GO
                  </Button>
                </Grid>
              </Grid>
            </FormPaperWrapper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default EmpAttendanceFilterForm;
