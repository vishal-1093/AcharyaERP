import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = { marks: "" };

function UpdateInternalMarks({
  rowData,
  getData,
  setAlertMessage,
  setAlertOpen,
  setModalWrapperOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      ["marks"]: rowData.marks_obtained_internal,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const { max_marks: max } = rowData;
    if (!/^\d*$/.test(value)) return;
    setValues((prev) => ({ ...prev, [name]: value > max ? max : value }));
  };

  const handleCreate = async () => {
    const { marks } = values;
    const { id, max_marks: maxMarks } = rowData;
    try {
      setLoading(true);
      let percentage = (marks / maxMarks) * 100;
      percentage =
        percentage % 1 === 0 ? percentage : parseFloat(percentage.toFixed(2));
      const response = await axios.get(`/api/student/studentMarks/${id}`);
      const updateData = response.data.data;
      updateData.marks_obtained_internal = marks;
      updateData.percentage = percentage;
      const updateResponse = await axios.put(
        `/api/student/studentMarks/${id}`,
        updateData
      );
      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Internal marks has been updated successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
      setModalWrapperOpen(false);
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong!!",
      });
      setAlertOpen(true);
      setModalWrapperOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const DisplayContent = ({ label, value }) => {
    return (
      <>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography variant="subtitle2" color="textSecondary">
            {value}
          </Typography>
        </Grid>
      </>
    );
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Grid container rowSpacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={2}
            sx={{
              padding: 2,
              borderLeft: 6,
              borderColor: "primary.main",
              borderRadius: 2,
            }}
          >
            <Grid container rowSpacing={1}>
              <DisplayContent label="AC Year" value={rowData.ac_year} />
              <DisplayContent
                label="Student Name"
                value={rowData.student_name}
              />
              <DisplayContent label="AUID" value={rowData.studentAuid} />
              <DisplayContent
                label="Course"
                value={`${rowData.course_name} - ${rowData.course_code}`}
              />
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            name="marks"
            label="Marks"
            value={values.marks}
            handleChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={loading || values.marks === ""}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Update"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UpdateInternalMarks;
