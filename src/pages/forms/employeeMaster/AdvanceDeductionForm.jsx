import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const FormPaperWrapper = lazy(() =>
  import("../../../components/FormPaperWrapper")
);
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initialValues = {
  empId: null,
  schoolId: null,
  empIdOne: [],
  category: "Advance",
  principalAmount: "",
  startDate: null,
  endDate: null,
  monthAndYear: null,
  tenture: "",
  emi: "",
  balance: "",
  remarks: "",
};

const categoryOptions = [{ value: "Advance", label: "Advance" }];

const requiredFields = ["empIdOne", "principalAmount"];

function AdvanceDeductionForm() {
  const [values, setValues] = useState(initialValues);
  const [empOptions, setEmpOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    setCrumbs([
      { name: "Deduction Master", link: "DeductionMaster/Advance" },
      { name: "Advance Deduction" },
    ]);
    getAllEmployeeData();
    getSchoolData();
  }, []);

  useEffect(() => {
    calculateEMi();
  }, [values.principalAmount, values.startDate, values.endDate]);

  const checks = {
    principalAmount: [values.principalAmount !== ""],
  };

  const errorMessages = {
    principalAmount: ["This field is required"],
  };

  const getAllEmployeeData = async () => {
    await axios
      .get(`/api/getAllEmployeesForLeaveApply`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.emp_id,
            label: obj.employeeDetails?.replace(/,/g, "-"),
          });
        });
        setEmpOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            label: obj.school_name,
            value: obj.school_id,
          });
        });
        setSchoolOptions(data);
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

  var startDate = moment(values.startDate).format("YYYY-MM-DD");
  var endDate = moment(values.endDate).format("YYYY-MM-DD");

  var startDateOne = moment(startDate);
  var endDateOne = moment(endDate);

  var betweenMonths = [];

  if (startDateOne < endDateOne) {
    var date = startDateOne.startOf("month");

    while (date <= endDateOne.endOf("month")) {
      betweenMonths.push(date.format("YYYY-MM"));
      date.add(1, "month");
    }
  }

  const calculateEMi = () => {
    if (values.principalAmount && values.startDate && values.endDate) {
      let months = 0;
      const from = new Date(values.startDate);
      const to = new Date(values.endDate);
      months = (to.getFullYear() - from.getFullYear()) * 12;
      months -= from.getMonth();
      months += to.getMonth() + 1;

      setValues((prev) => ({
        ...prev,
        ["tenture"]: months,
        ["emi"]: Math.round(values.principalAmount / months),
        ["balance"]: values.principalAmount,
      }));
    }
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
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      const amed = [];

      temp.active = true;
      temp.principal_amount = values.principalAmount;
      temp.loan_started_date = values.startDate;
      temp.loan_end_date = values.endDate;
      temp.tenure = values.tenture;
      temp.emi_amount =
        values.category === "Advance" ? values.emi : values.principalAmount;
      temp.remaining_balance = values.balance;
      values.category === "Advance"
        ? (temp.emp_id = values.empId.toString().split(","))
        : (temp.emp_id = values.empIdOne);
      temp.lic_policy_no = null;
      temp.loan_created_date = null;
      temp.loan_completed_date = null;
      temp.completed_tenture = null;
      temp.category_name = values.category;
      temp.deactivate_year = null;
      temp.deactivate_month = null;
      temp.school_id = values.schoolId;
      temp.remarks = values.remarks;
      temp.month_year = values.monthAndYear;

      if (values.category === "Advance" && values.tenture == 1) {
        amed.push({
          month: moment(values.startDate).format("M"),
          year: moment(values.endDate).format("YYYY"),
          month_year: moment(values.startDate).format("MM-YYYY"),
          emi_amount: values.emi,
          category_name: values.category,
        });
      } else if (values.category === "Advance") {
        betweenMonths.map((obj) => {
          amed.push({
            month: moment(obj).format("M"),
            year: moment(obj).format("YYYY"),
            month_year: moment(obj).format("MM-YYYY"),
            emi_amount: values.emi,
            category_name: values.category,
          });
        });
      } else {
        amed.push({
          month: moment(values.monthAndYear).format("M"),
          year: moment(values.monthAndYear).format("YYYY"),
          month_year: moment(values.monthAndYear).format("MM-YYYY"),
          emi_amount: values.principalAmount,
          category_name: values.category,
        });
      }

      temp.amed = amed;

      await axios
        .post(`/api/finance/advancePayScaleDeduction`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/DeductionMaster/Advance", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Submitted Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <Box m={2}>
      <FormPaperWrapper>
        <Grid container columnSpacing={2} rowSpacing={4}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="category"
              label="Category"
              value={values.category}
              options={categoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                name="empId"
                label="Employee"
                value={values.empId}
                options={empOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="principalAmount"
                label="Principal Amount"
                value={values.principalAmount}
                handleChange={handleChange}
                checks={checks.principalAmount}
                errors={errorMessages.principalAmount}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomDatePicker
                views={["month", "year"]}
                openTo="month"
                name="startDate"
                label="Start Month"
                inputFormat="MM/YYYY"
                helperText="mm/yyyy"
                value={values.startDate}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomDatePicker
                views={["month", "year"]}
                openTo="month"
                name="endDate"
                label="End Month"
                inputFormat="MM/YYYY"
                helperText="mm/yyyy"
                value={values.endDate}
                minDate={values.startDate}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="tenture"
                label="Tenture"
                value={values.tenture}
                handleChange={handleChange}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="emi"
                label="Easy Monthly Installment"
                value={values.emi}
                handleChange={handleChange}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
                checks={checks.remarks}
                errors={errorMessages.remarks}
                required
              />
            </Grid>
          </>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleCreate}
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
                <strong>{"Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default AdvanceDeductionForm;
