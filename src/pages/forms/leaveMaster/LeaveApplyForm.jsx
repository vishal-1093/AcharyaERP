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
  styled,
  tableCellClasses,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import moment from "moment";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CustomModal from "../../../components/CustomModal";
import ModalWrapper from "../../../components/ModalWrapper";

const initialValues = {
  leaveType: "",
  leaveId: null,
  pendingLeaves: "",
  fromDate: null,
  toDate: null,
  appliedDays: 0,
  shift: "",
  leaveDate: null,
  reason: "",
  document: "",
  swapEmpId: null,
  courseId: null,
};

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const permissions = ["PR"];

const requiredFields = ["leaveId", "reason"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgba(74, 87, 169, 0.1)",
    color: "#46464E",
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

function LeaveApplyForm() {
  const [values, setValues] = useState(initialValues);
  const [empData, setEmpData] = useState([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [timeTableData, setTimeTableData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [swapEmpData, setSwapEmpData] = useState([]);
  const [swappingEmpId, setSwappingEmpId] = useState(0);
  const [swapWrapperOpen, setSwapWrapperOpen] = useState(false);
  const [swapEmpOptions, setSwapEmpOptions] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    reason: [values.reason !== "", values.reason.length < 150],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

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
    handleRequiredFields();
  }, [values.leaveId]);

  useEffect(() => {
    handleChangeColumns();
  }, [values.leaveType]);

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

            const optionData = [];
            res.data.data.forEach((obj) => {
              optionData.push({
                value: obj.leave_id,
                label: obj.leave_type,
              });
            });

            setLeaveTypeOptions(optionData);
            setLeaveTypeData(temp);
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
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
            setValues((prev) => ({
              ...prev,
              leaveId: "",
            }));
          });
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

  const getHolidays = async () => {
    if (values.leaveId) {
      await axios
        .get("/api/HolidayCalender")
        .then((res) => {
          const filterData = res.data.data.filter(
            (obj) =>
              (obj.leave_type_short === "GH" ||
                obj.leave_type_short === "DH") &&
              obj.schoolId === empData.school_id
          );
          const holidays = [];
          filterData.forEach((obj) => {
            holidays.push(convertUTCtoTimeZone(obj.fromDate)?.slice(0, 10));
          });
          setHolidays(holidays);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleAllowLeaves = () => {
    if (leaveTypeData[values.leaveId].shortName === "OD") {
      return convertUTCtoTimeZone(moment().subtract(2, "day"));
    } else {
      return convertUTCtoTimeZone(moment().add(2, "day"));
    }
  };

  const disableWeekends = (date) => {
    const getDate = moment(convertUTCtoTimeZone(date)).format();
    const checkHoliday = holidays?.includes(getDate.slice(0, 10));

    return moment(convertUTCtoTimeZone(date)).day() === 0 || checkHoliday;
  };

  const handleChangeColumns = () => {
    if (values.leaveType !== "") {
      const requiredTemp = {
        leave: {
          add: ["fromDate", "toDate"],
          remove: ["shift"],
        },
        halfday: {
          add: ["fromDate", "shift"],
          remove: ["toDate"],
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
      ["toDate"]: null,
    }));
  };

  const handleRequiredFields = () => {
    if (values.leaveId) {
      let value = "";

      if (
        permissions.includes(leaveTypeData[values.leaveId]?.shortName) === true
      ) {
        value = "permission";
      } else {
        value = "other";
      }

      const requiredTemp = {
        permission: {
          add: ["fromDate", "shift"],
          remove: ["toDate"],
        },
        other: {
          add: ["fromDate", "toDate"],
          remove: ["shift"],
        },
      };

      requiredTemp[value].add.forEach((obj) => {
        if (requiredFields.includes(obj) === false) {
          requiredFields.push(obj);
        }
      });

      requiredTemp[value].remove.forEach((obj) => {
        if (requiredFields.includes(obj) === true) {
          requiredFields.splice(requiredFields.indexOf(obj), 1);
        }
      });
    }
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
  const handleFileRemove = (name, file) => {
    setValues((prev) => ({
      ...prev,
      [name]: "",
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
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.userDetail_id,
            label: obj.employeeName,
          });
        });
        setSwapEmpOptions(optionData);

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

  const handleCreate = async () => {
    const temp = {};

    temp.active = true;
    temp.leave_id = values.leaveId;
    temp.from_date = moment(values.fromDate).format("DD-MM-YYYY");
    temp.to_date = moment(values.toDate).format("DD-MM-YYYY");
    temp.no_of_days_applied = values.appliedDays;
    if (leaveTypeData[values.leaveId].shortName === "PR") {
      temp.shift = values.shift;
    }
    if (values.leaveType === "halfday") {
      temp.to_date = moment(values.fromDate).format("DD-MM-YYYY");
      temp.no_of_days_applied = 0.5;
      temp.shift = values.shift;
    }
    temp.leave_comments = values.reason;
    temp.emp_id = [empData?.emp_id];
    temp.approved_status = 1;
    temp.leave_approved_by1 = empData.leave_approver1_emp_id;
    temp.leave_approved_by2 = empData.leave_approver2_emp_id;
    temp.year = new Date(values.fromDate).getFullYear();

    setLoading(true);

    let message = [];
    let count = 2;

    const leaveApplyIds = await axios
      .post(`/api/leaveApply`, temp)
      .then((res) => {
        message.push(true);
        const temp = [];
        res.data.data.forEach((obj) => {
          temp.push(obj.leave_apply_id);
        });
        return temp;
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
        setLoading(false);
        message.push(false);
      });

    if (leaveApplyIds.length > 0) {
      await axios
        .post(`/api/emailToApproverForApprovingLeaveRequest/${userId}`)
        .then((res) => {
          message.push(true);
        })
        .catch((err) => {
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
          message.push(false);
        });

      if (values.document !== "") {
        const dataArray = new FormData();
        dataArray.append("file", values.document);
        dataArray.append("leave_apply_id", leaveApplyIds.toString());
        await axios
          .post(`/api/leaveApplyUploadFile`, dataArray)
          .then((res) => {
            message.push(true);
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
            message.push(false);
          });
        count += 1;
      }

      if (swappingEmpId !== 0) {
        await axios
          .post(
            `/api/emailToAlternateStaffSelectedByLeaveApplier/${swappingEmpId}/${leaveApplyIds[0]}`
          )
          .then((res) => {
            message.push(true);
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
            message.push(false);
          });
        count += 1;
      }
    }

    setAlertMessage({
      severity:
        message.length === count && message.includes(false) === false
          ? "success"
          : "error",
      message:
        message.length === count && message.includes(false) === false
          ? "Leave request has been sent !!"
          : "Something went wrong please contat admin !!",
    });
    setAlertOpen(true);
    setLoading(false);
    setValues(initialValues);
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
              backgroundColor: "blue.main",
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
                <CustomAutocomplete
                  name="leaveId"
                  label="Leave Category"
                  value={values.leaveId}
                  options={leaveTypeOptions}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>

              {values.leaveId ? (
                <>
                  {leaveTypeData[values.leaveId].kitty ? (
                    <>
                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          name="pendingLeaves"
                          label="Leave Available"
                          value={values.pendingLeaves}
                          disabled
                        />
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}

                  {permissions.includes(
                    leaveTypeData[values.leaveId]?.shortName
                  ) === false ? (
                    <Grid item xs={12} md={4}>
                      <CustomSelect
                        name="leaveType"
                        label="Leave Type"
                        value={values.leaveType}
                        items={[
                          { value: "leave", label: "Full Day" },
                          { value: "halfday", label: "Half Day" },
                        ]}
                        handleChange={handleChange}
                        required
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}

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

                  {values.fromDate && values.leaveType === "leave" ? (
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

                  {values.fromDate &&
                  (values.leaveType === "halfday" ||
                    leaveTypeData[values.leaveId]?.shortName === "PR") ? (
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
                  ) : (
                    <></>
                  )}

                  {values.fromDate &&
                  values.toDate &&
                  values.leaveType === "leave" ? (
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
                        <Table size="small">
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
                </>
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
                    backgroundColor: "blue.main",
                    ":hover": {
                      bgcolor: "blue.main",
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
