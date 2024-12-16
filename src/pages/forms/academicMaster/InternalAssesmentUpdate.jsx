import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  maxMarks: "",
  minMarks: "",
  examDate: null,
  timeSlotId: null,
};

const requiredFields = ["maxMarks", "minMarks", "examDate", "timeSlotId"];

function InternalAssesmentUpdate() {
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState([]);
  const [timeSlotOptions, setTimeslotOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    getTimeSlots();
  }, [data.school_id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/academic/internalSessionAssignment1/${id}`
      );
      const responseData = response.data.data;
      const {
        max_marks: maxMarks,
        min_marks: minMarks,
        date_of_exam: examDate,
        time_slots_id: timeSlotId,
        internal_name: internalName,
      } = responseData;
      setCrumbs([
        { name: "Internal Assesment", link: "/internals" },
        { name: internalName },
        { name: "Update" },
      ]);
      setValues((prev) => ({
        ...prev,
        maxMarks,
        minMarks,
        examDate: moment(examDate, "DD-MM-YYYY"),
        timeSlotId,
      }));
      setData(responseData);
    } catch (err) {
      console.error(err);

      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
  };

  const getTimeSlots = async () => {
    const { school_id: schoolId } = data;
    if (!schoolId) return null;
    try {
      const response = await axios.get(
        `/api/academic/getTimeSlotsForInternals/${schoolId}`
      );
      const optionData = [];
      response.data.data.forEach((obj) => {
        optionData.push({
          value: obj.time_slots_id,
          label: obj.timeSlots,
        });
      });
      setTimeslotOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the Time Slots",
      });
      setAlertOpen(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const { minMarks, maxMarks, examDate, timeSlotId } = values;
      const putData = { ...data };
      putData.max_marks = maxMarks;
      putData.min_marks = minMarks;
      putData.date_of_exam = moment(examDate).format("DD-MM-YYYY");
      putData.time_slots_id = timeSlotId;
      const response = await axios.put(
        `/api/academic/internalSessionAssignment1/${id}`,
        [putData]
      );
      if (response.data.success) {
        setAlertMessage({
          severity: "success",
          message: "Internals has been updated successfully !!",
        });
        setAlertOpen(true);
        navigate("/internals");
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m={4}>
      <FormPaperWrapper>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="maxMarks"
              label="Max Marks"
              value={values.maxMarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="minMarks"
              label="Min Marks"
              value={values.minMarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="examDate"
              value={values.examDate}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="timeSlotId"
              value={values.timeSlotId}
              options={timeSlotOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} align="right">
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
                <Typography variant="subtitle2">Update</Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default InternalAssesmentUpdate;
