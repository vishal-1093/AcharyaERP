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
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";

const initialValues = {
  eventTitle: "",
  description: "",
  startDate: "",
  endDate: "",
  type: "Faculty",
  contributionType: "",
  taskType: ""
};

const TaskList = [
  { label: "Primary", value: "Primary" },
  { label: "Secondary", value: "Secondary" },
  { label: "Additional", value: "Additional" },
];

const ContributionType = [
  { label: "Departmental Level", value: "Departmental Level" },
  { label: "Institutional Level", value: "Institutional Level" },
  { label: "University Level", value: "University Level" },
]

const DepartmentalTask = [
  { label: "Membership", value: "Membership" },
  { label: "Participation in bodies/committees on education", value: "Participation in bodies/committees on education" },
  { label: "Participation in departmental Activity", value: "Participation in departmental Activity" }
]

const InstitutionalTask = [
  { label: "Dean/HoD/Heads (IQAC/SEP/OBE/Affiliation/Accreditation) of institutional level committees", value: "Dean/HoD/Heads (IQAC/SEP/OBE/Affiliation/Accreditation) of institutional level committees" },
  { label: "Participation in institutional level committees", value: "Participation in institutional level committees" }
]

const UniversityTask = [
  { label: "External Examiners/Question paper setting", value: "External Examiners/Question paper setting" },
  { label: "Member in committee and other university", value: "Member in committee and other university" },
  { label: "University level responsibilities ", value: "University level responsibilities" }
]

const EventForm = () => {
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const TOTAL_CHARACTERS = 200;
  const characterRemaining = useRef(200);
  const [loading, setLoading] = useState(false)
  const [taskTypeList, setTaskTypeList] = useState([])

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

    if (e.target.name === "type") {
      setTaskTypeList([])
      setValues((prev) => ({
        ...prev,
        "contributionType": "",
        "taskType": "",
      }));
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

    if (name === "contributionType") {
      if (newValue === "Departmental Level") setTaskTypeList(DepartmentalTask)
      else if (newValue === "Institutional Level") setTaskTypeList(InstitutionalTask)
      else if (newValue === "University Level") setTaskTypeList(UniversityTask)

      setValues((prev) => ({
        ...prev,
        "taskType": "",
      }));
    }
  };

  const handleError = (payload) => {
    const { eventTitle, startDate, endDate, task, contributionType, taskType } = payload;
    let error = {};

    if (eventTitle === null || eventTitle === "")
      error["eventTitle"] = "Event Title is required";

    if (startDate === null || startDate === "")
      error["startDate"] = "Start Date is required";

    if (endDate === null || endDate === "")
      error["endDate"] = "End Date is Required";

    if (task === null || task === "") error["task"] = "Task is Required";

    if (values.type === "Faculty") {
      if (contributionType === null || contributionType === "") error["contributionType"] = "Contribution Type is Required";

      if (taskType === null || taskType === "") error["taskType"] = "Task Type is Required";
    }

    return { error, isValid: Object.keys(error).length <= 0 };
  };

  const handleCreate = async () => {
    setLoading(true)
    setErrors({});

    const payload = {
      eventTitle: values.eventTitle,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      task: values.task,
      contributionType: values.contributionType,
      taskType: values.taskType
    };

    const { error, isValid } = handleError(payload);
    console.log(error, isValid);
    
    if (!isValid) {
      setErrors(error)
      setLoading(false)
      return
    }

    const empId = await getEmpId();
    if (empId === null) {
      setLoading(false)
      alert("No User Found");
      return
    }
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
      type: values.type,
      contribution_type: values.contributionType,
      task_type: values.taskType
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
        setLoading(false)
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
              flexDirection="row">
              <Grid item xs={12} md={12} lg={12}>
                <CustomRadioButtons
                  name="type"
                  label="Type"
                  value={values.type}
                  items={[
                    { value: "Faculty", label: "Faculty" },
                    { value: "Personal", label: "Personal" },
                  ]}
                  handleChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Grid
              container
              alignItems="flex-start"
              justifyContent="flex-start"
              flexDirection="column"
              gap="20px"
            >
              {values.type === "Faculty" &&
                <Box sx={{ width: "100%" }}>
                  <CustomAutocomplete
                    error={errors.contributionType ? true : false}
                    name="contributionType"
                    label="Contribution Type"
                    options={ContributionType}
                    value={values.contributionType}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                  {errors.contributionType && (
                    <Typography variant="caption" sx={{ color: "red" }}>
                      {errors.contributionType}
                    </Typography>
                  )}
                </Box>}
              {values.type === "Faculty" &&
                <Box sx={{ width: "100%" }}>
                  <CustomAutocomplete
                    error={errors.taskType ? true : false}
                    name="taskType"
                    label="Task Type"
                    options={taskTypeList}
                    value={values.taskType}
                    handleChangeAdvance={handleChangeAdvance}
                    required
                  />
                  {errors.taskType && (
                    <Typography variant="caption" sx={{ color: "red" }}>
                      {errors.taskType}
                    </Typography>
                  )}
                </Box>}
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
                {errors.task && (
                  <Typography variant="caption" sx={{ color: "red" }}>
                    {errors.task}
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
                  rows={14}
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
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            <Typography variant="subtitle2">Create</Typography>
          </Button>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default EventForm;
