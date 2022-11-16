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
  financialYear: "",
  fromDate: null,
  toDate: null,
  secondYear: "",
  firstYear: "",
};

const requiredFields = ["financialYear", "fromDate", "toDate"];

function FinancialyearForm() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [isNew, setIsNew] = useState(true);
  const setCrumbs = useBreadcrumbs();
  const [values, setValues] = useState(initialValues);
  const [financialYearId, setFinancialYearId] = useState(null);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const checks = {
    firstYear: [values.firstYear !== "", /^[0-9]{4}$/.test(values.firstYear)],
    calenderYear: [
      values.calenderYear !== "",
      /^[0-9]{4}$/.test(values.calenderYear),
    ],
    fromDate: [values.fromDate !== null],
    toDate: [values.toDate !== null, values.toDate > values.fromDate],
  };
  const errorMessages = {
    firstYear: ["This field is required", "Enter only numbers"],
    calenderYear: ["This field is required", "Enter Only Numbers"],
    fromDate: ["This field is required"],
    toDate: [
      "This field is required",
      "To date must be greater than from date",
    ],
  };
  useEffect(() => {
    if (pathname.toLowerCase() === "/academiccalendars/financialyear/new") {
      setIsNew(true);
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "Financial Year" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getFinancialYearData();
    }
  }, [pathname]);

  const getFinancialYearData = async () => {
    await axios.get(`${ApiUrl}/FinancialYear/${id}`).then((res) => {
      console.log(res.data.data);
      setValues({
        financialYear: res.data.data.financial_year,
        fromDate: res.data.data.from_date,
        toDate: res.data.data.to_date,
      });
      setFinancialYearId(res.data.data.financial_year_id);
      setCrumbs([
        { name: "AcademicCalendars", link: "/AcademicCalendars" },
        { name: "Financial Year" },
        { name: "Update" },
        { name: "" },
      ]);
    });
  };

  const handleChange = (e) => {
    const Firstyearone = e.target.value;
    const Secondyearone = (parseInt(e.target.value) + 1).toString();
    const concat = Firstyearone + "-" + Secondyearone;
    setValues({
      ...values,
      financialYear: concat,
      secondYear: Secondyearone,
      firstYear: Firstyearone,
    });
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
      temp.financial_year = values.financialYear;
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;

      await axios
        .post(`${ApiUrl}/FinancialYear`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          setAlertOpen(true);
          navigate("/AcademicCalendars", { replace: true });
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
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
      temp.financial_year_id = financialYearId;
      temp.financial_year = values.financialYear;
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;

      await axios
        .put(`${ApiUrl}/FinancialYear/${id}`, temp)
        .then((res) => {
          setAlertMessage({
            severity: "success",
            message: "Form Updated Successfully",
          });
          setAlertOpen(true);
          navigate("/AcademicCalendars", { replace: true });
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
              {isNew ? (
                <>
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="firstYear"
                      label="Financial Year"
                      helperText="  "
                      value={values.firstYear}
                      handleChange={handleChange}
                      errors={errorMessages.financialYear}
                      checks={checks.financialYear}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <CustomTextField
                      name="secondYear"
                      value={values.secondYear}
                      helperText="  "
                      disabled={!isNew}
                      handleChange={handleChange}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    name="financialYear"
                    label="Financial Year"
                    helperText="  "
                    value={values.financialYear}
                    disabled={!isNew}
                    handleChange={handleChange}
                  />
                </Grid>
              )}
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
export default FinancialyearForm;
