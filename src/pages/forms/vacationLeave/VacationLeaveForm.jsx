import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomSelect from "../../../components/Inputs/CustomSelect";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import axios from "../../../services/Api";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import moment from "moment";

const holidayNameLists = [
  {
    label: "Holiday Name",
    value: 1,
  },
];

const formFields = {
  schoolId: "",
  leaveType: "Vacation Leave",
  fromDate: "",
  toDate: "",
  permittedDays: "",
  acYearId: "",
  remarks: "",
};

const initialState = {
  formField: formFields,
  formValue: null,
  holidayNameList: [],
  schoolList: [],
  academicYearList: [],
  vacationTypeId: "",
  loading: false,
  remarks: "",
};

const requiredFields = [
  "schoolId",
  "leaveType",
  "fromDate",
  "toDate",
  "permittedDays",
  "acYearId",
];

const VacationLeaveForm = () => {
  const [
    {
      formField,
      formValue,
      schoolId,
      schoolList,
      academicYearList,
      vacationTypeId,
      loading,
      remarks,
    },
    setState,
  ] = useState(initialState);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCrumbs([
      { name: "Vacation Leave", link: "/VacationLeaveIndex" },
      { name: !!location.state ? "Update" : "Create" },
    ]);
    getVacationTypeId();
    getSchoolData();
    getAcademicYearData();
    setHolidayName();
    if (!!location.state) setFormField();
  }, []);

  const getVacationTypeId = async () => {
    try {
      const res = await axios.get("api/getLeaveIdOfVacationLeave/VL");
      setState((prevState) => ({
        ...prevState,
        vacationTypeId: res?.data?.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const setFormField = () => {
    setState((prevState) => ({
      ...prevState,
      formValue: location.state,
      formField: {
        ...prevState.formField,
        schoolId: location.state ? location.state?.schoolId : "",
        fromDate: location.state ? location.state?.frontendUseFromDate : "",
        toDate: location.state ? location.state?.frontendUseToDate : "",
        permittedDays: location.state ? location.state?.permittedDays : "",
        acYearId: location.state ? location.state?.acYearId : "",
        remarks: location.state ? location.state?.remarks : "",
      },
    }));
  };

  const checks = {
    schoolId: [formField.schoolId !== ""],
    fromDate: [formField.fromDate !== ""],
    toDate: [formField.toDate !== ""],
    acYearId: [formField.acYearId !== ""],
    permittedDays: [
      formField.permittedDays !== "",
      /^[0-9]+$/.test(formField.permittedDays),
      formField.permittedDays < 30,
    ],
  };

  const errorMessages = {
    schoolId: ["This field required"],
    fromDate: ["This field is required"],
    toDate: ["This field is required"],
    acYearId: ["This field is required"],
    permittedDays: [
      "This field is required",
      "Enter only numeric value",
      "Enter days less than 30",
    ],
  };

  const setHolidayName = () => {
    setState((prevState) => ({
      ...prevState,
      holidayNameList: holidayNameLists,
    }));
  };

  const getAcademicYearData = async () => {
    await axios
      .get(`api/academic/academic_year`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          academicYearList: res?.data?.data.map((el) => ({
            ...el,
            label: el.ac_year,
            value: el.ac_year_id,
          })),
        }));
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    try {
      const res = await axios.get(`api/institute/school`);
      if (res?.data?.data?.length) {
        setState((prevState) => ({
          ...prevState,
          schoolList: res?.data?.data.map((el) => ({
            ...el,
            label: el.school_name,
            value: el.school_id,
          })),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formField: {
        ...prev.formField,
        [name]: value,
      },
    }));
  };

  const handleDatePicker = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      formField: {
        ...prev.formField,
        [name]: newValue,
      },
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (![field]) return false;
    }
    return true;
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const actionAfterResponse = (res) => {
    if (res.status === 200 || res.status === 201) {
      navigate("/VacationLeaveIndex", { replace: true });
      setAlertMessage({
        severity: "success",
        message: `Vacation leave ${
          !!formValue ? "updated" : "created"
        } successfully`,
      });
      setLoading(false);
    } else {
      setAlertMessage({ severity: "error", message: "Error Occured" });
      setLoading(false);
    }
    setAlertOpen(true);
  };

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      try {
        let payload = {
          acYearId: formField.acYearId,
          fromDate: moment(formField.fromDate).format("DD-MM-YYYY"),
          frontendUseFromDate: formField.fromDate,
          leaveType: formField.leaveType,
          permittedDays: formField.permittedDays,
          schoolId: formField.schoolId,
          toDate: moment(formField.toDate).format("DD-MM-YYYY"),
          frontendUseToDate: formField.toDate,
          remarks: formField.remarks,
        };
        // setLoading(true);
        if (!!location.state) {
          const res = await axios.put(
            `api/updateVacationHolidayCalendar/${formValue?.id}`,
            {
              ...payload,
              ...{
                vacationId: formValue?.id,
                leaveId: vacationTypeId,
                active: true,
              },
            }
          );
          actionAfterResponse(res);
        } else {
          const res = await axios.post("/api/createVacationHolidayCalendar", {
            ...payload,
            leaveId: vacationTypeId,
            ...{ active: true },
          });
          actionAfterResponse(res);
        }
      } catch (err) {
        setLoading(false);
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      }
    }
  };

  const disablePreviousMonthDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-01`;
  };

  const disableDateBeforeFromDate = () => {
    let date = new Date(formField.fromDate);
    date.setDate(date.getDate() + 1);
    return date;
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="leaveType"
                label="Leave"
                value={formField.leaveType}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="schoolId"
                label="Institute Name"
                value={!!schoolList.length > 0 ? formField.schoolId : ""}
                items={schoolList}
                handleChange={handleChange}
                checks={checks.schoolId}
                errors={schoolId}
                disabled={!!formValue}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="fromDate"
                label="From Date"
                value={formField.fromDate}
                minDate={disablePreviousMonthDate()}
                handleChangeAdvance={handleDatePicker}
                checks={checks.fromDate}
                errors={errorMessages.fromDate}
                disabled={!!formValue}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="toDate"
                label="To Date"
                value={formField.toDate}
                minDate={disableDateBeforeFromDate()}
                handleChangeAdvance={handleDatePicker}
                checks={checks.toDate}
                errors={errorMessages.toDate}
                disabled={!formField.fromDate}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="permittedDays"
                label="Days Permitted"
                value={formField.permittedDays}
                handleChange={handleChange}
                checks={checks.permittedDays}
                errors={errorMessages.permittedDays}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="acYearId"
                label="Academic Year"
                value={academicYearList.length > 0 ? formField.acYearId : ""}
                items={academicYearList}
                handleChange={handleChange}
                checks={checks.acYearId}
                errors={errorMessages.acYearId}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={formField.remarks}
                handleChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={loading || !requiredFieldsValid()}
                onClick={handleCreate}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : !!formValue ? (
                  <strong>Update</strong>
                ) : (
                  <strong>Submit</strong>
                )}
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
};

export default VacationLeaveForm;
