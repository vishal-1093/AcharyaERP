import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
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
  tableCellClasses,
} from "@mui/material";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import { styled } from "@mui/system";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomModal from "../../../components/CustomModal";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import useAlert from "../../../hooks/useAlert";
import { makeStyles } from "@mui/styles";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { endOfMonth } from "date-fns";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";

const initialValues = {
  leaveType: "",
  leaveId: null,
  pendingLeaves: "",
  fromDate: null,
  toDate: null,
  appliedDays: 0,
  halfDayDate: null,
  shift: "",
  compOffDate: null,
  leaveDate: null,
  reason: "",
  document: "",
  swapEmpId: null,
  courseId: null,
};

const requiredFields = ["leaveType", "leaveId", "reason"];

const userId = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.userId;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-root": {
      border: "1px solid rgba(224, 224, 224, 1)",
      padding: 5,
      textAlign: "center",
    },
  },
}));

function LeaveApplyForm() {
  const [values, setValues] = useState(initialValues);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [timeTableData, setTimeTableData] = useState([]);
  const [swapWrapperOpen, setSwapWrapperOpen] = useState(false);
  const [swapEmpOptions, setSwapEmpOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [swapEmpData, setSwapEmpData] = useState([]);
  const [swappingEmpId, setSwappingEmpId] = useState(0);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const classes = useStyles();

  const checks = {
    reason: [values.reason !== "", values.reason.length < 150],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const currentDate = new Date();
  const lastDayOfMonth = endOfMonth(currentDate);

  const errorMessages = {
    reason: ["This field is required", "Maximum characters 150"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getEmployeeData();
    setCrumbs([{ name: "Leave History", link: "/LeaveApplyIndex" }]);
  }, []);

  useEffect(() => {
    getLeaveTypeOptions();
  }, [empData?.emp_id]);

  useEffect(() => {
    getPendingLeaves();
    getHolidays();
  }, [values.leaveId]);

  useEffect(() => {
    if (values.fromDate && values.toDate) {
      const oneDay = 1000 * 60 * 60 * 24;

      const timeDifference =
        new Date(values.toDate).getTime() - new Date(values.fromDate).getTime();

      const dateDifference = Math.round(timeDifference / oneDay) + 1;

      setValues((prev) => ({
        ...prev,
        appliedDays: dateDifference,
      }));
    }
  }, [values.fromDate, values.toDate]);

  useEffect(() => {
    getTimeTableDetails();
  }, [values.fromDate, values.toDate, empData?.emp_id]);

  useEffect(() => {
    getCourseOptions();
    const swapData = swapEmpData.filter(
      (obj) => obj.userDetail_id === values.swapEmpId
    );

    if (swapData.length > 0) {
      setSwappingEmpId(swapData[0]?.emp_id);
    }
  }, [values.swapEmpId]);

  useEffect(() => {
    handleChangeColumns();
  }, [values.leaveType]);

  const getEmployeeData = async () => {
    if (userId)
      await axios
        .get(`/api/employee/getEmployeeDataByUserID/${userId}`)
        .then((res) => {
          setEmpData(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const getLeaveTypeOptions = async () => {
    if (empData?.emp_id) {
      await axios
        .get(`/api/leaveTypesAvailableForEmployees/${empData?.emp_id}`)
        .then((res) => {
          if (res.data.data.length > 0) {
            const temp = {};

            res.data.data.forEach((obj) => {
              temp[obj.leave_id] = {
                attachment: obj.leave_type_attachment_required,
                kitty: obj.is_attendance,
                type: obj.type,
                shortName: obj.leave_type_short,
              };
            });

            setLeaveTypeData(temp);

            setLeaveTypeOptions(
              res.data.data.map((obj) => ({
                value: obj.leave_id,
                label: obj.leave_type,
              }))
            );
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const getPendingLeaves = async () => {
    if (values.leaveId) {
      if (leaveTypeData[values.leaveId].type !== "Attendence") {
        await axios
          .get(`/api/getUpdatedDaysCount/${empData?.emp_id}/${values.leaveId}`)
          .then((res) => {
            if (Number(res.data.data) > 0) {
              setValues((prev) => ({
                ...prev,
                pendingLeaves: Number(res.data.data),
              }));
            } else {
              setAlertMessage({
                severity: "error",
                message: "You don't have enough leaves to apply !!",
              });
              setAlertOpen(true);

              setValues((prev) => ({
                ...prev,
                leaveId: "",
              }));
            }
          })
          .catch((err) => console.error(err));
      }

      if (
        leaveTypeData[values.leaveId].attachment === true &&
        requiredFields.includes("document") === false
      ) {
        requiredFields.push("document");
      } else if (
        leaveTypeData[values.leaveId].attachment === false &&
        requiredFields.includes("document") === true
      ) {
        requiredFields.splice(requiredFields.indexOf("document"), 1);
      }
    }
  };

  const getTimeTableDetails = async () => {
    if (values.fromDate && values.toDate && empData?.emp_id) {
      await axios
        .get(
          `/api/getTimeTableDetailsForEmployeesInEmployeeLeave/${empData?.emp_id}/${values.fromDate}/${values.toDate}`
        )
        .then((res) => {
          setTimeTableData(res.data.data);
        })
        .catch((err) => console.error(err));
    }
  };

  const getCourseOptions = async () => {
    if (values.swapEmpId)
      await axios
        .get(`/api/academic/getAssignedCourses/${values.swapEmpId}`)
        .then((res) => {
          setCourseOptions(
            res.data.data.map((obj) => ({
              value: obj.subjet_assign_id,
              label: obj.course_name_with_code,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const handleChangeColumns = () => {
    if (values.leaveType !== "") {
      const requiredTemp = {
        leave: {
          add: ["fromDate", "toDate"],
          remove: ["halfDayDate", "shift", "compOffDate", "leaveDate"],
        },
        halfday: {
          add: ["halfDayDate", "shift"],
          remove: ["fromDate", "toDate", "compOffDate", "leaveDate"],
        },
        compoff: {
          add: ["compOffDate", "leaveDate"],
          remove: ["fromDate", "toDate", "halfDayDate", "shift"],
        },
      };

      requiredTemp[values.leaveType].add.forEach((obj) => {
        if (requiredFields.includes(obj) === false) {
          requiredFields.push(obj);
        }
      });

      requiredTemp[values.leaveType].remove.forEach((obj) => {
        if (requiredFields.includes(obj) === true) {
          requiredFields.splice(requiredFields.indexOf(obj), 1);
        }
      });
    }

    setValues((prev) => ({
      ...prev,
      leaveId: values.leaveType === "compoff" ? 10 : "",
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "fromDate") {
      setValues((prev) => ({
        ...prev,
        toDate: newValue,
      }));
    }

    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
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

  const validateTimeTable = () => {
    if (timeTableData.length > 0) {
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const temp = {};

    temp.active = true;
    temp.leave_id = values.leaveId;
    temp.from_date = values.fromDate
      ?.substr(0, 10)
      ?.split("-")
      ?.reverse()
      ?.join("-");
    temp.to_date = values.toDate
      ?.substr(0, 10)
      ?.split("-")
      ?.reverse()
      ?.join("-");
    temp.no_of_days_applied = values.appliedDays;
    temp.leave_comments = values.reason;
    temp.emp_id = [empData?.emp_id];
    temp.approved_status = 1;
    temp.leave_approved_by1 = empData.leave_approver1_emp_id;
    temp.leave_approved_by2 = empData.leave_approver2_emp_id;
    temp.year = new Date(values.fromDate).getFullYear();

    if (values.leaveType === "halfday") {
      temp.from_date = values.halfDayDate
        ?.substr(0, 10)
        ?.split("-")
        ?.reverse()
        ?.join("-");
      temp.to_date = values.halfDayDate
        ?.substr(0, 10)
        ?.split("-")
        ?.reverse()
        ?.join("-");
      temp.no_of_days_applied = 0.5;
      temp.shift = values.shift;
    }

    if (values.leaveType === "compoff") {
      temp.from_date = values.leaveDate
        ?.substr(0, 10)
        ?.split("-")
        ?.reverse()
        ?.join("-");
      temp.to_date = values.leaveDate
        ?.substr(0, 10)
        ?.split("-")
        ?.reverse()
        ?.join("-");
      temp.compoff_worked_date = values.compOffDate;
      temp.no_of_days_applied = 1;
    }

    setLoading(true);

    await axios
      .post(`/api/emailToApproverForApprovingLeaveRequest/${userId}`)
      .then((emailRes) => {
        setAlertMessage({
          severity: "error",
          message: "Failed to upload the mail to approvers !!",
        });
        setAlertOpen(true);
      })
      .catch((emailErr) => console.error(emailErr));

    const leaveApplyIds = await axios
      .post(`/api/leaveApply`, temp)
      .then((res) => res?.data?.data?.map((obj) => obj.leave_apply_id))
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
      });

    let message = "";

    if (values.document !== "") {
      const dataArray = new FormData();
      dataArray.append("file", values.document);
      dataArray.append("leave_apply_id", leaveApplyIds.toString());

      await axios
        .post(`/api/leaveApplyUploadFile`, dataArray)
        .then((res) => {})
        .catch((err) => {
          console.error(err);
          setAlertMessage({
            severity: "error",
            message: "Failed to upload the document !!",
          });
          setAlertOpen(true);
        });
    }

    if (swappingEmpId !== 0) {
      const getMessage = await axios
        .post(
          `/api/emailToAlternateStaffSelectedByLeaveApplier/${swappingEmpId}/${leaveApplyIds[0]}`
        )
        .then((emailRes) => {
          return "success";
        })
        .catch((emailErr) => {
          setAlertMessage({
            severity: "error",
            message: "Failed to send the mail to aleternative staff !!",
          });
          setAlertOpen(true);
        });

      message = getMessage;
    } else {
      message = "success";
    }

    if (message === "success") {
      setAlertMessage({
        severity: "success",
        message: "Leave request has been sent !!",
      });
      setAlertOpen(true);
      setLoading(false);
      setValues(initialValues);
    } else {
      setAlertMessage({
        severity: "error",
        message: "Something went wrong !!",
      });
      setAlertOpen(true);
    }
  };

  const handleActive = (id) => {
    const handleToggle = async () => {
      await axios
        .delete(`/api/academic/deactivateTimeTableEmployee/${id}`)
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Time table deleted successfully !!",
            });
            setAlertOpen(true);
            getTimeTableDetails();
          }
        })
        .catch((err) => console.error(err));
    };

    setModalOpen(true);
    setModalContent({
      title: "Deactivate",
      message: "Do you want to make it Inactive?",
      buttons: [
        { name: "Yes", color: "primary", func: handleToggle },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
  };

  const handleSwap = async (data) => {
    await axios
      .get(
        `/api/employee/getEmployeesUnderDepartment/${data.emp_id}/${data.selected_date}/${data.time_slots_id}`
      )
      .then((res) => {
        setSwapEmpOptions(
          res.data.data.map((obj) => ({
            value: obj.userDetail_id,
            label: obj.employeeName,
          }))
        );

        setSwapEmpData(res.data.data);
      })
      .catch((err) => console.error(err));

    setRowData(data);
    setSwapWrapperOpen(true);
  };

  const handleSwapCreate = async () => {
    await axios
      .put(
        `/api/academic/updateEmployeeIdForSwapping/${rowData.time_table_id}/${rowData.emp_id}/${swappingEmpId}/${values.courseId}`
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({
            severity: "success",
            message: "Course assigned successfully !!",
          });
          setAlertOpen(true);
          setSwapWrapperOpen(false);
          getTimeTableDetails();
        } else {
          setAlertMessage({
            severity: "error",
            message: res.data ? res.data.message : "An error occured",
          });
          setAlertOpen(true);
          setSwapWrapperOpen(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleAllowLeaves = () => {
    if (leaveTypeData[values.leaveId].shortName === "OD") {
      return convertUTCtoTimeZone(moment().subtract(2, "day"));
    } else {
      return convertUTCtoTimeZone(moment().add(2, "day"));
    }
  };

  const getHolidays = async () => {
    if (values.leaveId) {
      await axios
        .get("/api/HolidayCalender")
        .then((res) => {
          setHolidays(
            res.data.data
              .filter(
                (obj) =>
                  obj.leave_type_short === "GH" || obj.leave_type_short === "DH"
              )
              .map((item) => convertUTCtoTimeZone(item.fromDate)?.slice(0, 10))
          );
        })
        .catch((err) => console.error(err));
    }
  };

  const disableWeekends = (date) => {
    const getDate = moment(convertUTCtoTimeZone(date)).format();
    const checkHoliday = holidays?.includes(getDate.slice(0, 10));

    return moment(convertUTCtoTimeZone(date)).day() === 0 || checkHoliday;
  };

  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      <ModalWrapper
        open={swapWrapperOpen}
        setOpen={setSwapWrapperOpen}
        maxWidth={900}
      >
        <Box mt={4}>
          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="swapEmpId"
                label="Employee"
                value={values.swapEmpId}
                options={swapEmpOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="courseId"
                label="Course"
                value={values.courseId}
                options={courseOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button variant="contained" onClick={handleSwapCreate}>
                Swap
              </Button>
            </Grid>
          </Grid>
        </Box>
      </ModalWrapper>

      <Box m={{ md: 3 }}>
        <Card elevation={3}>
          <CardHeader
            avatar={
              <IconButton>
                <VerifiedUserIcon sx={{ color: "#f7f7f7", fontSize: 30 }} />
              </IconButton>
            }
            title="Apply Leave"
            titleTypographyProps={{ variant: "subtitle2", fontSize: 14 }}
            sx={{
              backgroundColor: "auzColor.main",
              color: "headerWhite.main",
              padding: 1,
            }}
            subheader={empData?.employee_name + " - " + empData?.empcode}
            subheaderTypographyProps={{ variant: "body2", color: "#f7f7f7" }}
          />
          <CardContent>
            <Grid
              container
              columnSpacing={{ md: 4, xs: 3 }}
              rowSpacing={{ md: 4, xs: 3 }}
            >
              <Grid item xs={12} md={4}>
                <CustomSelect
                  name="leaveType"
                  label="Leave Type"
                  value={values.leaveType}
                  items={[
                    { value: "leave", label: "Full Day" },
                    { value: "halfday", label: "Half Day" },
                    // { value: "compoff", label: "Comp Off" },
                  ]}
                  handleChange={handleChange}
                  required
                />
              </Grid>

              {values.leaveType && values.leaveType !== "compoff" ? (
                <Grid item xs={12} md={4}>
                  <CustomAutocomplete
                    name="leaveId"
                    label="Leave Category"
                    value={values.leaveId}
                    options={leaveTypeOptions}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                </Grid>
              ) : (
                <></>
              )}

              {values.leaveId && leaveTypeData[values.leaveId].kitty ? (
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="pendingLeaves"
                    label="Leave Available"
                    value={values.pendingLeaves}
                    disabled
                  />
                </Grid>
              ) : (
                <></>
              )}

              {values.leaveType === "leave" && values.leaveId ? (
                <>
                  <Grid item xs={12} md={4}>
                    <CustomDatePicker
                      name="fromDate"
                      label="From Date"
                      value={values.fromDate}
                      handleChangeAdvance={handleChangeAdvance}
                      minDate={handleAllowLeaves()}
                      shouldDisableDate={disableWeekends}
                    />
                  </Grid>

                  {values.fromDate ? (
                    <Grid item xs={12} md={4}>
                      <CustomDatePicker
                        name="toDate"
                        label="To Date"
                        value={values.toDate}
                        handleChangeAdvance={handleChangeAdvance}
                        minDate={values.fromDate}
                        maxDate={moment(values.fromDate)
                          .endOf("month")
                          .format()}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}
                </>
              ) : values.leaveType === "halfday" ? (
                <>
                  <Grid item xs={12} md={4}>
                    <CustomDatePicker
                      name="halfDayDate"
                      label="Date"
                      value={values.halfDayDate}
                      handleChangeAdvance={handleChangeAdvance}
                      disablePast
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <CustomSelect
                      name="shift"
                      label="Shift"
                      value={values.shift}
                      items={[
                        { value: "FirstHalf", label: "First Half" },
                        { value: "SecondHalf", label: "Second Half" },
                      ]}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              ) : values.leaveType === "compoff" ? (
                <>
                  <Grid item xs={12} md={4}>
                    <CustomDatePicker
                      name="compOffDate"
                      label="Compoff worked Date"
                      value={values.compOffDate}
                      handleChangeAdvance={handleChangeAdvance}
                    />
                  </Grid>

                  {values.compOffDate ? (
                    <Grid item xs={12} md={4}>
                      <CustomDatePicker
                        name="leaveDate"
                        label="Leave Date"
                        value={values.leaveDate}
                        handleChangeAdvance={handleChangeAdvance}
                        minDate={convertUTCtoTimeZone(
                          moment(values.compOffDate).add(1, "day")
                        )}
                        maxDate={moment(values.leaveDate)
                          .endOf("month")
                          .format()}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              {values.fromDate && values.toDate ? (
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="appliedDays"
                    label="Days Applied"
                    value={values.appliedDays}
                    disabled
                  />
                </Grid>
              ) : (
                <></>
              )}

              {values.leaveId ? (
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    name="reason"
                    label="Reason"
                    value={values.reason}
                    handleChange={handleChange}
                    checks={checks.reason}
                    errors={errorMessages.reason}
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              ) : (
                <></>
              )}

              {values.leaveId &&
              leaveTypeData[values.leaveId]?.attachment === true ? (
                <Grid item xs={12} md={3}>
                  <CustomFileInput
                    name="document"
                    label="Document"
                    helperText="PDF - smaller than 2 MB"
                    file={values.document}
                    handleFileDrop={handleFileDrop}
                    handleFileRemove={handleFileRemove}
                    checks={checks.document}
                    errors={errorMessages.document}
                  />
                </Grid>
              ) : (
                <></>
              )}

              {timeTableData.length > 0 ? (
                <Grid item xs={12}>
                  <TableContainer component={Paper} elevation={3}>
                    <Table size="small" className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell>Date</StyledTableCell>
                          <StyledTableCell>WeekDay</StyledTableCell>
                          <StyledTableCell>Time Slot</StyledTableCell>
                          <StyledTableCell>Specialization</StyledTableCell>
                          <StyledTableCell>Course</StyledTableCell>
                          <StyledTableCell>Active</StyledTableCell>
                          <StyledTableCell>Swap</StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {timeTableData?.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{obj.employee_name}</TableCell>
                              <TableCell>
                                {obj.selected_date
                                  ?.split("-")
                                  ?.reverse()
                                  ?.join("-")}
                              </TableCell>
                              <TableCell>{obj.week_day}</TableCell>
                              <TableCell>{obj.timeSlots}</TableCell>
                              <TableCell>
                                {obj.program_specialization_short_name}
                              </TableCell>
                              <TableCell>{obj.course_short_name}</TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleActive(obj.id)}
                                  sx={{ padding: 0 }}
                                >
                                  <HighlightOffIcon color="error" />
                                </IconButton>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleSwap(obj)}
                                  sx={{ padding: 0 }}
                                >
                                  <SwapHorizIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              ) : (
                <></>
              )}

              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={
                    loading || !requiredFieldsValid() || !validateTimeTable()
                  }
                  sx={{
                    backgroundColor: "auzColor.main",
                    ":hover": {
                      bgcolor: "auzColor.main",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    <Typography variant="subtitle2">Apply</Typography>
                  )}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default LeaveApplyForm;
