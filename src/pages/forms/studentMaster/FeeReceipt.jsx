import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

function FeeReceipt() {
  const [values, setValues] = useState({ receiptType: "" });

  const navigate = useNavigate();

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCreate = async () => {
    if (values.receiptType.toLowerCase() === "college-general") {
      navigate(`/StudentReceipt/${values.receiptType}`);
    } else if (values.receiptType.toLowerCase() === "college-bulk") {
      navigate(`/BulkFeeReceiptForm`);
    } else if (values.receiptType.toLowerCase() === "hostel-general") {
      navigate(`/HostelFeeReceipt`);
    } else if (values.receiptType.toLowerCase() === "hostel-bulk") {
      navigate(`/HostelFeeReceiptBulk`);
    } else if (values.receiptType.toLowerCase() === "third force fee") {
      navigate("/ThirdForceFeeIndex");
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2.8}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="receiptType"
              label="Receipt Type"
              value={values.receiptType}
              options={[
                { label: "College-General", value: "College-General" },
                { label: "College-Bulk", value: "College-Bulk" },
                { label: "College-Exam", value: "College-Exam" },
                { label: "Hostel-General", value: "Hostel-General" },
                { label: "Hostel-Bulk", value: "Hostel-Bulk" },
                { label: "Third Force Fee", value: "Third Force Fee" },
              ]}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              <strong>{"Submit"}</strong>
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default FeeReceipt;
