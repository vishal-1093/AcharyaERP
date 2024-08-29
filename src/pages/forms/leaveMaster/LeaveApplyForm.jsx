import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import CustomModal from "../../../components/CustomModal";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import { CheckLeaveLockDate } from "../../../utils/CheckLeaveLockDate";

const initialValues = {
  leaveId: null,
  pendingLeaves: "",
  leaveType: "",
  fromDate: null,
  toDate: null,
  appliedDays: "",
  shift: "",
  reason: "",
  document: "",
  compOffDate: null,
  leaveDate: null,
};

const requiredFields = ["leaveId", "reason"];

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const leaveTypeList = [
  { value: "leave", label: "Full Day" },
  { value: "halfday", label: "Half Day" },
];

const shiftList = [
  { value: "FirstHalf", label: "First Half" },
  { value: "SecondHalf", label: "Second Half" },
];

function LeaveApplyForm() {
  const [values, setValues] = useState(initialValues);
  const [empData, setEmpData] = useState([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmContent, setConfirmContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [restrictedHolidays, setRestrictedHolidays] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const maxLength = 150;

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  useEffect(() => {
    getPendingLeaves();
    handleRequiredFields();
  }, [values.leaveId, values.leaveType]);

  useEffect(() => {
    calculateAppliedDays();
  }, [values.fromDate, values.toDate]);

  const getEmployeeData = async () => {
    try {
      const response = await axios.get(
        `/api/employee/getEmployeeDataByUserID/${userId}`
      );
      const responseData = response.data.data;
      handleBreadcrumbs(responseData);
      getLeaveTypeOptions(responseData.emp_id);
      setEmpData(responseData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed load the employee data !!",
      });
      setAlertOpen(true);
    }
  };

  const handleBreadcrumbs = (responseData) => {
    const breadCrumbsList = [
      { name: "Leave History", link: "/LeaveApplyIndex" },
      { name: "Apply Leave" },
      { name: responseData.employee_name },
      { name: responseData.empcode },
    ];
    setCrumbs(breadCrumbsList);
  };

  const getLeaveTypeOptions = async (empId) => {
    try {
      const response = await axios.get(
        `/api/leaveTypesAvailableForEmployees/${empId}`
      );
      const responseData = response.data.data;
      if (responseData.length > 0) {
        const createLeaveTypeData = responseData.reduce((acc, obj) => {
          const {
            leave_id,
            leave_type_attachment_required,
            is_attendance,
            type,
            leave_type_short,
          } = obj;
          acc[leave_id] = {
            attachment: leave_type_attachment_required,
            kitty: is_attendance,
            type: type,
            shortName: leave_type_short,
          };
          return acc;
        }, {});

        const optionData = [];
        responseData.forEach((obj) => {
          optionData.push({
            value: obj.leave_id,
            label: obj.leave_type,
          });
        });

        setLeaveTypeOptions(optionData);
        setLeaveTypeData(createLeaveTypeData);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed load the leave type data !!",
      });
      setAlertOpen(true);
    }

    if (empData?.emp_id) {
      await axios
        .get(`/api/leaveTypesAvailableForEmployees/${empId}`)
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
    const { leaveId } = values;

    try {
      if (leaveId && leaveTypeData[leaveId].type !== "Attendence") {
        const response = await axios.get(
          `/api/getUpdatedDaysCount/${empData.emp_id}/${leaveId}`
        );
        const reponseData = response.data.data;
        if (Number(reponseData) > 0) {
          setValues((prev) => ({
            ...prev,
            pendingLeaves: Number(reponseData),
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
      }
      getHolidays();
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to fetch the available leaves !!",
      });
      setAlertOpen(true);
      setValues((prev) => ({
        ...prev,
        leaveId: "",
      }));
    }
  };

  const getHolidays = async () => {
    try {
      if (values.leaveId) {
        const response = await axios.get("/api/HolidayCalender");
        const filterData = response.data.data.filter(
          (obj) =>
            obj.leave_type_short === "GH" ||
            (obj.leave_type_short === "DH" &&
              obj.schoolId === empData.school_id)
        );
        const holidays = [];
        const restrictHolidays = [];
        filterData.forEach((obj) => {
          holidays.push(obj.fromDate?.slice(0, 10));
        });
        const filterRestritHolidays = response.data.data.filter(
          (obj) => obj.leave_type_short === "RH"
        );
        filterRestritHolidays.forEach((obj) => {
          restrictHolidays.push(obj.fromDate?.slice(0, 10));
        });
        setHolidays(holidays);
        setRestrictedHolidays(restrictHolidays);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to fetch the available leaves !!",
      });
      setAlertOpen(true);
    }
  };

  const handleAllowLeaves = () =>
    leaveTypeData[values.leaveId].shortName === "OD"
      ? convertUTCtoTimeZone(moment().subtract(2, "day"))
      : convertUTCtoTimeZone(moment().add(2, "day"));

  const disableWeekends = (date) => {
    const localDate = moment(convertUTCtoTimeZone(date)).startOf("day");
    const formattedDate = localDate.format("YYYY-MM-DD");

    const isWeekend = localDate.day() === 0;
    const isHoliday = holidays.includes(formattedDate);
    const isRestrictedHoliday = restrictedHolidays.includes(formattedDate);

    if (leaveTypeData[values.leaveId].shortName === "RH") {
      return !isRestrictedHoliday;
    }

    return isWeekend || isHoliday;
  };

  const calculateAppliedDays = async () => {
    const { fromDate, toDate } = values;

    try {
      if (fromDate && toDate) {
        const month = moment(fromDate).format("MM");
        const year = moment(toDate).format("YYYY");

        const checkDate = await CheckLeaveLockDate(month, year);

        if (checkDate) {
          setValues((prev) => ({
            ...prev,
            fromDate: null,
            toDate: null,
          }));
          setAlertMessage({
            severity: "error",
            message:
              "You are unable to apply for leave as the leave lock date has passed !!",
          });
          setAlertOpen(true);
        } else {
          const oneDay = 1000 * 60 * 60 * 24;
          const timeDifference =
            new Date(toDate).getTime() - new Date(fromDate).getTime();

          const dateDifference = Math.round(timeDifference / oneDay) + 1;

          if (dateDifference > 0)
            setValues((prev) => ({
              ...prev,
              appliedDays: dateDifference,
            }));
        }
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "An error occured",
      });
      setAlertOpen(true);
    }
  };

  const handleRequiredFields = () => {
    const { leaveId, leaveType } = values;
    if (leaveId) {
      const addFields = new Set(["leaveType", "fromDate", "toDate"]);
      const removeFields = new Set();

      if (leaveType === "halfday") {
        addFields.add("shift");
      } else {
        removeFields.add("shift");
      }

      if (leaveTypeData[leaveId]?.attachment) {
        addFields.add("document");
      } else {
        removeFields.add("document");
      }

      if (leaveTypeData[leaveId]?.shortName === "CP") {
        addFields.add("compOffDate").add("leaveDate");
        removeFields.add("fromDate").add("toDate");
      }

      if (leaveTypeData[leaveId]?.shortName === "PR") {
        addFields.add("shift");
        removeFields.add("leaveType").add("toDate");
      }

      addFields?.forEach((obj) => {
        if (!requiredFields.includes(obj)) {
          requiredFields.push(obj);
        }
      });

      removeFields?.forEach((obj) => {
        if (requiredFields.includes(obj)) {
          requiredFields.splice(requiredFields.indexOf(obj), 1);
        }
      });
    }
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "reason" && value.length > maxLength) return;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    const { leaveId } = values;
    if (name === "fromDate" && leaveTypeData[leaveId].shortName !== "PR") {
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

  const handleCreate = async () => {
    const {
      leaveId,
      fromDate,
      toDate,
      appliedDays,
      shift,
      reason,
      leaveType,
      document,
      compOffDate,
      leaveDate,
    } = values;

    try {
      setLoading(true);

      const postData = {
        active: true,
        leave_id: leaveId,
        from_date:
          leaveTypeData[leaveId].shortName === "CP"
            ? moment(compOffDate).format("DD-MM-YYYY")
            : moment(fromDate).format("DD-MM-YYYY"),
        to_date:
          leaveTypeData[leaveId].shortName === "CP"
            ? moment(leaveDate).format("DD-MM-YYYY")
            : moment(toDate).format("DD-MM-YYYY"),
        no_of_days_applied: leaveType === "halfday" ? 0.5 : appliedDays,
        shift,
        leave_comments: reason,
        emp_id: [empData.emp_id],
        approved_status: 1,
        leave_approved_by1: empData.leave_approver1_emp_id,
        leave_approved_by2: empData.leave_approver2_emp_id,
        year:
          leaveTypeData[leaveId].shortName === "CP"
            ? moment(leaveDate).format("YYYY")
            : moment(fromDate).format("YYYY"),
      };

      const response = await axios.post("/api/leaveApply", postData);
      const leaveAppliedIds = [];
      response.data.data.forEach((obj) => {
        leaveAppliedIds.push(obj.leave_apply_id);
      });

      if (leaveAppliedIds.length > 0) {
        const emailNotificationPromise = axios.post(
          `/api/emailToApproverForApprovingLeaveRequest/${userId}`
        );

        const fileUploadPromise = document
          ? (async () => {
              const dataArray = new FormData();
              dataArray.append("file", document);
              dataArray.append("leave_apply_id", leaveAppliedIds.toString());
              return axios.post("/api/leaveApplyUploadFile", dataArray);
            })()
          : Promise.resolve();

        await Promise.all([fileUploadPromise]);

        setAlertMessage({
          severity: "success",
          message: "The leave request has been sent successfully !!",
        });
        setAlertOpen(true);
      }
      setValues(initialValues);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "An error occured",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setConfirmContent({
      title: "",
      message: "Would you like to confirm?",
      buttons: [
        { name: "Yes", color: "primary", func: handleCreate },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setConfirmOpen(true);
  };

  return (
    <>
      <CustomModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={confirmContent.title}
        message={confirmContent.message}
        buttons={confirmContent.buttons}
      />

      <Box
        sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}
      >
        <FormPaperWrapper>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="leaveId"
                label="Leave Category"
                value={values.leaveId}
                options={leaveTypeOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            {values.leaveId && (
              <>
                {leaveTypeData[values.leaveId].kitty && (
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="pendingLeaves"
                      label="Leave Available"
                      value={values.pendingLeaves}
                      disabled
                    />
                  </Grid>
                )}

                {leaveTypeData[values.leaveId].shortName !== "RH" &&
                leaveTypeData[values.leaveId].shortName !== "PR" ? (
                  <Grid item xs={12} md={3}>
                    <CustomSelect
                      name="leaveType"
                      label="Leave Type"
                      value={values.leaveType}
                      items={leaveTypeList}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                ) : (
                  <></>
                )}

                {leaveTypeData[values.leaveId]?.shortName === "CP" ? (
                  <>
                    <Grid item xs={12} md={3}>
                      <CustomDatePicker
                        name="compOffDate"
                        label="Compoff Worked Date"
                        value={values.compOffDate}
                        handleChangeAdvance={handleChangeAdvance}
                        disableFuture
                      />
                    </Grid>

                    {values.compOffDate && (
                      <Grid item xs={12} md={3}>
                        <CustomDatePicker
                          name="leaveDate"
                          label="Leave Date"
                          value={values.leaveDate}
                          handleChangeAdvance={handleChangeAdvance}
                          minDate={handleAllowLeaves()}
                          maxDate={moment().endOf("month").format()}
                          shouldDisableDate={disableWeekends}
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={3}>
                      <CustomDatePicker
                        name="fromDate"
                        label="From Date"
                        value={values.fromDate}
                        handleChangeAdvance={handleChangeAdvance}
                        minDate={handleAllowLeaves()}
                        shouldDisableDate={disableWeekends}
                      />
                    </Grid>

                    {values.fromDate && values.leaveType === "leave" && (
                      <Grid item xs={12} md={3}>
                        <CustomDatePicker
                          name="toDate"
                          label="To Date"
                          value={values.toDate}
                          handleChangeAdvance={handleChangeAdvance}
                          minDate={values.fromDate}
                          maxDate={moment(values.fromDate)
                            .endOf("month")
                            .format()}
                          shouldDisableDate={disableWeekends}
                        />
                      </Grid>
                    )}
                  </>
                )}

                {values.leaveType === "halfday" ||
                leaveTypeData[values.leaveId].shortName === "PR" ? (
                  <Grid item xs={12} md={3}>
                    <CustomSelect
                      name="shift"
                      label="Shift"
                      value={values.shift}
                      items={shiftList}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                ) : (
                  <></>
                )}

                {values.appliedDays && (
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="appliedDays"
                      label="Days Applied"
                      value={values.appliedDays}
                      disabled
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={3}>
                  <CustomTextField
                    name="reason"
                    label="Reason"
                    value={values.reason}
                    handleChange={handleChange}
                    helperText={`Remaining characters : ${getRemainingCharacters(
                      "reason"
                    )}`}
                    multiline
                    required
                  />
                </Grid>

                {leaveTypeData[values.leaveId]?.attachment === true && (
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
                )}
              </>
            )}

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  loading || !requiredFieldsValid()
                  //  || !validateTimeTable()
                }
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
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default LeaveApplyForm;
