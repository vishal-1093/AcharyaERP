import { useState, useEffect } from "react";
import { Box, Grid, Button } from "@mui/material";
import CustomMonthYearPicker from "../../../components/Inputs/CustomMonthYearPicker";

const initialState = {
  validTillDate: "",
};
export const ValidTillForm = ({ getValidTillFormData }) => {
  const [{ validTillDate }, setState] = useState(initialState);
  const handleDatePicker = (name, newValue) => {
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const onSubmit = () => {
    getValidTillFormData(validTillDate);
  };

  return (
    <>
      <Box component="form" overflow="auto" p={1}>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={12}>
            <CustomMonthYearPicker
              name="validTillDate"
              label="Valid Till Date"
              disablePast
              value={validTillDate}
              handleChangeAdvance={handleDatePicker}
              required
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={!validTillDate}
              onClick={onSubmit}
            >
              Print Id Card
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
