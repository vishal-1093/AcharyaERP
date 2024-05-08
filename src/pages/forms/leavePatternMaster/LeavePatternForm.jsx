import { useState, useEffect } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import FormWrapper from "../../../components/FormWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";

const initialValues = {
  yearId: "",
  leaveTypeId: null,
  schoolId: [],
  employeeTypeId: [],
  jobTypeId: [],
  leaveDays: "",
  remarks: "",
};

const requiredFields = [
  "yearId",
  "leaveTypeId",
  "schoolId",
  "employeeTypeId",
  "leaveDays",
  "remarks",
];

function LeavePatternForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [leavePatternId, setleavePatternId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [JobTypes, setJobTypes] = useState([]);
  const [employementTypeOptions, setEmployementTypeOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    schoolId: isNew ? [values.schoolId.length > 0] : [],
    employeeTypeId: isNew ? [values.employeeTypeId.length > 0] : [],
    jobTypeId: isNew ? [values.jobTypeId.length > 0] : [],
    leaveDays: [values.leaveDays !== ""],
    remarks: [values.remarks !== ""],
  };
  const errorMessages = {
    schoolId: ["This field is required"],
    employeeTypeId: ["This field is required"],
    jobTypeId: ["This field is required"],
    leaveDays: ["This field is required"],
    remarks: ["This field is required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/leavepatternmaster/leavepatterns/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "Leave Master",
          link: "/LeaveMaster/LeavePattern",
        },
        { name: "Leave Pattern" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getLeavePatternData();
    }
  }, [pathname]);

  const getLeavePatternData = async () => {
    await axios
      .get(`/api/LeavePattern/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          yearId: res.data.data.year.toString(),
          leaveTypeId: res.data.data.leave_id,
          schoolId: res.data.data.school_id,
          employeeTypeId: res.data.data.emp_type_id,
          jobTypeId: res.data.data.job_type_id,
          leaveDays: res.data.data.leave_days_permit,
          remarks: res.data.data.specal_remarks,
        }));

        setleavePatternId(res.data.data.leave_pattern_id);
        setCrumbs([
          {
            name: "Leave Master",
            link: "/LeaveMaster/LeavePattern",
          },
          { name: "Leave Pattern" },
          { name: "Update" },
        ]);
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

  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };

  const handleSelectNone = (name) => {
    setValues((prev) => ({ ...prev, [name]: [] }));
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

  useEffect(() => {
    getLeaveTypeOptions();
    getSchoolNameOptions();
    getAcademicYearOptions();
    getJobTypes();
    getEmployementTypeOptions();
  }, []);

  const getLeaveTypeOptions = async () => {
    await axios
      .get(`/api/getLeaveTypeForLeaveAndAttendence`)
      .then((res) => {
        setLeaveTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.leave_id,
            label: obj.leave_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/CalenderYear`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.calender_year.toString(),
            label: obj.calender_year.toString(),
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getJobTypes = async () => {
    await axios
      .get(`/api/employee/JobType`)
      .then((res) => {
        setJobTypes(
          res.data.data.map((obj) => ({
            value: obj.job_type_id,
            label: obj.job_type,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getEmployementTypeOptions = async () => {
    await axios
      .get(`/api/employee/EmployeeType`)
      .then((res) => {
        setEmployementTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.empTypeId,
            label: obj.empType,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });

      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.year = values.yearId;
      temp.leave_id = values.leaveTypeId;
      temp.school_id = values.schoolId;
      temp.emp_type_id = values.employeeTypeId;
      temp.job_type_id = values.jobTypeId;
      temp.leave_days_permit = values.leaveDays;
      temp.special_remarks = values.remarks;

      await axios
        .post(`/api/LeavePattern`, temp)
        .then((res) => {
          setLoading(false);

          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Leave pattern created successfully !!",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
          navigate("/LeaveMaster/LeavePattern", { replace: true });
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
  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });

      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.leave_pattern_id = leavePatternId;
      temp.year = values.yearId;
      temp.leave_id = values.leaveTypeId;
      temp.school_id = values.schoolId;
      temp.emp_type_id = values.employeeTypeId;
      temp.job_type_id = values.jobTypeId.toString();
      temp.leave_days_permit = values.leaveDays;
      temp.specal_remarks = values.remarks;
      await axios
        .put(`/api/LeavePattern/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Leave pattern updated successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
          navigate("/LeaveMaster/LeavePattern", { replace: true });
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.res ? error.res.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box m={5}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="yearId"
              label="Year"
              value={values.yearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="leaveTypeId"
              label="Leave Type"
              value={values.leaveTypeId}
              options={LeaveTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          {isNew === true ? (
            <Grid item xs={12} md={4}>
              <CheckboxAutocomplete
                name="schoolId"
                label="School Names"
                value={values.schoolId}
                options={SchoolNameOptions}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                checks={checks.schoolId}
                errors={errorMessages.schoolId}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="schoolId"
                label="School Names"
                value={values.schoolId}
                options={SchoolNameOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled
                required
              />
            </Grid>
          )}

          {isNew === true ? (
            <Grid item xs={12} md={4}>
              <CustomMultipleAutocomplete
                name="employeeTypeId"
                label="Employment Type"
                value={values.employeeTypeId}
                options={employementTypeOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.employeeTypeId}
                errors={errorMessages.employeeTypeId}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="employeeTypeId"
                label="Employment Type"
                value={values.employeeTypeId}
                options={employementTypeOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled
                required
              />
            </Grid>
          )}

          {isNew === true ? (
            <Grid item xs={12} md={4}>
              <CustomMultipleAutocomplete
                name="jobTypeId"
                label="Job Type"
                value={values.jobTypeId}
                options={JobTypes}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.jobTypeId}
                errors={errorMessages.jobTypeId}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="jobTypeId"
                label="Job Type"
                value={values.jobTypeId}
                options={JobTypes}
                handleChangeAdvance={handleChangeAdvance}
                disabled
                required
              />
            </Grid>
          )}

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="leaveDays"
              label="Leave Days Permit"
              value={values.leaveDays}
              handleChange={handleChange}
              checks={checks.leaveDays}
              errors={errorMessages.leaveDays}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              errors={errorMessages.remarks}
              checks={checks.remarks}
              multiline
              rows={2}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
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
                <>{isNew ? "Create" : "Update"}</>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default LeavePatternForm;
