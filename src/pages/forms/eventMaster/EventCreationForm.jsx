import { useState, useEffect, useRef, lazy } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import dayjs from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { makeStyles } from "@mui/styles";

const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomRadioButtons = lazy(() =>
  import("../../../components/Inputs/CustomRadioButtons")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const CustomDateTimePicker = lazy(() =>
  import("../../../components/Inputs/CustomDateTimePicker")
);

const initialValues = {
  eventTitle: "",
  eventSubTitle: "",
  guestName: "",
  description: "",
  startTime: null,
  endTime: null,
  isCommon: "No",
  schoolId: null,
  roomId: null,
  imgFile: "",
  documents: "",
  approverStatus: "",
};

const requiredFields = [
  "eventTitle",
  "eventSubTitle",
  "guestName",
  "description",
  "startTime",
  "endTime",
  "isCommon",
  "roomId",
];

const useStyles = makeStyles((theme) => ({
  dropFileInput: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7ff",
    height: 180,
    maxWidth: 260,
    margin: "auto",
    border: `3px dashed ${theme.palette.primary.main}`,
    borderRadius: 20,

    "&:hover, &.dragover": {
      opacity: 0.7,
    },
  },
  input: {
    opacity: 0,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  helperText: {
    color: "#555",
    fontSize: "0.85rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.75rem",
    },
  },
  labelText: {
    textAlign: "center",
    fontSize: "0.90rem",
    margin: "20px 10px 0 10px",
    "&:hover": {
      backgroundColor: "red",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "0.9rem",
      margin: "10px 5px 0 5px",
    },
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 350,
    margin: "auto !important",
    backgroundColor: "#e4e4ff",
    borderRadius: 10,
    borderLeft: `10px solid ${theme.palette.success.main}`,
    marginTop: "17px !important",
    padding: "0 10px",
  },
  fileName: {
    fontSize: "0.9rem",
    margin: "5px 0",
    overflow: "hidden",
  },
  fileSize: {
    fontSize: "0.8rem",
    margin: "5px 0",
  },
  error: {
    color: theme.palette.error.main,
    fontSize: "1rem",
    maxWidth: 350,
    margin: "10px auto",
    paddingLeft: 10,
  },
}));

const userID = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function EventCreationForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [eventId, setEventId] = useState(null);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);
  const [allSchoolId, setAllSchoolId] = useState([]);
  const [roomNameOptions, setRoomNameOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomIdForUpdate, setRoomIdForUpdate] = useState(null);
  const [fileSelected, setFileSelected] = useState([]);
  const [showError, setShowError] = useState();
  const [userId, setUserId] = useState(null);

  const { id } = useParams();
  const classes = useStyles();
  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");

  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");

  const onDrop = () => wrapperRef.current.classList.remove("dragover");

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
    getRoomNameOptions();
    getLeaveApproverUserId();
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

  useEffect(() => {
    const showValidation = fileSelected.every(
      (obj) =>
        obj.name.toLowerCase().endsWith("png") ||
        obj.name.toLowerCase().endsWith("jpg") ||
        obj.name.toLowerCase().endsWith("jpeg")
    );
    setShowError(showValidation);
  }, [fileSelected]);

  const uploadMultiFiles = (e) => {
    const files = Array.from(e.target.files);
    setFileSelected(files);
  };

  const getLeaveApproverUserId = async () => {
    await axios
      .get(`/api/employee/getEmpLeaveApproverBasedOnUserId/${userID}`)
      .then((res) => {
        setUserId(res.data.data[0].UserId);
      })
      .catch((err) => console.error(err));
  };

  const getEventData = async () => {
    await axios
      .get(`/api/institute/eventCreation/${id}`)
      .then((res) => {
        setValues({
          eventTitle: res.data.data.event_name,
          eventSubTitle: res.data.data.event_sub_name,
          guestName: res.data.data.guest_name,
          description: res.data.data.event_description,
          isCommon: res.data.data.is_common,
          schoolId: Number(res.data.data.school_id),
          startTime: res.data.data.event_start_time,
          endTime: res.data.data.event_end_time,
          roomId: res.data.data.room_id,
          approverStatus: res.data.data.approved_status,
        });
        getRoomId();
        setEventId(res.data.data.event_id);
        setCrumbs([
          { name: "EventMaster", link: "/EventMaster/Events" },
          { name: "Event" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const getRoomId = async () => {
    await axios
      .get(`/api/institute/eventBlockedRooms/${id}`)
      .then((res1) => {
        setValues((prev) => ({ ...prev, ["roomId"]: res1.data.data.room_id }));
        setRoomIdForUpdate(res1.data.data.room_id);
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
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolNameOptions(data);
      })
      .catch((err) => console.error(err));
  };

  const getRoomNameOptions = async () => {
    if (values.startTime && values.endTime)
      await axios
        .get(
          `/api/institute/getAvailableBlockAndRooms?event_start_time=${
            values.startTime.substr(0, 19) + "Z"
          }&event_end_time=${values.endTime.substr(0, 19) + "Z"}`
        )
        .then((res) => {
          const data = [];
          res.data.forEach((obj) => {
            data.push({
              value: obj.room_id,
              label: obj.roomCodeWithBlocKAndFacilityType,
            });
          });
          setRoomNameOptions(data);
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
      temp.event_start_time = values.startTime;
      temp.event_end_time = values.endTime;
      temp.is_common = values.isCommon;
      temp.approved_by = userId;
      temp.approved_status = "Pending";
      if (values.isCommon.toLowerCase() === "yes") {
        temp.school_id = allSchoolId.toString();
      } else {
        temp.school_id = values.schoolId.toString();
      }
      await axios
        .post(`/api/institute/eventCreation`, temp)
        .then(async (res) => {
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

          const eventId = res.data.data.event_id;
          await axios
            .post(`/api/institute/eventBlockedRooms`, temp2)
            .then((res) => {
              setLoading(false);
              if (
                res.status === 200 ||
                res.status === 201 ||
                res.status === 208
              ) {
                const formData = new FormData();
                for (let i = 0; i < fileSelected.length; i++) {
                  formData.append(`file`, fileSelected[i]);
                }
                formData.append("event_id", eventId);
                formData.append("image_upload_timing", "Before");
                formData.append("active", true);
                axios
                  .post(
                    `/api/institute/eventImageAttachmentsUploadFile`,
                    formData
                  )
                  .then((res) => {});
                navigate("/EventMaster/Events", { replace: true });
                setAlertMessage({
                  severity: "success",
                  message: "Event Created Successfully",
                });
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
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.response ? error.response.data.message : "Error",
          });
          setAlertOpen(true);
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
      temp.is_common = values.isCommon;
      temp.event_start_time = values.startTime;
      temp.event_end_time = values.endTime;
      temp.approved_status = values.approverStatus;
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

  const deleteFile = (e) => {
    const removeSelected = fileSelected.filter((item, index) => index !== e);
    setFileSelected(removeSelected);
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
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
              minDateTime={dayjs(new Date().toString())}
              disablePast
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
              minDateTime={dayjs(new Date(values.startTime).toString())}
              disablePast
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
            </>
          ) : (
            <></>
          )}
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
          {isNew ? (
            <>
              <Grid item xs={12} align="center">
                <div
                  className={classes.dropFileInput}
                  ref={wrapperRef}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <input
                    type="file"
                    onChange={uploadMultiFiles}
                    className={classes.input}
                    multiple
                  />
                  <CloudUploadIcon
                    sx={{ color: "auzColor.main", fontSize: 50 }}
                  />

                  <p className={classes.labelText}>
                    Drop your
                    <span style={{ fontWeight: 500, fontSize: "0.90rem" }}>
                      {"  " + "IMAGES" + "  "}
                    </span>
                    here or
                    <span style={{ color: "auzColor.main", fontWeight: 500 }}>
                      {" "}
                      browse
                    </span>
                  </p>
                </div>

                {!showError && (
                  <p
                    style={{
                      color: "#d13932",
                      fontSize: "1rem",
                      maxWidth: 350,
                      margin: "10px auto",
                      paddingLeft: 10,
                    }}
                  >
                    PLEASE UPLOAD PNG , JPG OR JPEG FORMAT
                  </p>
                )}
              </Grid>
            </>
          ) : (
            <></>
          )}

          {fileSelected.map((file, index) => {
            return (
              <>
                <Grid item xs={12} md={2.4} key={index}>
                  <Paper
                    elevation={5}
                    sx={{
                      width: 300,
                      height: 180,
                      marginTop: 5,
                      borderRadius: 5,
                    }}
                  >
                    <Grid container sx={{ background: "#edeff7" }}>
                      <Grid item xs={12} align="right">
                        <IconButton
                          aria-label="settings"
                          onClick={() => deleteFile(index)}
                          color="primary"
                        >
                          <HighlightOffIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <img
                          style={{ width: 300, height: 180 }}
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt="..."
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </>
            );
          })}

          <Grid item xs={12} align="right">
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading || !showError}
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
