import React, { lazy } from "react";
import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import FormWrapper from "../../../components/FormWrapper";
import axios from "../../../services/Api";
const LeaveDetailsReport = lazy(() => import("./LeaveDetailsReport"));

const initialValues = {
  year: "",
  schoolId: "",
  deptId: "",
  leaveTypeId: "",
};

function LeaveDetailsFilter() {
  const [values, setValues] = useState(initialValues);
  const [yearOptions, setYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [reportOpen, setReportopen] = useState(false);

  useEffect(() => {
    getYearData();
    getSchoolData();
    getDeptData();
    getLeaveTypeData();
  }, []);

  const getYearData = async () => {
    await axios
      .get(`/api/CalenderYear`)
      .then((res) => {
        setYearOptions(
          res.data.data.map((obj) => ({
            value: obj.calender_year.toString(),
            label: obj.calender_year.toString(),
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj?.school_id,
            label: obj?.school_name,
            school_name_short: obj?.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getDeptData = async () => {
    await axios
      .get(`/api/dept`)
      .then((res) => {
        const deptOptionData = [];
        res?.data?.data?.forEach((obj) => {
          deptOptionData.push({
            value: obj.dept_id,
            label: obj.dept_name,
          });
        });
        setDeptOptions(deptOptionData);
      })
      .catch((err) => console.error(err));
  };

  const getLeaveTypeData = async () => {
    await axios
      .get(`/api/LeaveType`)
      .then((res) => {
        const leaveType = [];
        res?.data?.data?.forEach((obj) => {
          leaveType.push({
            value: obj.leave_id,
            label: obj.leave_type,
            short_name: obj.leave_type_short,
          });
        });
        setLeaveTypeOptions(leaveType);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  return (
    <>
      {!reportOpen ? (
        <>
          <FormWrapper>
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              rowSpacing={2}
              columnSpacing={2}
            >
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="year"
                  label="Year"
                  options={yearOptions}
                  value={values.year}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="School"
                  options={schoolOptions}
                  value={values.schoolId}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="deptId"
                  label="Department"
                  options={deptOptions}
                  value={values.deptId}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <CustomAutocomplete
                  name="leaveTypeId"
                  label="Leave Type"
                  options={leaveTypeOptions}
                  value={values.leaveTypeId}
                  handleChangeAdvance={handleChangeAdvance}
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={() => setReportopen(true)}
                  disabled={values.year === "" || values.schoolId === ""}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </FormWrapper>
        </>
      ) : (
        <>
          <LeaveDetailsReport
            year={values.year}
            schoolId={values.schoolId}
            deptId={values.deptId}
            leaveTypeId={values.leaveTypeId}
            leaveTypeShortName={leaveTypeOptions.find(
              (obj) => obj.value === Number(values.leaveTypeId)
            )}
            schoolName={schoolOptions.find(
              (obj) => obj.value === Number(values.schoolId)
            )}
            deptName={deptOptions.find(
              (obj) => obj.value === Number(values.deptId)
            )}
          />
        </>
      )}
    </>
  );
}
export default LeaveDetailsFilter;
