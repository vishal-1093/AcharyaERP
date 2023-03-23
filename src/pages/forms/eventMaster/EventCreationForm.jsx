import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDateTimePicker from "../../../components/Inputs/CustomDateTimePicker";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import dayjs from "dayjs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { makeStyles } from "@mui/styles";

const initialValues = {
  eventTitle: "",
  eventSubTitle: "",
  guestName: "",
  description: "",
  startTime: null,
  endTime: null,
  isCommon: "",
  schoolId: [],
  roomId: null,
  imgFile: "",
};

const requiredFields = [
  "eventTitle",
  "eventSubTitle",
  "guestName",
  "description",
  "startTime",
  "endTime",
  "isCommon",
];

const useStyles = makeStyles((theme) => ({
  dropFileInput: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7ff",
    height: 200,
    maxWidth: 350,
    margin: "auto",
    border: `3px dashed ${theme.palette.primary.main}`,
    borderRadius: 20,
    "&:hover, &.dragover": {
      opacity: 0.7,
    },
  },
}));

function EventCreationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [eventId, setEventId] = useState(null);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [allSchoolId, setAllSchoolId] = useState([]);
  const [roomNameOptions, setRoomNameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState([]);

  const { id } = useParams();
  const classes = useStyles();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {
    eventTitle: [values.eventTitle !== ""],
    eventSubTitle: [values.eventSubTitle !== ""],
    guestName: [values.guestName !== ""],
    description: [values.description !== ""],
    startTime: [values.startTime !== null],
    endTime: [values.endTime !== null],
    isCommon: [values.isCommon !== ""],
    imgFile: [
      values.imgFile !== "",
      values.imgFile && values.imgFile.size < 2000000,
    ],
  };

  const errorMessages = {
    eventTitle: ["This field is required"],
    eventSubTitle: ["This field is required"],
    guestName: ["This field is required"],
    description: ["This field required"],
    startTime: ["This field is required"],
    endTime: ["This field required"],
    isCommon: ["This field required"],
    imgFile: ["This field is required", "Maximum size 2 MB"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/eventmaster/event/new") {
      setIsNew(true);
      setCrumbs([
        { name: "EventMaster", link: "/EventMaster/Events" },
        { name: "Event" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getEventData();
    }
  }, []);

  const getEventData = async () => {
    await axios
      .get(`/api/institute/eventCreation/${id}`)
      .then((res) => {
        setValues({
          eventTitle: res.data.data.event_name,
          eventSubTitle: res.data.data.event_sub_name,
          guestName: res.data.data.guest_name,
          description: res.data.data.event_description,
          isCommon: res.data.data.isCommon,
        });
        setEventId(res.data.data.event_id);
        setCrumbs([
          { name: "EventMaster", link: "/EventMaster/Events" },
          { name: "Event" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
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

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (Object.keys(checks).includes(field)) {
        const ch = checks[field];
        for (let j = 0; j < ch.length; j++) if (!ch[j]) return false;
      } else if (!values[field]) return false;
    }
    return true;
  };
  useEffect(() => {
    getSchoolNameOptions();
    getRoomNameOptions();
  }, [values.startTime, values.endTime]);

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setAllSchoolId(res.data.data.map((val) => val.school_id));
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  const getRoomNameOptions = async () => {
    if (values.startTime && values.endTime)
      await axios
        .get(
          `/api/institute/getAvailableBlockAndRooms?event_start_time=${values.startTime.toISOString()}&event_end_time=${values.endTime.toISOString()}`
        )
        .then((res) => {
          setRoomNameOptions(
            res.data.data.map((obj) => ({
              value: obj.room_id,
              label: obj.roomCodeWithBlocKAndFacilityType,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.event_name = values.eventTitle;
      temp.event_sub_name = values.eventSubTitle;
      temp.event_description = values.description;
      temp.guest_name = values.guestName;
      temp.event_start_time = values.startTime.toISOString();
      temp.event_end_time = values.endTime.toISOString();
      if (values.isCommon.toLowerCase() === "yes") {
        temp.school_id = allSchoolId.toString();
      } else {
        temp.school_id = values.schoolId.toString();
      }

      await axios.post(`/api/institute/eventCreation`, temp).then((res) => {
        const temp1 = {};
        temp1.active = true;
        temp1.event_id = res.data.data.event_id;
        temp1.room_id = values.roomId;
        const temp2 = [];
        temp2.push({
          active: true,
          event_id: res.data.data.event_id,
          room_id: values.roomId,
        });

        var eventId = res.data.data.event_id;

        axios
          .post(`/api/institute/eventBlockedRooms`, temp2)
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              const formData = new FormData();

              axios
                .post(
                  `/api/institute/eventImageAttachmentsUploadFile`,
                  formData
                )
                .then((res) => {})
                .catch((err) => console.error(err));
              setAlertMessage({
                severity: "success",
                message: "Event Created Successfully",
              });

              navigate("/EventMaster/Events", { replace: true });
            } else {
              setAlertMessage({
                severity: "error",
                message: res.data ? res.data.message : "Error Occured",
              });
            }
            setAlertOpen(true);
          })

          .catch((error) => {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: error.response ? error.response.data.message : "Error",
            });
            setAlertOpen(true);
          });
      });
    }
  };

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.event_id = eventId;
      temp.event_name = values.eventTitle;
      temp.event_sub_name = values.eventSubTitle;
      temp.event_description = values.description;
      temp.guest_name = values.guestName;
      temp.event_start_time = values.startTime.toISOString();
      temp.event_end_time = values.endTime.toISOString();
      if (values.isCommon.toLowerCase() === "yes") {
        temp.school_id = allSchoolId.toString();
      } else {
        temp.school_id = values.schoolId.toString();
      }
      temp.roomId = values.roomId;
      await axios
        .put(`/api/institute/eventCreation/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Event Updated Successfully",
            });
            navigate("/EventMaster/Events", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response.data.message,
          });
        });
    }
  };

  const uploadSingleFile = (e) => {
    setFile([...file, URL.createObjectURL(e.target.files[0])]);
  };

  const upload = (e) => {
    e.preventDefault();
  };

  const deleteFile = (e) => {
    const s = file.filter((item, index) => index !== e);
    setFile(s);
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="eventTitle"
              label="Event Title"
              value={values.eventTitle}
              handleChange={handleChange}
              errors={errorMessages.eventTitle}
              checks={checks.eventTitle}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="eventSubTitle"
              label="Event Sub Title"
              value={values.eventSubTitle}
              handleChange={handleChange}
              errors={errorMessages.eventSubTitle}
              checks={checks.eventSubTitle}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="guestName"
              label="Guest Name"
              value={values.guestName}
              handleChange={handleChange}
              errors={errorMessages.guestName}
              checks={checks.guestName}
              required
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2.5}>
            <CustomTextField
              rows={2}
              multiline
              name="description"
              label="Description"
              value={values.description}
              handleChange={handleChange}
              errors={errorMessages.description}
              checks={checks.description}
              required
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2.5}>
            <CustomDateTimePicker
              name="startTime"
              label="Start time"
              value={values.startTime}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.startTime}
              errors={errorMessages.startTime}
              minDateTime={
                isNew || new Date() < new Date(values.startDate)
                  ? dayjs(new Date().toString())
                  : dayjs(new Date(values.startDate).toString())
              }
              required
            />
          </Grid>
          <Grid item xs={12} md={4} mt={2.5}>
            <CustomDateTimePicker
              name="endTime"
              label="End time"
              value={values.endTime}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.endTime}
              errors={errorMessages.endTime}
              minDateTime={values.startTime}
              required
              helperText=""
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="isCommon"
              label="Is Common ? "
              value={values.isCommon}
              items={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              handleChange={handleChange}
              required
            />
          </Grid>
          {values.isCommon === "No" ? (
            <>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="schoolId"
                  label="Institute"
                  options={SchoolNameOptions}
                  value={values.schoolId}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <CustomAutocomplete
                  name="roomId"
                  label="Room"
                  options={roomNameOptions}
                  value={values.roomId}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          <Grid item md={3} mt={2} className={classes.dropFileInput}>
            <Button variant="contained" component="label">
              <CloudUploadIcon fontSize="large" />
              <input
                type="file"
                value={values.imgFile}
                disabled={file.length === 4}
                className="form-control"
                onChange={uploadSingleFile}
                hidden
                // onChange={uploadFileHandler}
              />
            </Button>
            <Button
              type="button"
              className="btn btn-primary btn-block"
              onClick={upload}
            >
              Upload
            </Button>
          </Grid>

          {file.map((item, index) => {
            return (
              <>
                <Grid item display="flex-start">
                  <img src={item} alt="" style={{ width: 150, height: 150 }} />
                </Grid>
                <Button
                  type="button"
                  onClick={() => deleteFile(index)}
                  sx={{ marginLeft: -3, marginTop: -16, color: "red" }}
                >
                  X
                </Button>
              </>
            );
          })}

          <Grid item xs={12} md={6}>
            {" "}
          </Grid>
          <Grid item textAlign="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={isNew ? handleCreate : handleUpdate}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{isNew ? "Create" : "Update"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default EventCreationForm;
