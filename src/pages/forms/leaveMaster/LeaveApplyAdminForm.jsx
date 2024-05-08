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
  Typography,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import { convertUTCtoTimeZone } from "../../../utils/DateTimeUtils";
import dayjs from "dayjs";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import useAlert from "../../../hooks/useAlert";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import moment from "moment";

const initialValues = {
  empId: [],
  leaveType: "",
  leaveId: null,
  pendingLeaves: "",
  fromDate: null,
  toDate: null,
  halfDayDate: null,
  shift: "",
  leaveDate: null,
  appliedDays: "",
  reason: "",
  document: "",
};

const requiredFields = ["empId", "leaveId"];

const permissions = ["PR"];

function LeaveApplyAdminForm() {
  const [values, setValues] = useState(initialValues);
  const [empOptions, setEmpOptions] = useState([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    reason: [values.reason !== "", values.reason.length < 100],
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    reason: ["This field is required", "Maximum characters 100"],
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getAllEmployeeData();
  }, []);

  useEffect(() => {
    getLeaveTypeOptions();
  }, [values.empId]);

  useEffect(() => {
    handleChangeColumns();
  }, [values.leaveType]);

  useEffect(() => {
    getPendingLeaves();
    handleRequiredFields();
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

  const getAllEmployeeData = async () => {
    await axios
      .get(`/api/getAllEmployeesForLeaveApply`)
      .then((res) => {
        setEmpOptions(
          res.data.data.map((obj) => ({
            value: obj.emp_id,
            label: obj.employeeDetails?.replace(/,/g, "-"),
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getLeaveTypeOptions = async () => {
    if (values.empId) {
      const leaveUrl =
        values.empId.length > 1
          ? "/api/getLeaveTypeForAttendence"
          : `/api/leaveTypesAvailableForEmployeesForHrScreen/${values.empId}`;
      await axios
        .get(leaveUrl)
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
      if (
        leaveTypeData[values.leaveId].type !== "Attendence" &&
        values.empId.length === 1
      ) {
        await axios
          .get(`/api/getUpdatedDaysCount/${values.empId[0]}/${values.leaveId}`)
          .then((res) => {
            if (Number(res.data.data) > 0) {
              setValues((prev) => ({
                ...prev,
                ["pendingLeaves"]: Number(res.data.data),
              }));
            } else {
              setAlertMessage({
                severity: "error",
                message: "You don't have enough leaves to apply !!",
              });
              setAlertOpen(true);

              setValues((prev) => ({
                ...prev,
                ["leaveId"]: "",
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
        ["toDate"]: newValue,
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

  const handleCreate = async () => {
    const getLeaveApprovers = await axios
      .get(`/api/getLeaveApproversForEmployees/${values.empId}`)
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

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
    temp.emp_id = values.empId;
    temp.approved_status = 1;
    temp.leave_approved_by1 = getLeaveApprovers?.leave_approver1?.emp_id;
    temp.leave_approved_by2 = getLeaveApprovers?.leave_approver2?.emp_id;
    temp.year = new Date(values.fromDate).getFullYear();

    setLoading(true);

    await axios
      .post(`/api/leaveApply`, temp)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          //   Document upload
          const leaveApplyIds = res?.data?.data?.map(
            (obj) => obj.leave_apply_id
          );
          const dataArray = new FormData();
          dataArray.append("file", values.document);
          dataArray.append("leave_apply_id", leaveApplyIds.toString());

          if (values.document !== "") {
            axios
              .post(`/api/leaveApplyUploadFile`, dataArray)
              .then((res) => {})
              .catch((err) => {
                setAlertMessage({
                  severity: "error",
                  message: "Failed to upload the document !!",
                });
                setAlertOpen(true);
              });
          }

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
            message: res.data ? res.data.message : "An error occured",
          });
          setAlertOpen(true);
          setLoading(false);
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
        setLoading(false);
      });
  };

  return (
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
        />

        <CardContent>
          <Grid
            container
            columnSpacing={{ md: 4, xs: 3 }}
            rowSpacing={{ md: 4, xs: 3 }}
          >
            <Grid item xs={12} md={4}>
              <CustomMultipleAutocomplete
                name="empId"
                label="Employee"
                value={values.empId}
                options={empOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

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
                {values.leaveId && leaveTypeData[values.leaveId]?.kitty ? (
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
                    required
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
                      required
                    />
                  </Grid>
                ) : (
                  <></>
                )}
              </>
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

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={loading || !requiredFieldsValid()}
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
  );
}

export default LeaveApplyAdminForm;
