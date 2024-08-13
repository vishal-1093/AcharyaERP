import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() => import("../../../components/Inputs/CustomTextField"));
const CustomAutocomplete = lazy(() => import("../../../components/Inputs/CustomAutocomplete"));
const CustomDatePicker = lazy(() => import("../../../components/Inputs/CustomDatePicker"));

const initialValues = {
  leaveCategoryId: "",
  pendingLeaves: "",
  fromDate: null,
  toDate: null,
  totalDays: null,
  reason: "",
  staffEmail: "",
};
const requiredFields = ["leaveCategoryId", "fromDate", "toDate", "staffEmail"];

function LeaveApplyForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    fromDate: [values.fromDate !== null],
    toDate: [values.toDate !== null],
    reason: [values.reason !== ""],
  };

  const errorMessages = {
    fromDate: ["This field required"],
    toDate: ["This field is required"],
    reason: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/empleavemaster/leaveapply/new") {
      setIsNew(true);
      setCrumbs([
        { name: "EmpLeaveMaster", link: "/EmpLeaveMaster/ApplyLeave" },
        { name: "Leave Apply" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getLeavesAppliedData();
    }
  }, [pathname]);

  const getLeavesAppliedData = async () => {
    await axios
      .get(`/api/leaveApply/${id}`)
      .then((res) => {
        setValues({
          leaveCategoryId: res.data.data.employee_leave_id,
          shortName: res.data.data.designation_short_name,
          priority: res.data.data.priority,
        });
        setCrumbs([
          { name: "EmpLeaveMaster", link: "/EmpLeaveMaster/ApplyLeave" },
          { name: "Leave Apply" },
          { name: "Update" },
          { name: res.data.data.employee_leave_id },
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getLeaveTypeOptions();
  }, []);

  const getLeaveTypeOptions = async () => {
    await axios
      .get(`/api/LeaveType`)
      .then((res) => {
        const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.leave_id,
              label: obj.leave_type_short,
            })
          })
        setLeaveTypeOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.employee_leave_id = values.leaveCategoryId;
      temp.total_leaves_applicable = values.pendingLeaves;
      temp.leave_comments = values.reason;
      temp.contact_no = values.contact_no;
      await axios
        .post(`/api/leaveApply`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/EmpLeaveMaster/ApplyLeave", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.employee_leave_id = values.leaveCategoryId;
      temp.total_leaves_applicable = values.pendingLeaves;
      temp.leave_comments = values.reason;
      temp.alternative_lecturer_name = values.fromDate;
      temp.contact_no = values.contact_no;
      temp.alternative_lecturer_name = values.staffEmail;
      await axios
        .put(`/api/leaveApply/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/EmpLeaveMaster/ApplyLeave", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  const oneDay = 1000 * 60 * 60 * 24;

  const date1 = new Date(values.fromDate - oneDay);
  const date2 = new Date(values.toDate);

  const diffInTime = date2.getTime() - date1.getTime();

  const diffInDays = Math.round(diffInTime / oneDay);

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="leaveCategoryId"
              label="Leave Category"
              value={values.leaveCategoryId}
              options={leaveTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="pendingLeaves"
              label="Leave Available"
              value={values.pendingLeaves}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="fromDate"
              label="From Date"
              value={values.fromDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.fromDate}
              errors={errorMessages.fromDate}
              required
              disablePast
              helperText=""
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="toDate"
              label="To Date"
              value={values.toDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.toDate}
              errors={errorMessages.toDate}
              required
              minDate={values.fromDate}
              disablePast
              helperText=""
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="totalDays"
              label="Days Applied"
              value={values.toDate ? diffInDays : 0}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              multiline
              rows={2}
              inputProps={{
                minLength: 1,
                maxLength: 100,
              }}
              value={values.reason}
              label="Reason"
              name="reason"
              handleChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="staffEmail"
              label="Alternative Staff Email"
              value={values.staffEmail}
              options={leaveTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="leaveCategory"
              label="Staff"
              value={values.leaveCategory}
              options={leaveTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="leaveCategory"
              label="Contact"
              value={values.leaveCategory}
              options={leaveTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default LeaveApplyForm;
