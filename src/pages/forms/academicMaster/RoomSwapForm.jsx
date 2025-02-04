import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = {
  roomId: null,
};

function RoomSwapForm({
  rowData,
  setSwapRoomOpen,
  getData,
  setAlertMessage,
  setAlertOpen,
}) {
  const [values, setValues] = useState(initialValues);
  const [roomOptions, setRoomOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    try {
      const { data: response } = await axios.get(
        "/api/academic/getRoomsForInternals"
      );
      const responseData = response.data;
      const optionData = [];
      responseData.forEach((obj) => {
        optionData.push({
          value: obj.room_id,
          label: obj.roomcode,
        });
      });
      setRoomOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data",
      });
      setAlertOpen(true);
      setSwapRoomOpen(false);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCreate = async () => {
    const { roomId } = values;
    const {
      date_of_exam: date,
      time_slots_id: timeSlotId,
      room_id: internalRoomId,
    } = rowData;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/academic/getAssignedCoursesOnDateOfExamAndTimeSlotsIdAndRoomId/${date}/${timeSlotId}/${internalRoomId}`
      );
      const ids = [];
      response.data.data.forEach((obj) => {
        ids.push(obj.internal_room_assignment_id);
      });
      const roomIds = ids.join(",");
      const updateResponse = await axios.put(
        `/api/academic/updateRoomForInternalFacultyRoomAssignment/${roomIds}/${roomId}`
      );
      if (updateResponse.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Internal Room has been updated successfully !!",
        });
        setAlertOpen(true);
        getData();
      }
      setSwapRoomOpen(false);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to swap !!",
      });
      setAlertOpen(true);
      setSwapRoomOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container rowSpacing={4} columnSpacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="subtitle2">Current Room : </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {rowData?.roomcode}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomAutocomplete
            name="roomId"
            label="Room"
            value={values.roomId}
            options={roomOptions}
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

export default RoomSwapForm;
