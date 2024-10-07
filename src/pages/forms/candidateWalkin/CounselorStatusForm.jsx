import { useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = {
  counselorStatus: "",
  remarks: "",
};

const requiredFields = ["counselorStatus", "remarks"];

function CounselorStatusForm({
  rowData,
  setModalOpen,
  getData,
  setAlertMessage,
  setAlertOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const { id } = rowData;

  const maxLength = 150;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
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
    const { counselorStatus, counselorRemarks } = values;
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/student/Candidate_Walkin/${id}`
      );
      const responseData = response.data;
      responseData.counselor_status = counselorStatus;
      responseData.counselor_remarks = counselorRemarks;
      if (counselorStatus === "1") {
        responseData.npf_status = 3;
      }

      const { data: updateResponse } = await axios.put(
        `/api/student/Candidate_Walkin/${id}`,
        responseData
      );
      if (updateResponse.success) {
        setAlertMessage({
          severity: "success",
          message: "Offer status updated sucessfully !!",
        });
        setAlertOpen(true);
        getData();
      }

      setModalOpen(false);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <CustomRadioButtons
            name="counselorStatus"
            label="Offer Status"
            value={values.counselorStatus}
            items={[
              {
                value: 1,
                label: "Accepted",
              },
              {
                value: 0,
                label: "Not Accepted",
              },
            ]}
            handleChange={handleChange}
            required
          />
        </Grid>
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
        <Grid item xs={12} align="right" mt={1}>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={loading || !requiredFieldsValid()}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Submit"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CounselorStatusForm;
