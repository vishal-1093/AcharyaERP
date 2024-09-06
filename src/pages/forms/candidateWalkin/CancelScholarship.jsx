import { useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";

const initialValues = { cancelRemarks: "" };

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function CancelScholarship({
  rowData,
  setAlertMessage,
  setAlertOpen,
  getData,
  setCancelModalOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const maxLength = 150;

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleCreate = async () => {
    const { id } = rowData;
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/student/scholarshipapprovalstatus/${id}`
      );
      const updateData = response.data.data;
      updateData.cancel_remarks = values.cancelRemarks;
      updateData.cancel_date = moment();
      updateData.cancelBy = userId;

      const [schHistory, updateResponse] = await Promise.all([
        axios.post("api/student/scholarshipApprovalStatusHistory", {
          ...updateData,
          editedBy: "cancelled",
        }),
        axios.put(`/api/student/updateScholarshipStatus/${id}`, {
          sas: updateData,
        }),
      ]);
      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "The scholarship has been successfully cancelled",
        });
        setAlertOpen(true);
        getData();
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to verify !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(true);
      setCancelModalOpen(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <CustomTextField
            name="cancelRemarks"
            label="Remarks"
            value={values.cancelRemarks}
            handleChange={handleChange}
            helperText={`Remaining characters : ${getRemainingCharacters(
              "cancelRemarks"
            )}`}
            multiline
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            color="error"
            disabled={loading || values.cancelRemarks === ""}
            onClick={handleCreate}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Cancel"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CancelScholarship;
