import { useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";

const initialValues = { remarks: "" };

function CancelLeave({ userId, rowData, setCancelModalOpen, getData }) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  const maxLength = 150;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const handleCreate = async () => {
    try {
      setLoading(true);
      const postData = {
        cancelBy: userId,
        leaveApplyId: rowData.id,
        cancelComment: values.remarks,
      };

      const response = await axios.post(
        `/api/cancelLeavesOfEmployee`,
        postData
      );

      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Leave has been cancelled successfully !!",
        });
        getData();
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
      setCancelModalOpen(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={3}>
        <Grid item xs={12} md={12}>
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
            onClick={handleCreate}
            disabled={loading || values.remarks === ""}
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

export default CancelLeave;
