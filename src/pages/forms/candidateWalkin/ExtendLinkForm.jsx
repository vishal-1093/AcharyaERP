import { useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";

const initialValues = {
  linkExpiryDate: null,
};

function ExtendLinkForm({
  rowData,
  setLinkOpen,
  getData,
  setAlertMessage,
  setAlertOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const { id, link_exp: linkExp, candidate_name: candidateName } = rowData;

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCreate = async () => {
    const { linkExpiryDate } = values;
    try {
      setLoading(true);
      const { data: response } = await axios.get(
        `/api/student/Candidate_Walkin/${id}`
      );
      const responseData = response.data;
      responseData.link_exp = linkExpiryDate;

      const { data: updateResponse } = await axios.put(
        `/api/student/Candidate_Walkin/${id}`,
        responseData
      );
      if (updateResponse.success) {
        setAlertMessage({
          severity: "success",
          message: "Payment link has been updated successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
      setLinkOpen(false);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to Extend !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={3.5}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={8.5}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <Grid container rowSpacing={0.5}>
            <DisplayContent label="Candidate ID" value={id} />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <DisplayContent label="Candidate Name" value={candidateName} />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <DisplayContent
              label="Link Expires On"
              value={linkExp && moment(linkExp).format("DD-MM-YYYY")}
            />
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <CustomDatePicker
            name="linkExpiryDate"
            label="Valid Till"
            value={values.linkExpiryDate}
            handleChangeAdvance={handleChangeAdvance}
            minDate={linkExp}
            disablePast
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={loading || values.linkExpiryDate === null}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Extend"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExtendLinkForm;
