import { useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";

const initialValues = { remarks: "" };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function CancelVerifyScholarship({
  id,
  setCancelModalOpen,
  getData,
  setAlertMessage,
  setAlertOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const maxLength = 150;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.length > maxLength) return;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleCreate = async () => {
    const { remarks } = values;

    try {
      setIsLoading(true);

      const response = await axios.get(
        `/api/student/scholarshipapprovalstatus/${id}`
      );
      const updateData = response.data.data;
      updateData.verified_by = userId;
      updateData.is_verified = "no";
      updateData.verified_date = moment();
      updateData.verifier_remarks = remarks;

      const updateResponse = await axios.put(
        `/api/student/updateScholarshipStatus/${id}`,
        { sas: updateData }
      );

      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Cancelled successfully !!",
        });
        setAlertOpen(true);
        setCancelModalOpen(false);
        getData();
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <CustomTextField
            name="remarks"
            label="Remarks"
            value={values.remarks}
            handleChange={handleChange}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "remarks"
            )}`}
            multiline
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            color="error"
            disabled={isLoading || values.remarks === ""}
            onClick={handleCreate}
          >
            {isLoading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              <Typography variant="subtitle2">Cancel</Typography>
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CancelVerifyScholarship;
