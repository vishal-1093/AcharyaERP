import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
  tableCellClasses,
  tooltipClasses,
} from "@mui/material";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import SearchIcon from "@mui/icons-material/Search";
import ExportButton from "../../../components/ExportButton";
import OverlayLoader from "../../../components/OverlayLoader";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import { useLocation } from "react-router-dom";

const initialValues = {
  month: convertUTCtoTimeZone(new Date()),
  schoolId: null,
  deptId: null,
  searchItem: "",
  isConsultant: "REG",
};
const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;

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
  const { pathname } = useLocation();
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [rows, setRows] = useState([]);
  const [days, setDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterBtnLoading, setFilterBtnLoading] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50); // Adjust the number as needed

  useEffect(() => {
    setCrumbs([{ name: "Attendance Sheet" }]);
    getSchoolDetails();
    handleSubmit("notClick");
    if (pathname.toLowerCase() === "/attendancesheet-inst") {
      setValues((prev) => ({
        ...prev,
        schoolId: schoolID,
      }));
    }
  }, []);

  useEffect(() => {
    getDepartmentOptions();
  }, [values.schoolId]);

  const getSchoolDetails = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
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
              label: obj.dept_name_short,
            });
          });
          setDepartmentOptions(data);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const debouncedSearch = useMemo(
    () =>
      _.debounce((value) => {
        const filteredRows = employeeList.filter((obj) => {
          return Object.values(obj).some((item) =>
            item?.toString().toLowerCase().includes(value.toLowerCase())
          );
        });
        setRows(filteredRows);
        setPage(0);
      }, 500), // 500ms debounce time
    [employeeList] // dependencies
  );

  const handleChangeSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleSubmit = async (type) => {
    const month = moment(values.month).format("MM");
    const year = moment(values.month).format("YYYY");

    const daysTemp = [];
    const getDays = new Date(year, month, 0).getDate();

    for (let i = 1; i <= getDays; i++) {
      daysTemp.push({
        value: i,
        day: dayNames[new Date(year + "-" + month + "-" + i).getDay()],
      });
    }

    const temp = {
      year,
      month,
      school_id: pathname.toLowerCase() === "/attendancesheet-inst" ? schoolID : values.schoolId,
      dept_id: values.deptId,
      empTypeShortName: values.isConsultant,
      sort: "year",
      page: 0,
      page_size: 10000,
    };

    if (type == "click") {
      setFilterBtnLoading(true);
    }
    try {
      setIsLoading(true);
      // Construct the query string based on the `temp` object, including only keys with values.
      const queryParams = Object.keys(temp)
        .filter((key) => temp[key] !== undefined && temp[key] !== null)
        .map((key) => `${key}=${encodeURIComponent(temp[key])}`)
        .join("&");

      // Construct the full URL with the dynamic query string.
      const res = await axios.get(
        `/api/employee/employeeAttendance?${queryParams}`
      );
      setEmployeeList(res.data.data?.Paginated_data.content);
      setRows(res.data.data?.Paginated_data.content);
      setDays(daysTemp);
      setIsLoading(false);
      setFilterBtnLoading(false);
      setPage(0);
    } catch (err) {
      setIsLoading(false);
      setFilterBtnLoading(false);
      setAlertMessage({
        severity: "error",
        message: err.response ? err.response.data.message : "An error occurred",
      });
      setAlertOpen(true);
    }
  };

  function daysTableHead() {
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
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const tableData = useMemo(
    () => (
      <TableContainer component={Paper} elevation={3}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={12 + days.length}
                sx={{
                  backgroundColor: "primary.main",
                  color: "headerWhite.main",
                  textAlign: "center",
                }}
              >
                {values?.isConsultant === "true" ? "Consultant" : ""} Attendance
                Report for the Month of
                {" " + moment(values.month).format("MMMM YYYY")}
              </TableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>Sl No</StyledTableCell>
              <StyledTableCell>Code</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>School</StyledTableCell>
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
              rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((obj, index) => (
                  <TableRow key={index}>
                    <StyledTableCellBody>
                      <Typography variant="subtitle2" color="textSecondary">
                        {page * rowsPerPage + index + 1}
                      </Typography>
                    </StyledTableCellBody>

                    <StyledTableCellBody>
                      <Typography variant="subtitle2" color="textSecondary">
                        {obj.empCode}
                      </Typography>
                    </StyledTableCellBody>

                    <StyledTableCellBody>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {obj.employee_name?.toLowerCase()}
                      </Typography>
                    </StyledTableCellBody>
                    <StyledTableCellBody>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {obj.school_name}
                      </Typography>
                    </StyledTableCellBody>
                    <StyledTableCellBody>
                      <Typography variant="subtitle2" color="textSecondary">
                        {obj.date_of_joining}
                      </Typography>
                    </StyledTableCellBody>

                    <StyledTableCellBody>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {obj.designation?.toLowerCase()}
                      </Typography>
                    </StyledTableCellBody>

                    <StyledTableCellBody>
                      <Typography variant="subtitle2" color="textSecondary">
                        {obj.dept_name}
                      </Typography>
                    </StyledTableCellBody>

                    {days.map((item, j) => (
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
                              ? ""
                              : obj["day" + item.value]}
                          </span>
                        </HtmlTooltip>
                      </StyledTableCellBody>
                    ))}

                    <StyledTableCellBody>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "success.main" }}
                      >
                        {obj.paydays}
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
                ))
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
        <TablePagination
          rowsPerPageOptions={[50, 100, 200]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </TableContainer>
    ),
    [rows, page, rowsPerPage, days]
  );

  return (
    <>
      <Box>
        <Grid mt={2} mb={2} container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} md={1}>
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

          {pathname.toLowerCase() !== "/attendancesheet-inst" && <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>}

          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="deptId"
              label="Department"
              value={values.deptId}
              options={departmentOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="isConsultant"
              label="Employee Type"
              value={values.isConsultant}
              options={[
                { value: "REG", label: "Regular" },
                { value: "CON", label: "Consultant" },
              ]}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              onClick={() => handleSubmit("click")}
              disabled={
                filterBtnLoading ||
                values.month === null ||
                values.month === "Invalid Date"
              }
            >
              {filterBtnLoading ? (
                <CircularProgress size={25} color="blue" />
              ) : (
                "Submit"
              )}
            </Button>
          </Grid>
          {pathname.toLowerCase() === "/attendancesheet-inst" && <Grid item xs={12} md={2}>
          </Grid>}
          <Grid item xs={12} md={2} align="right">
            <ExportButton rows={rows} name={values} />
          </Grid>
          <Grid item xs={12} md={2} align="right">
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

        <Grid container>
          {isLoading ? (
            <Grid item xs={12} md={10} align="center">
              <OverlayLoader />
            </Grid>
          ) : (
            <>{tableData}</>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default EmpAttendanceFilterForm;
