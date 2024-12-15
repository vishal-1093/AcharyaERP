import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  invigilatorId: null,
};

function InvigilatorSwapForm({
  rowData,
  setSwapOpen,
  getData,
  setAlertMessage,
  setAlertOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [empOptions, setEmpOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      const { time_slots_id: timeSlotId, date_of_exam: date } = rowData;
      const { data: response } = await axios.get(
        `/api/academic/getUnoccupiedEmployeesForInternals1/${timeSlotId}/${date}`
      );
      const responseData = response.data;
      const optionData = [];
      responseData.forEach((obj) => {
        optionData.push({
          value: obj.emp_id,
          label: obj.employeeName,
        });
      });
      setEmpOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data",
      });
      setAlertOpen(true);
      setSwapOpen(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCreate = async () => {
    const { invigilatorId } = values;
    const {
      date_of_exam: date,
      time_slots_id: timeSlotId,
      room_id: roomId,
    } = rowData;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/academic/getAssignedCoursesOnDateOfExamAndTimeSlotsIdAndRoomId/${date}/${timeSlotId}/${roomId}`
      );
      const ids = [];
      response.data.data.forEach((obj) => {
        ids.push(obj.internal_room_assignment_id);
      });

      const roomIds = ids.join(",");
      const updateResponse = await axios.put(
        `/api/academic/updateEmploeeForInternalFacultyRoomAssignment/${roomIds}/${invigilatorId}`
      );

      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "invigilator has been updated successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
      setSwapOpen(false);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to swap !!",
      });
      setAlertOpen(true);
      setSwapOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="subtitle2">Current Invigilator : </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {rowData?.facultyName}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomAutocomplete
            name="invigilatorId"
            label="Swap"
            value={values.invigilatorId}
            options={empOptions}
            handleChangeAdvance={handleChangeAdvance}
            required
          />
        </Grid>

        <Grid item xs={12} align="right">
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={loading || values.newCounselorId === null}
          >
            {loading ? (
              <CircularProgress
                size={25}
                color="blue"
                style={{ margin: "2px 13px" }}
              />
            ) : (
              "Swap"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InvigilatorSwapForm;
