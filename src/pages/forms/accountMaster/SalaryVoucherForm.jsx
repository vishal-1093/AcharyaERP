import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, Button, Grid } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  month: null,
  remarks: "",
};

const breadCrumbsList = [
  { name: "Accounts Voucher", link: "/accounts-voucher" },
  { name: "Salary" },
  { name: "Create" },
];

const requiredFields = ["month", "remarks"];

function SalaryVoucherForm() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 150;

  useEffect(() => {
    setCrumbs(breadCrumbsList);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const { month, remarks } = values;
    const formatMonth = moment(month).format("MM");
    const formatYear = moment(month).format("YYYY");
    try {
      const response = await axios.post(
        `/api/finance/journalVoucherCreationByMonthAndYear/${formatMonth}/${formatYear}/${remarks}`
      );
      if (!response.data.message) throw new Error();
      setAlertMessage({
        severity: "success",
        message: "Salary Voucher has been created successfully.",
      });
      setAlertOpen(true);
      setValues(initialValues);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to generate the salary voucher.",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <FormWrapper>
            <Grid container rowSpacing={4} columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <CustomDatePicker
                  name="month"
                  label="Month"
                  value={values.month}
                  handleChangeAdvance={handleChangeAdvance}
                  views={["month", "year"]}
                  openTo="month"
                  inputFormat="MM/YYYY"
                  helperText="mm/yyyy"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name="remarks"
                  label="Remarks"
                  value={values.remarks}
                  handleChange={handleChange}
                  helperText={`Remaining characters : ${getRemainingCharacters(
                    "remarks"
                  )}`}
                  multiline
                  required
                />
              </Grid>

              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading || !requiredFieldsValid()}
                >
                  Generate
                </Button>
              </Grid>
            </Grid>
          </FormWrapper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SalaryVoucherForm;
