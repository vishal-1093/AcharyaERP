import React, { useRef } from "react";
import { useState, useEffect } from "react";
import SalaryBreakupView from "./SalaryBreakupViewByEmpId";
import { useNavigate } from "react-router-dom";
import { checkFullAccess } from "../utils/DateTimeUtils";
import axios from "../services/Api";
import CustomDatePicker from "../components/Inputs/CustomDatePicker";
import CustomTextField from "./Inputs/CustomTextField";
import { convertUTCtoTimeZone } from "../utils/DateTimeUtils";
import { styled } from "@mui/system";
import OverlayLoader from "../components/OverlayLoader";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
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
  IconButton,
} from "@mui/material";
import { convertDateFormat, formatTime } from "../utils/Utils";
import FormWrapper from "./FormWrapper";
import CustomAutocomplete from "./Inputs/CustomAutocomplete";
import useAlert from "../hooks/useAlert";
import moment from "moment";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineOppositeContentClasses,
} from "@mui/lab";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import InterpreterModeIcon from "@mui/icons-material/InterpreterMode";
import TodayIcon from "@mui/icons-material/Today";

const initialValues = {
  fromDate: convertUTCtoTimeZone(new Date()),
  month: convertUTCtoTimeZone(new Date()),
  toDate: convertUTCtoTimeZone(new Date()),
  schoolId: null,
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

    border: "1px solid rgba(224, 224, 224, 1)",
    "&:nth-of-type(3)": {
      textAlign: "left",
    },
    "&:nth-of-type(4)": {},
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

    padding: 7,
    border: "1px solid rgba(224, 224, 224, 1)",
    "&:nth-of-type(3)": {
      textAlign: "left",
    },
    "&:nth-of-type(4)": {},
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const languageDetails = [
  {
    language: "English",
    read: false,
    write: false,
    speak: false,
    language_id: null,
  },
  {
    language: "Kannada",
    read: false,
    write: false,
    speak: false,
    language_id: null,
  },
  {
    language: "Telugu",
    read: false,
    write: false,
    speak: false,
    language_id: null,
  },
  {
    language: "Hindi",
    read: false,
    write: false,
    speak: false,
    language_id: null,
  },
  {
    language: "Tamil",
    read: false,
    write: false,
    speak: false,
    language_id: null,
  },
  {
    language: "Malayalam",
    read: false,
    write: false,
    speak: false,
    language_id: null,
  },
];

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

const roleIds = [1, 5, 6];

const roleId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.roleId;

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
  const [language, setLanguage] = useState(languageDetails);
  const [proctorOptions, setProctorOptions] = useState([]);

  const [leaveData, setLeavesData] = useState([
    {
      year: 2018,
      "Declared Holiday": 1,
      "CL/SL": 10,
      "Manual Attendance": 1,
      OnDuty: 0,
      "Seminar Leave": 20,
      "Manual Attendace": 5,
      "Restricted Leave": 12,
    },
    {
      year: 2019,
      "Declared Holiday": 4,
      "CL/SL": 8,
      "Manual Attendance": 1,
      OnDuty: 2,
      "Seminar Leave": 0,
      "Manual Attendace": 5,
      "Restricted Leave": 10,
    },

    {
      year: 2020,
      "Declared Holiday": 1,
      "CL/SL": 10,
      "Manual Attendance": 1,
      OnDuty: 2,
      "Seminar Leave": 20,
      "Manual Attendace": 5,
      "Restricted Leave": 12,
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

  const { setAlertMessage, setAlertOpen } = useAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [employmentDetailsData, setEmploymentDetailsData] = useState({
    doj: null,
  });
  const [shiftOptions, setShiftOptions] = useState([]);
  const [reportOptions, setReportOptions] = useState([]);
  const [interviewData, setInterviewData] = useState([]);

  const checks = {
    uanNo: [/^[0-9]{12}$/.test(employmentDetailsData.uanNo)],
  };
  const errorMessages = {
    uanNo: ["Invalid UAN No"],
  };

  useEffect(() => {
    getData();
    handleSubmit();
    handlePunch();
    getLevesType();
    getLevesYear();
    getLevesTypeId();
    getLanguageDetails();
    getReportDetails();
    getProctorDetails();
  }, []);

  useEffect(() => {
    if (userId) getLevesTypeId(userId);
  }, [userId]);

  useEffect(() => {
    getShiftDetails();
  }, [employmentDetailsData.schoolId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const getShiftDetails = async () => {
    if (employmentDetailsData.schoolId)
      await axios
        .get(
          `/api/employee/shiftDetailsBasedOnSchoolId/${employmentDetailsData.schoolId}`
        )
        .then((res) => {
          const optionData = [];
          res.data.data.forEach((obj) => {
            optionData.push({
              value: obj.id,
              label:
                obj.shiftName +
                " ( " +
                obj.shiftStartTime?.slice(0, 5) +
                " -" +
                obj.shiftEndTime?.slice(0, 5) +
                " ) ",
            });
          });
          setShiftOptions(optionData);
        })
        .catch((err) => console.error(err));
  };

  const getReportDetails = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.emp_id,
            label: obj.employee_name + "-" + obj.email,
            employeeName: obj.employee_name,
          });
        });
        setReportOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getProctorDetails = async () => {
    await axios
      .get(`/api/proctor/getAllActiveProctors`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.id,
            label: obj.concat_employee_name,
            employeeName: obj.employee_name,
          });
        });
        setProctorOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails/${empId}`)
      .then((res) => {
        setUserId(res.data.data[0].user_id);
        setOfferIds(res.data.data[0].offer_id);
        setEmploymentDetailsData({
          empCode: res.data.data[0].empcode,
          email: res.data.data[0].email,
          empType: res.data.data[0].emp_type,
          jobType: res.data.data[0].job_type,
          doj: res.data.data[0].date_of_joining,
          designation: res.data.data[0].designation_name,
          salaryStructure: res.data.data[0].salary_structure,
          school: res.data.data[0].school_name,
          department: res.data.data[0].dept_name,
          shiftId: res.data.data[0].shift_category_id,
          leaveApproverOne: res.data.data[0].leave_approver1_emp_id,
          leaveApproverTwo: res.data.data[0].leave_approver2_emp_id,
          preferredName: res.data.data[0].preferred_name_for_email,
          biometricStatus: res.data.data[0].punched_card_status,
          bank: res.data.data[0].bank_id,
          bankBranch: res.data.data[0].bank_branch,
          accountHolderName: res.data.data[0].bank_account_holder_name,
          accountNumber: res.data.data[0].bank_account_no,
          storeIndentApprover: res.data.data[0].store_indent_approver1,
          ifscCode: res.data.data[0].bank_ifsccode,
          uanNo: res.data.data[0].uan_no,
          reportId: res.data.data[0].report_id,
          proctorId: res.data.data[0].chief_proctor_id,
          schoolId: res.data.data[0].school_id,
        });
        axios
          .get(
            `/api/employee/getAllApplicantDetails/${res.data.data[0].job_id}`
          )
          .then((res) => {
            setJobDetails(res.data);
          })
          .catch((err) => console.error(err));

        axios
          .get(
            `/api/employee/getAllInterviewerDeatils/${res.data.data[0].job_id}`
          )
          .then((res) => {
            setInterviewData(res.data.data);
          })
          .catch((err) => console.error(err));

        setData(res.data.data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getLanguageDetails = async () => {
    await axios
      .get(`/api/employee/getLanguageBasedOnEmpId/${empId}`)
      .then((res) => {
        if (res.data.data.length > 0) {
          const languageData = [];
          res.data.data.forEach((obj) => {
            languageData.push({
              language: obj.language_name,
              read: obj.lang_read,
              write: obj.lang_write,
              speak: obj.lang_speak,
              language_id: obj.language_id,
            });
          });
          setLanguage(languageData);
        }
      })
      .catch((err) => console.error(err));
  };

  const getLevesData = async () => {
    await axios
      .get(`/api/getLeaveKettyDetails/${empId}`)
      .then((res) => {
        setUserId(res.data.data[0].user_id);
        setOfferIds(res.data.data[0].offer_id);
        setEmployeeDetails(res.data.data[0]);
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
      .get(`/api/CalenderYear`)
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

  const handleChangeOne = (e, index) => {
    const { name, checked } = e.target;
    setLanguage((prev) =>
      prev.map((obj, i) => {
        if (index === i) return { ...obj, [name]: checked };
        return obj;
      })
    );
  };

  const languageKnown = async () => {
    const postData = [];
    const putData = [];
    const languageIds = [];

    language.map((obj, i) => {
      languageIds.push(obj.language_id);
      if (obj.language_id === null) {
        postData.push({
          active: true,
          emp_id: empId,
          language_name: obj.language,
          lang_read: obj.read,
          lang_write: obj.write,
          lang_speak: obj.speak,
        });
      } else {
        putData.push({
          active: true,
          emp_id: empId,
          language_id: obj.language_id,
          language_name: obj.language,
          lang_read: obj.read,
          lang_write: obj.write,
          lang_speak: obj.speak,
        });
      }
    });

    if (postData.length > 0) {
      await axios
        .post(`/api/employee/saveLanguage`, postData)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Languages Updated",
          });
          setAlertOpen(true);
          getLanguageDetails();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: "Error occured in languages known",
          });
          setAlertOpen(true);
        });
    }
    if (putData.length > 0) {
      await axios
        .put(`/api/employee/updateLanguage/${languageIds.toString()}`, putData)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Languages Updated",
            });
            setAlertOpen(true);
            getLanguageDetails();
          } else {
            setAlertMessage({
              severity: "error",
              message: "Error Occured",
            });
          }
          setAlertOpen(true);
          getData();
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response.data.message,
          });
        });
    }
  };

  const leaveApproverOneName = reportOptions.find(
    (obj) => obj.value === employmentDetailsData.leaveApproverOne
  );

  const leaveApproverTwoName = reportOptions.find(
    (obj) => obj.value === employmentDetailsData.leaveApproverTwo
  );

  const storeIndentApproverName = reportOptions.find(
    (obj) => obj.value === employmentDetailsData.storeIndentApprover
  );

  const reporterName = reportOptions.find(
    (obj) => obj.value === employmentDetailsData.reportId
  );

  const proctorName = proctorOptions.find(
    (obj) => obj.value === employmentDetailsData.proctorId
  );

  const handleEditPersonalData = async () => {
    const historyData = { ...data };

    const temp = {};

    temp.emp_id = empId;
    temp.shift_category_id = employmentDetailsData.shiftId;
    temp.leave_approver1_emp_id = employmentDetailsData.leaveApproverOne;
    temp.leave_approver2_emp_id = employmentDetailsData.leaveApproverTwo;
    temp.store_indent_approver1 = employmentDetailsData.storeIndentApprover;
    temp.bank_id = employmentDetailsData.bank;
    temp.bank_branch = employmentDetailsData.bankBranch;
    temp.bank_account_holder_name = employmentDetailsData.accountHolderName;
    temp.bank_account_no = employmentDetailsData.accountNumber;
    temp.uan_no = employmentDetailsData.uanNo;
    temp.bank_ifsccode = employmentDetailsData.ifscCode;
    temp.report_id = employmentDetailsData.reportId;
    temp.chief_proctor_id = employmentDetailsData.proctorId;

    data.bank_id === employmentDetailsData.bank
      ? (historyData.bank_id = employmentDetailsData.bank)
      : (historyData.bank_id = `<font color='blue'>${employmentDetailsData.bank}</font>`);

    data.bank_branch === employmentDetailsData.bankBranch
      ? (historyData.bank_branch = employmentDetailsData.bankBranch)
      : (historyData.bank_branch = `<font color='blue'>${employmentDetailsData.bankBranch}</font>`);

    data.bank_account_holder_name === employmentDetailsData.accountHolderName
      ? (historyData.bank_account_holder_name =
          employmentDetailsData.accountHolderName)
      : (historyData.bank_account_holder_name = `<font color='blue'>${employmentDetailsData.accountHolderName}</font>`);

    data.bank_account_no === employmentDetailsData.accountNumber
      ? (historyData.bank_account_no = employmentDetailsData.accountNumber)
      : (historyData.bank_account_no = `<font color='blue'>${employmentDetailsData.accountNumber}</font>`);

    data.uan_no === employmentDetailsData.uanNo
      ? (historyData.uan_no = employmentDetailsData.uanNo)
      : (historyData.uan_no = `<font color='blue'>${employmentDetailsData.uanNo}</font>`);

    data.bank_ifsccode === employmentDetailsData.ifscCode
      ? (historyData.bank_ifsccode = employmentDetailsData.ifscCode)
      : (historyData.bank_ifsccode = `<font color='blue'>${employmentDetailsData.ifscCode}</font>`);

    data.leave_approver1_emp_id === employmentDetailsData.leaveApproverOne
      ? (historyData.leave_approver1_emp_id =
          leaveApproverOneName?.employeeName)
      : (historyData.leave_approver1_emp_id = `<font color='blue'>${leaveApproverOneName?.employeeName}</font>`);

    data.leave_approver2_emp_id === employmentDetailsData.leaveApproverTwo
      ? (historyData.leave_approver2_emp_id =
          leaveApproverTwoName?.employeeName)
      : (historyData.leave_approver2_emp_id = `<font color='blue'>${leaveApproverTwoName?.employeeName}</font>`);

    data.store_indent_approver1 === employmentDetailsData.storeIndentApprover
      ? (historyData.store_indent_approver1 =
          storeIndentApproverName?.employeeName)
      : (historyData.store_indent_approver1 = `<font color='blue'>${storeIndentApproverName?.employeeName}</font>`);

    data.store_indent_approver1 === employmentDetailsData.storeIndentApprover
      ? (historyData.leave_approver2_emp_id =
          storeIndentApproverName?.employeeName)
      : (historyData.leave_approver2_emp_id = `<font color='blue'>${storeIndentApproverName?.employeeName}</font>`);

    data.report_id === employmentDetailsData.reportId
      ? (historyData.report_id = reporterName?.employeeName)
      : (historyData.report_id = `<font color='blue'>${reporterName?.employeeName}</font>`);

    data.chief_proctor_id === employmentDetailsData.proctorId
      ? (historyData.chief_proctor_id = proctorName?.employeeName)
      : (historyData.chief_proctor_id = `<font color='blue'>${proctorName?.employeeName}</font>`);

    await axios
      .post(`/api/employee/employeeDetailsHistory`, historyData)
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          // Update employee details
          await axios
            .put(
              `/api/employee/updateEmployeeDetailsUpdatableData/${empId}`,
              temp
            )
            .then((putRes) => {
              setAlertMessage({
                severity: "success",
                message: "Updated successfully !!",
              });
              setAlertOpen(true);
              getData();
              setIsEditing(false);
            })
            .catch((putErr) => {
              setAlertMessage({
                severity: "error",
                message: putErr.response
                  ? putErr.response.data.message
                  : "Error",
              });
              setAlertOpen(true);
            });
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response ? err.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeEmploymentData = (e) => {
    setEmploymentDetailsData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeEmploymentAdvance = (name, newValue) => {
    setEmploymentDetailsData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeEmploymentDate = (name, newValue) => {
    setEmployeeDetails((prev) => ({
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
    const toDate = values.toDate.slice(0, 7);
    const getMonthYear = values.month.slice(0, 7);
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
                (employeeDetails?.employee_name
                  ? "For " + employeeDetails?.employee_name
                  : "")}
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

  const findTimeDiff = (obj) => {
    const { shiftStartTime, shiftEndTime, duration } = obj;
    if (typeof duration !== "string") return false;

    const shiftStartTime_ = moment(shiftStartTime, "HH:mm:ss");
    const shiftEndTime_ = moment(shiftEndTime, "HH:mm:ss");
    const shiftDifference = moment.duration(
      shiftEndTime_.diff(shiftStartTime_)
    );
    const shiftDifferenceFormatted = `${shiftDifference.hours()}:${shiftDifference.minutes()}:${shiftDifference.seconds()}`;
    const shouldMatch = moment(shiftDifferenceFormatted, "HH:mm:ss");
    const duration_ = moment(duration, "HH:mm:ss");
    const difference = duration_.diff(shouldMatch);
    if (difference >= 0) return true;

    return false;
  };

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
            <StyledTableCell>Grace Time</StyledTableCell>
            <StyledTableCell>Duration</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bioMetricList.length > 0 ? (
            bioMetricList.map((obj, i) => {
              return (
                <TableRow
                  key={i}
                  style={{
                    backgroundColor: findTimeDiff(obj) ? null : "#FFCCCB",
                  }}
                >
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
                      {obj?.grace_start_time
                        ? formatTime(obj?.grace_start_time) +
                          "-" +
                          formatTime(obj?.shiftEndTime)
                        : "--"}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography
                      style={{ textAlign: "center" }}
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {obj?.shiftStartTime}
                    </Typography>
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    <Typography
                      style={{ textAlign: "center" }}
                      variant="subtitle2"
                      color="textSecondary"
                    >
                      {obj?.duration ? obj?.duration : ""}
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
        <TableHead
          sx={{
            backgroundColor: "auzColor.main",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <TableRow>
            <StyledTableCell style={{ color: "#fff" }}>
              Leave Type
            </StyledTableCell>
            {/* Dynamic headers for years */}
            {calenderYearList?.map((year) => (
              <StyledTableCell
                style={{ color: "#fff" }}
                key={year.calender_year_id}
              >
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
                  const leaveCount = leaveIdList.find(
                    (data) =>
                      data?.leave_id === type?.leave_id &&
                      data?.year === year?.calender_year
                  )?.leave_count;

                  return (
                    <TableCell key={year.calender_year_id}>
                      {leaveCount && leaveCount > 0 ? (
                        <Link
                          to={`/LeaveDetails/${userId ? userId : userID}/${
                            type?.leave_id
                          }`}
                          target="blank"
                          style={{
                            color: "auzColor.main",
                            textDecoration: "none",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="auzColor.main"
                            textAlign={"center"}
                            style={{
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            {leaveCount}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography
                          variant="subtitle2"
                          color="auzColor.main"
                          textAlign={"center"}
                        >
                          {"0"}
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
            <CustomTab value="Languages" label="Languages Known" />
            <CustomTab value="Timeline" label="Candidate TimeLine" />
          </CustomTabs>
        </Grid>

        <Grid item xs={8} md={10}>
          <Grid container rowSpacing={0} direction="column">
            {subTab === "Salary" && (
              <Grid item xs={12}>
                {checkFullAccess(empId) || roleId !== 6 ? (
                  <SalaryBreakupView empId={empId} id={offerId || offerIds} />
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
                  {roleIds?.includes(roleId) ? (
                    <IconButton size="small" onClick={handleEditClick}>
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12} component={Paper} elevation={3} p={2}>
                {isEditing ? (
                  <>
                    <Grid container rowSpacing={2} columnSpacing={2}>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Employee Code
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="empCode"
                          label="Name"
                          value={employmentDetailsData.empCode}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Email</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="email"
                          label="Email"
                          value={employmentDetailsData.email}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Employee Type
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="empType"
                          label="Emp Type"
                          value={employmentDetailsData.empType}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Job Type</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="jobType"
                          label="Job Type"
                          value={employmentDetailsData.jobType}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">DOJ</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="doj"
                          label="Date of joining"
                          value={employmentDetailsData.doj}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Designation</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="designation"
                          label="Designation"
                          value={employmentDetailsData.designation}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Salary Structure
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="salaryStructure"
                          label="Salary Structure"
                          value={employmentDetailsData.salaryStructure}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">School</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="school"
                          label="School"
                          value={employmentDetailsData.school}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Department</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="department"
                          label="Department"
                          value={employmentDetailsData.department}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Shift Time</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomAutocomplete
                          name="shiftId"
                          value={employmentDetailsData.shiftId}
                          options={shiftOptions}
                          handleChangeAdvance={handleChangeEmploymentAdvance}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Leave Approver 1
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomAutocomplete
                          name="leaveApproverOne"
                          value={employmentDetailsData.leaveApproverOne}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeEmploymentAdvance}
                        />
                      </Grid>
                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Leave Approver 2
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomAutocomplete
                          name="leaveApproverTwo"
                          value={employmentDetailsData.leaveApproverTwo}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeEmploymentAdvance}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Report To</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomAutocomplete
                          name="reportId"
                          value={employmentDetailsData.reportId}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeEmploymentAdvance}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Proctor Head
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomAutocomplete
                          name="proctorId"
                          value={employmentDetailsData.proctorId}
                          options={proctorOptions}
                          handleChangeAdvance={handleChangeEmploymentAdvance}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Store Indent Approver
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomAutocomplete
                          name="storeIndentApprover"
                          value={employmentDetailsData.storeIndentApprover}
                          options={reportOptions}
                          handleChangeAdvance={handleChangeEmploymentAdvance}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Preferred Name For Display
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="preferredName"
                          label="Preferred Name"
                          value={employmentDetailsData.preferredName}
                          handleChange={handleChangeEmploymentData}
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">UAN No.</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="uanNo"
                          label="UAN No."
                          value={employmentDetailsData.uanNo}
                          handleChange={handleChangeEmploymentData}
                          checks={checks.uanNo}
                          errors={errorMessages.uanNo}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Bank</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="bank"
                          label="Bank"
                          value={employmentDetailsData.bank}
                          handleChange={handleChangeEmploymentData}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">Bank Branch</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="bankBranch"
                          label="Bank Branch"
                          value={employmentDetailsData.bankBranch}
                          handleChange={handleChangeEmploymentData}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Account Holder Name
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="accountHolderName"
                          label="Account Holder Name"
                          value={employmentDetailsData.accountHolderName}
                          handleChange={handleChangeEmploymentData}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">
                          Account Number
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="accountNumber"
                          label="Account Number"
                          value={employmentDetailsData.accountNumber}
                          handleChange={handleChangeEmploymentData}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Typography variant="subtitle2">IFSC Code</Typography>
                      </Grid>
                      <Grid item xs={12} md={4.5}>
                        <CustomTextField
                          name="ifscCode"
                          label="IFSC Code"
                          value={employmentDetailsData.ifscCode}
                          handleChange={handleChangeEmploymentData}
                        />
                      </Grid>

                      <Grid item xs={12} mt={2} align="right">
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ mr: 2, borderRadius: 2 }}
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          sx={{ borderRadius: 2 }}
                          variant="contained"
                          color="success"
                          onClick={handleEditPersonalData}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid container rowSpacing={1.5} columnSpacing={2}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2">
                          Employee Code
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
                        <Typography variant="subtitle2">
                          Employee Type
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.emp_type_short_name === "ORR" &&
                          data.permanent_status === 2
                            ? data.emp_type + " - " + "Permanent"
                            : data.emp_type_short_name === "ORR" &&
                              data.permanent_file === 1
                            ? data.emp_type + " - " + "Probationary"
                            : data.emp_type}
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
                          {data.date_of_joining ? data.date_of_joining : ""}
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
                          {data.school_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2">Department</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.dept_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2">Shift </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.shift_name} (
                          {data.shift_start_time + "-" + data.shift_end_time})
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
                        <Typography variant="subtitle2">Reported To</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.reporting_employeeName}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2">
                          Store Indent Approver
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.storeIndentApproverName1}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2">
                          Proctor Head
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.proctorName}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2">
                          Preferred Name For Display
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
                          Biometric Card No.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.biometricCardId}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2">UAN No.</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.uan_no}
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
                        <Typography variant="subtitle2">Bank Branch</Typography>
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
                        <Typography variant="subtitle2">IFSC Code</Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="body2" color="textSecondary">
                          {data.bank_ifsccode}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}
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

          {subTab === "Languages" && (
            <>
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardHeader
                    title="Languages Known"
                    titleTypographyProps={{
                      variant: "subtitle2",
                    }}
                    sx={{
                      backgroundColor: "rgba(74, 87, 169, 0.1)",
                      color: "#46464E",
                      padding: 1,
                    }}
                  />
                  <CardContent>
                    <Grid
                      container
                      columnSpacing={2}
                      justifyContent="center"
                      alignItems="center"
                      marginTop={2}
                    >
                      <Grid item xs={12}>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <StyledTableRow>
                                <StyledTableCell>Language</StyledTableCell>
                                <StyledTableCell>Read</StyledTableCell>
                                <StyledTableCell>Write</StyledTableCell>
                                <StyledTableCell>Speak</StyledTableCell>
                              </StyledTableRow>
                            </TableHead>
                            <TableBody>
                              {language.map((obj, i) => {
                                return (
                                  <StyledTableRow key={i}>
                                    <StyledTableCell
                                      style={{ textAlign: "center" }}
                                    >
                                      {obj.language}
                                    </StyledTableCell>
                                    <StyledTableCell
                                      style={{ textAlign: "center" }}
                                    >
                                      <Checkbox
                                        sx={{
                                          "& .MuiSvgIcon-root": {
                                            fontSize: 14,
                                          },
                                        }}
                                        name="read"
                                        value={obj.read}
                                        onChange={(e) => handleChangeOne(e, i)}
                                        checked={obj.read}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell
                                      style={{ textAlign: "center" }}
                                    >
                                      <Checkbox
                                        sx={{
                                          "& .MuiSvgIcon-root": {
                                            fontSize: 14,
                                          },
                                        }}
                                        name="write"
                                        value={obj.write}
                                        onChange={(e) => handleChangeOne(e, i)}
                                        checked={obj.write}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell
                                      style={{ textAlign: "center" }}
                                    >
                                      <Checkbox
                                        sx={{
                                          "& .MuiSvgIcon-root": {
                                            fontSize: 14,
                                          },
                                        }}
                                        name="speak"
                                        value={obj.speak}
                                        onChange={(e) => handleChangeOne(e, i)}
                                        checked={obj.speak}
                                      />
                                    </StyledTableCell>
                                  </StyledTableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item xs={12} align="right">
                        <Button
                          variant="contained"
                          sx={{ borderRadius: 2, marginTop: 2 }}
                          onClick={languageKnown}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
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

          {subTab === "Timeline" && (
            <>
              <Grid item xs={12}>
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
                  }}
                >
                  <TimelineItem>
                    <TimelineOppositeContent>
                      Applied Date
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <NoteAddIcon fontSize="medium" />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      {moment(jobDetails?.Job_Profile?.created_date).format(
                        "DD-MM-YYYY"
                      )}
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineOppositeContent>
                      Interview scheduled Date
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <InterpreterModeIcon fontSize="medium" />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      {moment(interviewData?.[0]?.frontend_use_datetime).format(
                        "DD-MM-YYYY"
                      )}
                    </TimelineContent>
                  </TimelineItem>

                  {/* <TimelineItem>
                    <TimelineOppositeContent>
                      Mail sent date to interviewer
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <EmailIcon fontSize="medium" />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      {moment(interviewData?.[0].frontend_use_datetime).format(
                        "DD-MM-YYYY"
                      )}
                    </TimelineContent>
                  </TimelineItem> */}

                  {/* <TimelineItem>
                    <TimelineOppositeContent>
                      Mail sent date to candidate
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <EmailIcon fontSize="medium" />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      {moment(interviewData?.[0].frontend_use_datetime).format(
                        "DD-MM-YYYY"
                      )}
                    </TimelineContent>
                  </TimelineItem> */}

                  {/* <TimelineItem>
                    <TimelineOppositeContent>Feedback</TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <EmailIcon fontSize="medium" />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography display="inline">
                        Marks scored : 12
                      </Typography>
                      <Typography display="inline">
                        <IconButton>
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineOppositeContent>
                      Salary Breakup
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <EmailIcon fontSize="medium" />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography display="inline">
                        <IconButton>
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>

                  <TimelineItem>
                    <TimelineOppositeContent>Offer</TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <EmailIcon fontSize="medium" />
                      </TimelineDot>
                      <TimelineConnector sx={{ bgcolor: "blue.main" }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography display="inline">
                        <IconButton>
                          <VisibilityIcon color="primary" />
                        </IconButton>
                      </Typography>
                    </TimelineContent>
                  </TimelineItem> */}

                  <TimelineItem>
                    <TimelineOppositeContent>
                      Onboarded Date
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="blue">
                        <TodayIcon fontSize="medium" />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography display="inline">
                        {data?.date_of_joining}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default EmployeeDetailsViewHRData;
