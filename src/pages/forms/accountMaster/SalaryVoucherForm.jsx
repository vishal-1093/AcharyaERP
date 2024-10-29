import { useEffect, useState } from "react";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, Button, Grid } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = {
  month: null,
  remarks: "",
};

const breadCrumbsList = [
  { name: "Accounts Voucher", link: "/accounts-voucher" },
  { name: "Salary" },
  { name: "Create" },
];

function SalaryVoucherForm() {
  const [values, setValues] = useState(initialValues);

  const setCrumbs = useBreadcrumbs();

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
                <Button variant="contained">Generate</Button>
              </Grid>
            </Grid>
          </FormWrapper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SalaryVoucherForm;
