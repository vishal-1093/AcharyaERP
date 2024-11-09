import { memo } from "react";
import { Grid } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const BankDetailsForm = memo(({ bankValues, setBankValues }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "aadharNo" && !/^\d*$/.test(value)) return;
    setBankValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Grid container rowSpacing={2} columnSpacing={3}>
      <Grid item xs={12} md={3}>
        <CustomTextField
          name="bankName"
          label="Bank Name"
          value={bankValues.bankName}
          handleChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomTextField
          name="accountHolderName"
          label="Name As Per Bank"
          value={bankValues.accountHolderName}
          handleChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomTextField
          name="accountNumber"
          label="Account Number"
          value={bankValues.accountNumber}
          handleChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomTextField
          name="bankBranch"
          label="Branch"
          value={bankValues.bankBranch}
          handleChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <CustomTextField
          name="ifscCode"
          label="Ifsc Code"
          value={bankValues.ifscCode}
          handleChange={handleChange}
        />
      </Grid>
    </Grid>
  );
});

export default BankDetailsForm;
