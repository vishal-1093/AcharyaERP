import { React, useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "axios";
import ApiUrl from "../../../services/Api";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
const initialValues = {
  calenderYear: "",
  fromDate: null,
  toDate: null,
  remarks: "",
};

const requiredFields = ["calenderYear", "fromDate", "toDate"];

function CalenderyearForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [isNew, setIsNew] = useState(true);
  const setCrumbs = useBreadcrumbs();
  const [values, setValues] = useState(initialValues);
  const [calenderYearId, setCalenderYearId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const checks = {
    calenderYear: [
      values.calenderYear !== "",
      /^[0-9]{4}$/.test(values.calenderYear),
    ],
    fromDate: [values.fromDate !== null],
    toDate: [values.toDate !== null, values.toDate > values.fromDate],
  };
  const errorMessages = {
    calenderYear: ["This field is required", "Enter Only Numbers"],
    fromDate: ["This field is required"],
    toDate: [
      "This field is required",
      "To date must be greater than from date",
    ],
  };
  useEffect(() => {
    if (pathname.toLowerCase() === "/academiccalendars/calenderyear/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "Calendar Year" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCalenderYearData();
    }
  }, [pathname]);

  const getCalenderYearData = async () => {
    await axios.get(`${ApiUrl}/CalenderYear/${id}`).then((res) => {
      setValues({
        calenderYear: res.data.data.calender_year,
        fromDate: res.data.data.from_date,
        toDate: res.data.data.to_date,
        remarks: res.data.data.remarks,
      });
      setCalenderYearId(res.data.data.calender_year_id);
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "Calendar Year" },
        { name: "Update" },
        { name: "" },
      ]);
    });
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.calender_year = values.calenderYear;
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.remarks = values.remarks;

      await axios
        .post(`${ApiUrl}/CalenderYear`, temp)
        .then((res) => {
          setLoading(false);
          navigate("/AcademicCalendars", { replace: true });
          if (res.status === 200 || res.status === 201) {
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
  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      console.log("failed");
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.calender_year_id = calenderYearId;
      temp.calender_year = values.calenderYear;
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.remarks = values.remarks;
      await axios
        .put(`${ApiUrl}/CalenderYear/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/AcademicCalendars", { replace: true });
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
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-start"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="calenderYear"
                  label="Calendar Year"
                  value={values.calenderYear}
                  helperText="Format:[YYYY]"
                  handleChange={handleChange}
                  disabled={!isNew}
                  checks={checks.calenderYear}
                  errors={errorMessages.calenderYear}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="fromDate"
                  label="From Date"
                  value={values.fromDate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.fromDate}
                  errors={errorMessages.fromDate}
                  required
                  disablePast
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="toDate"
                  label="To Date"
                  value={values.toDate}
                  handleChangeAdvance={handleChangeAdvance}
                  checks={checks.toDate}
                  errors={errorMessages.toDate}
                  minDate={values.fromDate}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  multiline
                  rows={4}
                  value={values.remarks}
                  label="Remarks"
                  name="remarks"
                  handleChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  textAlign="right"
                >
                  <Grid item xs={2}>
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
              </Grid>
            </>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}
export default CalenderyearForm;
