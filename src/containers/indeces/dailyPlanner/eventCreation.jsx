import { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDateTimePicker from "../../../components/Inputs/CustomDateTimePicker";
import dayjs from "dayjs";
import moment from "moment";
import axios from "../../../services/Api";

const initialValues = {
  eventTitle: "",
  description: "",
  startDate: "",
  endDate: "",
};

const TaskList = [
  { label: "Primary", value: "Primary" },
  { label: "Secondary", value: "Secondary" },
  { label: "Additional", value: "Additional" },
];

const EventForm = () => {
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const TOTAL_CHARACTERS = 200;
  const characterRemaining = useRef(200);

  useEffect(() => {
    setCrumbs([
      { name: "Daily Planner", link: "/daily-planner" },
      { name: "Create" },
    ]);
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "description") {
      if (e.target.value.length > TOTAL_CHARACTERS) return;

      characterRemaining.current = TOTAL_CHARACTERS - e.target.value.length;
    }

    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleError = (payload) => {
    const { eventTitle, startDate, endDate, task } = payload;
    let error = {};

    if (eventTitle === null || eventTitle === "")
      error["eventTitle"] = "Event Title is required";

    if (startDate === null || startDate === "")
      error["startDate"] = "Start Date is required";

    if (endDate === null || endDate === "")
      error["endDate"] = "End Date is Required";

    if (task === null || task === "") error["task"] = "Task is Required";

    return { error, isValid: Object.keys(error).length <= 0 };
  };

  const handleCreate = async () => {
    setErrors({});

    const payload = {
      eventTitle: values.eventTitle,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      task: values.task,
    };

    const { error, isValid } = handleError(payload);
    if (!isValid) return setErrors(error);

    const empId = await getEmpId();
    if (empId === null) return alert("No User Found");
    const body = {
      emp_id: empId,
      task_title: values.eventTitle,
      task_priority: values.task,
      description: values.description,
      task_status: "Pending",
      from_date: moment(values.startDate).format("DD-MM-YYYY"),
      to_date: moment(values.endDate).format("DD-MM-YYYY"),
      from_time: moment(values.startDate).format("HH:mm"),
      to_time: moment(values.endDate).format("HH:mm"),
      active: true,
    };

    axios
      .post("/api/saveDailyPlanner", body)
      .then((res) => {
        navigate("/daily-planner");
      })
      .catch((err) => {
        console.log(err);
        setAlertMessage({
          severity: "error",
          message: "Failed to create, Please try after sometime",
        });
        setAlertOpen(true);
      });
  };

  const getEmpId = async () => {
    return new Promise((resolve) => {
      const userId = JSON.parse(
        sessionStorage.getItem("AcharyaErpUser")
      )?.userId;
      axios
        .get(`/api/employee/getEmployeeDetailsByUserID/${userId}`)
        .then((res) => {
          if (res.data.data !== null) resolve(res.data.data.emp_id);
          else resolve(null);
        })
        .catch((err) => {
          console.error(err);
          resolve(null);
        });
    });
  };

  return (
    <Box p={3}>
      <FormWrapper>
        <Grid
          container
          alignItems="flex-start"
          justifyContent="flex-start"
          rowSpacing={3}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={12} lg={6}>
            <Grid
              container
              alignItems="flex-start"
              justifyContent="flex-start"
              flexDirection="column"
              gap="20px"
            >
              <Box sx={{ width: "100%" }}>
                <TextField
                  error={errors.eventTitle ? true : false}
                  margin="normal"
                  fullWidth
                  label="Task Title"
                  name="eventTitle"
                  onChange={handleChange}
                />
                {errors.eventTitle && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    {errors.eventTitle}
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: "100%" }}>
                <CustomDateTimePicker
                  name="startDate"
                  label="Start Date"
                  value={values.startDate}
                  handleChangeAdvance={handleChangeAdvance}
                  minDateTime={dayjs(new Date().toString())}
                />
                <br></br>
                {errors.startDate && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    {errors.startDate}
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: "100%" }}>
                <CustomDateTimePicker
                  name="endDate"
                  label="End Date"
                  value={values.endDate}
                  handleChangeAdvance={handleChangeAdvance}
                  minDateTime={dayjs(new Date(values.startDate).toString())}
                  disablePast
                />
                <br></br>
                {errors.endDate && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    {errors.endDate}
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: "100%" }}>
                <CustomAutocomplete
                  error={errors.task ? true : false}
                  name="task"
                  label="Task"
                  options={TaskList}
                  value={values.task}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
                {errors.priority && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    {errors.priority}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <Grid
              container
              alignItems="flex-start"
              justifyContent="flex-start"
              flexDirection="column"
              gap="20px"
            >
              <Box sx={{ width: "100%" }}>
                <TextField
                  error={errors.description ? true : false}
                  margin="normal"
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={11}
                  value={values.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    {errors.description}
                  </Typography>
                )}
                <Box sx={{ textAlign: "right" }}>
                  <Typography>
                    {characterRemaining.current} Characters remaining
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="flex-end"
          alignItems="flex-end"
          rowSpacing={3}
          sx={{ marginTop: "30px" }}
        >
          <Button variant="contained" onClick={handleCreate}>
            <Typography variant="subtitle2">Create</Typography>
          </Button>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default EventForm;
