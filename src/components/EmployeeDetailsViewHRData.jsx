import React, { useRef } from "react";
import { useState, useEffect } from "react";
import SalaryBreakupView from "./SalaryBreakupView";
import { useNavigate } from "react-router-dom";
import { checkFullAccess, convertToDMY } from "../utils/DateTimeUtils";
import axios from "../services/Api";
import CustomDatePicker from "../components/Inputs/CustomDatePicker";
import { convertUTCtoTimeZone } from "../utils/DateTimeUtils";
import { styled } from "@mui/system";
import OverlayLoader from "../components/OverlayLoader";
import { Link } from 'react-router-dom';

import {
  Alert,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  tableCellClasses,
  tooltipClasses,
  Snackbar,
} from "@mui/material";
import { convertDateFormat, formatTime } from "../utils/Utils";
import FormWrapper from "./FormWrapper";
const initialValues = {
  fromDate:convertUTCtoTimeZone(new Date()),
  month: convertUTCtoTimeZone(new Date()),
  toDate:convertUTCtoTimeZone(new Date()),
  schoolId: 1,
  deptId: null,
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
  "&.payDCell": {
    color: "red",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
    //width:"2%",
    // padding: 10,
    border: "1px solid rgba(224, 224, 224, 1)",
    "&:nth-of-type(3)": {
      textAlign: "left",
    },
    "&:nth-of-type(4)": {
      // width: "7%",
    },
    "&:nth-of-type(5)": {
      textAlign: "left",
    },
    "&:nth-of-type(6)": {
      textAlign: "left",
    },
  },
}));

const StyledTableCellBody1 = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
    //width:"2%",
    padding: 7,
    border: "1px solid rgba(224, 224, 224, 1)",
    "&:nth-of-type(3)": {
      textAlign: "left",
    },
    "&:nth-of-type(4)": {
      //width: "7%",
    },
    "&:nth-of-type(5)": {
      textAlign: "left",
    },
    "&:nth-of-type(6)": {
      textAlign: "left",
    },
  },
}));

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    flexDirection: "column",
  },
});

const CustomTab = styled(Tab)(({ theme }) => ({
  fontSize: "14px",
  transition: "background-color 0.3s",
  backgroundColor: "rgba(74, 87, 169, 0.1)",
  color: "#46464E",
  "&.Mui-selected": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
    color: "orange",
  },
  "&:hover": {
    backgroundColor: "rgba(74, 87, 169, 0.2)",
  },
  [theme.breakpoints.up("xs")]: {
    fontSize: "11px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "14px",
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
    textAlign: "justify",
  },
}));

const dayLable = {
  A: "Absent",
  P: "Present",
  N: "New Joinee",
  R: "Relived",
  L: "Leave",
  MA: "Manual Attendance",
  WO: "Week Off",
  DH: "Declared Holiday",
};
const EmployeeDetailsViewHRData = ({ empId, offerId }) => {
  const navigate = useNavigate();
  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
    // setIsEditing(false);
  };
  const today = new Date();
  const selectedMonthYear_ = convertUTCtoTimeZone(
    new Date(today.getFullYear(), today.getMonth())
  );
  const [subTab, setSubTab] = useState("Employment");
  const [jobDetails, setJobDetails] = useState([]);
  const [data, setData] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [employeeList, setEmployeeList] = useState([]);
  const [bioMetricList, seBioMetricList] = useState([]);
  const [calenderYearList, setCalenderYearListList] = useState([]);
  const [leaveTypeList, setLeaveTypeList] = useState([]);
  const [leaveIdList, setLeaveIdList] = useState([]);

  const [leaveData, setLeavesData] = useState([ {
    "year": 2018,
    "Declared Holiday": 1,
    "CL/SL":10,
    "Manual Attendance": 1,
    "OnDuty":0,
    "Seminar Leave":20,
   "Manual Attendace":5,
   "Restricted Leave":12,
},{
  "year": 2019,
  "Declared Holiday": 4,
  "CL/SL":8,
  "Manual Attendance": 1,
  "OnDuty":2,
  "Seminar Leave":0,
 "Manual Attendace":5,
 "Restricted Leave":10,
},

{
  "year": 2020,
  "Declared Holiday": 1,
  "CL/SL":10,
  "Manual Attendance": 1,
  "OnDuty":2,
  "Seminar Leave":20,
 "Manual Attendace":5,
 "Restricted Leave":12,
},
]);
  const [days, setDays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef(null);
  const [selectedMonthYear, setSelectedMonthYear] =
    useState(selectedMonthYear_);
  const [userId, setUserId] = useState(null);
  const [offerIds, setOfferIds] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState();
  const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
  const [popupObj, setPopupObj] = React.useState({
    showMessage: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, showMessage } = popupObj;

  useEffect(() => {
    getData();
    handleSubmit();
    handlePunch();
    getLevesType();
    getLevesYear();
    getLevesTypeId();
  }, []);

  useEffect(() => {
    if(userId)
    getLevesTypeId(userId);
  }, [userId]);

  const getData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${empId}`)
      .then((res) => {
        setUserId(res.data.data[0].user_id);
        setOfferIds(res.data.data[0].offer_id);
        axios
          .get(
            `/api/employee/getAllApplicantDetails/${res.data.data[0].job_id}`
          )
          .then((res) => {
            setJobDetails(res.data);
          })
          .catch((err) => console.error(err));
        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getLevesData = async () => {
    await axios
      .get(`/api/getLeaveKettyDetails/${empId}`)
      .then((res) => {
        setUserId(res.data.data[0].user_id);
        setOfferIds(res.data.data[0].offer_id)
        setEmployeeDetails(res.data.data[0])
        axios
          .get(
            `/api/employee/getAllApplicantDetails/${res.data.data[0].job_id}`
          )
          .then((res) => {
            setJobDetails(res.data);
          })
          .catch((err) => console.error(err));
        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  // const getLevesData = async () => {
  //   await axios
  //     .get(`/api/getLeaveKettyDetails/${empId}`)
  //     .then((res) => {
       
  //      //setLeavesData(res.data.data);
  //     })
  //     .catch((err) => console.error(err));
  // };

  const getLevesType = async () => {
    await axios
      .get(`/api/LeaveType`)
      .then((res) => {
       
        setLeaveTypeList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getLevesYear = async () => {
    await axios
      .get(`/api/CalenderYear/`)
      .then((res) => {
       
        setCalenderYearListList(res.data.data);
      })
      .catch((err) => console.error(err));
  };

  const getLevesTypeId = async (userId) => {
    await axios
      .get(`/api/getLeaveKettyDetails/${userId}`)
      .then((res) => {
       
        setLeaveIdList(res.data.data);
      })
      .catch((err) => console.error(err));
  };


  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
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

  const handleSubmit = async () => {
    const fromDate = values.fromDate.slice(0, 7);
    const toDate =values.toDate.slice(0, 7);
    const getMonthYear =values.month.slice(0, 7);
    const temp = {};
    temp.year = parseInt(getMonthYear[0]);
    temp.month = parseInt(getMonthYear[1]);
    temp.school_id = empId;
    temp.dept_id = values.deptId;

    setIsLoading(true);
    await axios
      .get(
        `/api/employee/getAttendanceOfEmployeeByEmployeeId/${temp.school_id}/${fromDate}/${toDate}`
      )
      .then((res) => {
        setEmployeeList(res.data.data);
        setIsLoading(false);
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
    // setIsSubmit(true);
  };
  const handlePunch = async () => {
    const getMonthYear = values.month.slice(0, 7).split("-");
    const temp = {};
    temp.year = parseInt(getMonthYear[0]);
    temp.month = parseInt(getMonthYear[1]);
    temp.school_id = empId;
    temp.dept_id = values.deptId;
    //.get(`/api/employee/getBiometricAttendance/${temp.school_id}/${temp.month}/${temp.year}`)
    setIsLoading(true);
    await axios
      .get(
        `/api/employee/getBiometricAttendanceByEmp_id/${temp.month}/${temp.year}/${temp.school_id}`
      )
      .then((res) => {
        seBioMetricList(res.data.data);
        setIsLoading(false);
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
    // setIsSubmit(true);
  };
  const tableData = () => (
    <TableContainer elevation={3} sx={{ maxWidth: 1300 }}>
      <Table size="small" ref={tableRef}>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={10 + days.length}
              sx={{
                backgroundColor: "auzColor.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              Attendance Report
              {" - " +
                " " +
                (employeeDetails?.employee_name ? "For " + employeeDetails?.employee_name : "")}
              
            </TableCell>
          </TableRow>
          <TableRow>
          <StyledTableCell>MM/YYYY</StyledTableCell>
          
            {/* <StyledTableCell>AB</StyledTableCell> */}
            <StyledTableCell>LVS</StyledTableCell>
            <StyledTableCell>GH/WO</StyledTableCell>
            {/* <StyledTableCell>Prs D</StyledTableCell> */}

            <StyledTableCell className="payDCell">Pay D</StyledTableCell>

            {/* <StyledTableCell>Code</StyledTableCell> */}
            {/* <StyledTableCell>Name</StyledTableCell> */}
            {daysTableHead()}
          </TableRow>
        </TableHead>

        <TableBody>
          {employeeList.length > 0 ? (
            employeeList.map((obj, i) => {
              return (
                <TableRow key={i}>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {`${obj?.month}/${obj?.year}`}
                    </Typography>
                  </StyledTableCellBody>

                  {/* <StyledTableCellBody1>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj?.absentday}
                    </Typography>
                  </StyledTableCellBody1> */}
                  <StyledTableCellBody1>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj?.leaveTaken}
                    </Typography>
                  </StyledTableCellBody1>
                  <StyledTableCellBody1>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj?.generalWo}
                    </Typography>
                  </StyledTableCellBody1>
                  {/* <StyledTableCellBody1>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj?.presentday ? obj?.presentday : "--"}
                    </Typography>
                  </StyledTableCellBody1> */}

                  <StyledTableCellBody1>
                    <Typography variant="subtitle2" color="red">
                      {obj?.paydays}
                    </Typography>
                  </StyledTableCellBody1>

                  {days.map((item, j) => {
                    return (
                      <StyledTableCellBody1 key={j}>
                        <HtmlTooltip
                          title={dayLable?.[obj?.["day" + item.value]]}
                        >
                          <span>{obj?.["day" + item.value]}</span>
                        </HtmlTooltip>
                      </StyledTableCellBody1>
                    );
                  })}
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

  const punchInData = () => (
    <TableContainer elevation={3} sx={{ maxWidth: 1300 }}>
      <Table size="small" ref={tableRef}>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={5}
              sx={{
                backgroundColor: "auzColor.main",
                color: "headerWhite.main",
                textAlign: "center",
              }}
            >
              Biometric Report
              {/* {" - " + moment(values.month).format("MM/YYYY")+ " " + "For " +empName } */}
            </TableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Punch In </StyledTableCell>
            <StyledTableCell>Punch Out </StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Shift Time</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bioMetricList.length > 0 ? (
            bioMetricList.map((obj, i) => {
              return (
                <TableRow key={i}>
                  <StyledTableCellBody>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      // sx={{ color: "success.main" }}
                    >
                      {obj?.startTime ? formatTime(obj?.startTime) : "--"}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography variant="subtitle2" color="textSecondary">
                      {obj?.endTime ? formatTime(obj?.endTime) : "--"}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography
                      style={{ textAlign: "center" }}
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {obj?.presentStatus ? obj?.presentStatus : "--"}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography
                      style={{ textAlign: "center" }}
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {obj?.date ? convertDateFormat(obj?.date) : "--"}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography
                      style={{ textAlign: "center" }}
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {obj?.shiftStartTime
                        ? formatTime(obj?.shiftStartTime) +
                          "-" +
                          formatTime(obj?.shiftEndTime)
                        : "--"}
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

  const leavesData = () => (

<TableContainer elevation={3} sx={{ maxWidth: 1300 }}>
  <Table size="small" ref={tableRef}>
    <TableHead sx={{
      backgroundColor: "auzColor.main",
      color: "#fff",
      textAlign: "center",
    }}>
      <TableRow>
        <StyledTableCell style={{ color: "#fff" }}>Leave Type</StyledTableCell>
        {/* Dynamic headers for years */}
        {calenderYearList?.map((year) => (
          <StyledTableCell style={{ color: "#fff" }} key={year.calender_year_id}>
            {year.calender_year}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
  {leaveTypeList.map((type) => {
    // Check if leave_id is 1, 2, or 3
    if ([1, 2, 3].includes(type.leave_id)) {
      return null; // Skip rendering the row
    }

    return (
      <TableRow key={type.leave_id}>
        <TableCell>{type?.leave_type}</TableCell>
        {calenderYearList?.map((year) => {
          const leaveCount = leaveIdList.find((data) => data?.leave_id === type?.leave_id && data?.year === year?.calender_year)?.leave_count;

          return (
            <TableCell key={year.calender_year_id}>
              {leaveCount && leaveCount > 0 ? (
                <Link
                  to={`/LeaveDetails/${userId ? userId : userID}/${type?.leave_id}`}
                  target="blank"
                  style={{
                    color: 'auzColor.main',
                    textDecoration: 'none',
                  }}
                >
                  <Typography variant="subtitle2" color="auzColor.main" textAlign={"center"} style={{
                    cursor: 'pointer',
                    fontWeight: "bold",
                  }}>
                    {leaveCount}
                  </Typography>
                </Link>
              ) : (
                <Typography variant="subtitle2" color="auzColor.main" textAlign={"center"}>
                  {'0'}
                </Typography>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    );
  })}
</TableBody>


  </Table>
</TableContainer>



  );

  const handleCheckPayslip = () => {
    const selectedDate = new Date(selectedMonthYear);
    const date = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    const finaleDate = `${date}-${month}-${year}`;

    axios
      .get(`/api/employee/paySlipOfUser?user_id=${userId}&Date=${finaleDate}`)
      .then((res) => {
        const rowdata = res.data.data[0];
        const values = {};
        navigate("/payreportPdf", { state: { rowdata, values, empId } });
        setPopupObj((prev) => {
          return { ...prev, showMessage: false };
        });
      })
      .catch((err) => {
        setPopupObj((prev) => {
          return { ...prev, showMessage: true };
        });
      });
  };

  const handlePopup = (action) => {
    setPopupObj((prev) => {
      return { ...prev, showMessage: action };
    });
  };

  const checkRoleAccess = () => {
    // 5-super admin, headHr-13, director-14
    const roles = [5, 13, 14];
    const empID = sessionStorage.getItem("empId");
    const { roleId } = JSON.parse(sessionStorage.getItem("AcharyaErpUser"));
    if (roles?.includes(roleId) || empID == empId) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={4}
        sx={{ marginTop: "1px" }}
      >
        <Grid item xs={4} md={2}>
          <CustomTabs
            value={subTab}
            onChange={handleSubTabChange}
            orientation="vertical"
            variant="scrollable"
            className="customTabs"
          >
            <CustomTab value="Employment" label="Employment" />
            <CustomTab value="Attendance" label="Attendance" />
            <CustomTab value="PunchIn" label="Biometric Details" />
            <CustomTab value="Leaves" label="Leaves" />
            <CustomTab value="Salary" label="Salary" />
            <CustomTab value="Payslip" label="Payslip" />
          </CustomTabs>
        </Grid>

        <Grid item xs={8} md={10}>
          <Grid container rowSpacing={0} direction="column">
            {subTab === "Salary" && (
              <Grid item xs={12}>
                {checkFullAccess(empId) ? (
                  <SalaryBreakupView id={offerIds} />
                ) : (
                  <Alert severity="error">You do not have permission!</Alert>
                )}
              </Grid>
            )}
          </Grid>

          {subTab === "Employment" && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    backgroundColor: "rgba(74, 87, 169, 0.1)",
                    color: "#46464E",
                    p: 1,
                  }}
                >
                  Employment Details
                </Typography>
              </Grid>
              <Grid item xs={12} component={Paper} elevation={3} p={2}>
                <>
                  <Grid container rowSpacing={1.5} columnSpacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Employee Coder
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.empcode}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Email</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.email}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Employee Type</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.emp_type}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Job Type</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.job_type}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">DOJ</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.date_of_joining
                          ? `${convertToDMY(data.date_of_joining.slice(0, 10))}`
                          : ""}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Designation</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.designation_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Salary Structure
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.salary_structure}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">School</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.school}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Department</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.dept_name_short}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Shift Time</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.shift_start_time + "-" + data.shift_end_time}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Shift Name</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.shift_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Leave Approver 1
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.leave_approver1_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Leave Approver 2
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.leave_approver2_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Preferred Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.preferred_name_for_email}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Biometric Status
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.punched_card_status}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Driving License Number
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.dlno}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Driving License Valid Till
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.dlexpno}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Bank</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.bank_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Bank Branch Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.bank_branch}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Account Holder Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.bank_account_holder_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">
                        Account Number
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.bank_account_no}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Passport No</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.passportno}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">PINFL</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        {data.pinfl}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </>
          )}
          {subTab === "Attendance" && (
            <>
              {isLoading ? (
                <Grid item xs={12} align="center">
                  <OverlayLoader />
                </Grid>
              ) : (
                <>
                  <Grid item xs={14}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Attendance Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} component={Paper} elevation={2} p={2}>
                    <Grid container columnSpacing={4} rowSpacing={2}>
                      <Grid item xs={12} md={4}>
                        <CustomDatePicker
                          name="fromDate"
                          label="From"
                          value={values.fromDate}
                          handleChangeAdvance={handleChangeAdvance}
                          views={["month", "year"]}
                          openTo="month"
                          inputFormat="MM/YYYY"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <CustomDatePicker
                          name="toDate"
                          label="To"
                          value={values.toDate}
                          handleChangeAdvance={handleChangeAdvance}
                          views={["month", "year"]}
                          openTo="month"
                          inputFormat="MM/YYYY"
                          required
                        />
                      </Grid>

                      <Grid item xs={12} md={4} align="right">
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={
                            values.month === null ||
                            values.month === "Invalid Date"
                          }
                        >
                          GO
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        {tableData()}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          )}

          {subTab === "PunchIn" && (
            <>
              {isLoading ? (
                <Grid item xs={12} align="center">
                  <OverlayLoader />
                </Grid>
              ) : (
                <>
                  <Grid item xs={14}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Biometric Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} component={Paper} elevation={2} p={2}>
                    <Grid container columnSpacing={4} rowSpacing={2}>
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

                      <Grid item xs={12} md={8} align="right">
                        <Button
                          variant="contained"
                          onClick={handlePunch}
                          disabled={
                            values.month === null ||
                            values.month === "Invalid Date"
                          }
                        >
                          GO
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        {punchInData()}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          )}

{subTab === "Leaves" && (
            <>
              {isLoading ? (
                <Grid item xs={12} align="center">
                  <OverlayLoader />
                </Grid>
              ) : (
                <>
                  <Grid item xs={14}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        backgroundColor: "rgba(74, 87, 169, 0.1)",
                        color: "#46464E",
                        p: 1,
                      }}
                    >
                      Leaves/Attendance Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} component={Paper} elevation={2} p={2}>
                    <Grid container columnSpacing={4} rowSpacing={2}>
                      {/* <Grid item xs={12} md={8} align="right">
                        <Button
                          variant="contained"
                          onClick={handlePunch}
                          disabled={
                            values.month === null ||
                            values.month === "Invalid Date"
                          }
                        >
                          GO
                        </Button>
                      </Grid> */}
                      <Grid item xs={12}>
                        {leavesData()}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          )}

          {subTab === "Payslip" && (
            <>
              {checkRoleAccess(empId) ? (
                <>
                  <FormWrapper>
                    <Grid container rowSpacing={0} mt={3}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Grid container flexDirection="row">
                          <Grid item xs={8}>
                            <CustomDatePicker
                              name="month"
                              label="Payslip Month"
                              value={selectedMonthYear}
                              handleChangeAdvance={(name, newValue) =>
                                setSelectedMonthYear(newValue)
                              }
                              views={["month", "year"]}
                              openTo="month"
                              inputFormat="MM/YYYY"
                              required
                            />
                          </Grid>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={3}>
                            <Button
                              variant="outlined"
                              onClick={handleCheckPayslip}
                            >
                              Check
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid></Grid>
                    </Grid>
                    <Grid container rowSpacing={3} mt={3}>
                      <Grid item xs={12}>
                        <Snackbar
                          open={showMessage}
                          autoHideDuration={6000}
                          onClose={() => handlePopup(false)}
                          anchorOrigin={{ vertical, horizontal }}
                        >
                          <Alert
                            onClose={() => handlePopup(false)}
                            severity="error"
                            sx={{ width: "100%" }}
                          >
                            Pay Slip is not generated, Please contact to HR !!
                          </Alert>
                        </Snackbar>
                      </Grid>
                    </Grid>
                  </FormWrapper>
                </>
              ) : (
                <Alert severity="error">You do not have permission!</Alert>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default EmployeeDetailsViewHRData;
