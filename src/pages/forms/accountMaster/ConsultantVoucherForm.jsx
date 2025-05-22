import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import { Box, Button, Grid } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";

const initialValues = {
  month: null,
};

const breadCrumbsList = [
  { name: "Accounts Voucher", link: "/accounts-voucher" },
  { name: "Consultant" },
  { name: "Create" },
];

const requiredFields = ["month"];

function ConsultantVoucherForm() {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs(breadCrumbsList);
  }, []);


  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    const { month } = values;
    const formatMonth = moment(month).format("MM");
    const formatYear = moment(month).format("YYYY");
    try {
      const response = await axios.post(`/api/consoliation/jvCreationForConsultant/${formatMonth}/${formatYear}`);
      if (response.status == 200 || response.status == 201) {
        setAlertMessage({
          severity: "success",
          message: "consultant Voucher has been created successfully.",
        });
        setAlertOpen(true);
        setValues(initialValues);
      } else {
        throw new Error();
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to generate the consultant voucher or its already generated for selected month",
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

export default ConsultantVoucherForm;
