import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Grid } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initialValues = { date: null, timeSlot: null };

const requiredFields = ["date", "timeSlot"];

function InternalRoomAssignment() {
  const [values, setValues] = useState(initialValues);
  const [timeSlotOptions, setTimeslotOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  useEffect(() => {
    setCrumbs([
      { name: "Internal Room Assignment", link: "/InternalAssignmentIndex" },
    ]);
    getTimeSlots();
  }, []);

  const getTimeSlots = async () => {
    await axios
      .get(`/api/academic/getTimeSlotsForInternals/${values.schoolId}`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.time_slots_id,
            label: obj.timeSlots,
          });
        });
        setTimeslotOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box m={4}>
      <FormWrapper>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="date"
              label="Date"
              value={values.date}
              handleChangeAdvance={handleChangeAdvance}
              helperText=""
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="timeSlot"
              label="Time Slot"
              value={values.timeSlot}
              options={timeSlotOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default InternalRoomAssignment;
