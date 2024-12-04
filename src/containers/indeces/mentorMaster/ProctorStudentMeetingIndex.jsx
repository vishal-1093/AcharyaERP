import { React, useState, useEffect } from "react";
import GridIndex from "../../../components/GridIndex";
import { useLocation, useNavigate } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import ForumIcon from "@mui/icons-material/Forum";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Box,
  IconButton,
  Grid,
  Typography,
  styled,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import axios from "../../../services/Api";
import ModalWrapper from "../../../components/ModalWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import moment from "moment/moment";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

const initialValues = {
  proctorId: null,
  faq: "",
  minutesOfMeeting: "",
  feedbackDate: null,
};

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.6)",
    maxWidth: 270,
    fontSize: 12,
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
    padding: "10px",
    textAlign: "justify",
  },
}));

function ProctorStudentMeetingIndex() {
  const [rows, setRows] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);
  const [proctorIds, setProctorIds] = useState([]);
  const [proctorData, setProctorData] = useState([]);

  const [values, setValues] = useState(initialValues);

  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { pathname } = useLocation();

  useEffect(() => {
    getData();

    setCrumbs([{ name: "Mentor Student Meeting Index" }]);
  }, []);

  const checks = {
    minutesOfMeeting: [
      values.minutesOfMeeting !== "",
      /^(.|\n){1,200}$/.test(values.minutesOfMeeting),
    ],
  };

  const errorMessages = {
    minutesOfMeeting: ["This field is required", "Enter only 200 characters"],
  };

  const getData = async () => {
    await axios
      .get(
        `/api/proctor/fetchAllProctorStudentMeetingBasedOnUserId?page=${0}&page_size=${10000}&sort=created_date&user_id=${userId}`
      )
      .then((Response) => {
        setRows(Response.data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSelectionModelChange = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
    setProctorIds(selectedRowsData.map((val) => val.id));
    setProctorData(selectedRowsData);
  };

  const handleFeedback = async (params) => {
    setValues((prev) => ({
      ...prev,
      ["feedbackDate"]: null,
      ["minutesOfMeeting"]: "",
    }));
    setData(params.row);
    if (proctorData.length > 0) {
      setFeedbackOpen(true);
    } else {
      setModalContent({
        title: "Give Feedback",
        message: "Please select the checkbox !!!!",
      });
      setModalOpen(true);
    }
  };

  const handleCreate = async () => {
    const temp = [];

    proctorData.map((obj) => {
      temp.push({
        active: true,
        meeting_type: obj.meeting_type,
        proctor_student_meeting_id: obj.id,
        meeting_id: obj.meeting_id,
        chief_proctor_id: obj.chief_proctor_id,
        proctor_id: obj.proctor_id,
        emp_id: obj.emp_id,
        student_id: obj.student_id,
        remarks: obj.remarks,
        date_of_meeting: obj.date_of_meeting,
        meeting_agenda: obj.meeting_agenda,
        feedback: values.minutesOfMeeting,
        faq_id: obj.faq_id,
        feedback_date: values.feedbackDate
          ? values.feedbackDate.substr(0, 19) + "Z"
          : "",
        mode_of_contact: obj.mode_of_contact,
        parent_name: obj.parent_name,
        school_id: obj.school_id,
      });
    });

    await axios
      .put(
        `/api/proctor/updateProctorStudentMeeting/${proctorIds.toString()}`,
        temp
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setAlertMessage({ severity: "success", message: "Feedback updated" });
          setAlertOpen(true);
          getData();
          setFeedbackOpen(false);
        }
      })
      .catch((err) => {
        setAlertMessage({
          severity: "error",
          message: err.response
            ? err.response.data.message
            : "An error occured",
        });
        setAlertOpen(true);
      });
  };

  const columns = [
    { field: "meeting_type", headerName: "Meeting Type", flex: 1 },
    { field: "employeeName", headerName: "Proctor", flex: 1 },
    { field: "student_name", headerName: "Student", flex: 1 },
    { field: "auid", headerName: "AUID", flex: 1 },
    { field: "meeting_agenda", headerName: "Meeting Agenda", flex: 1 },
    {
      field: "date_of_meeting",
      headerName: "Meeting Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.date_of_meeting
          ? moment(params.row.date_of_meeting).format("DD-MM-YYYY")
          : "",
    },
    {
      field: "feedback",
      headerName: "MOM",
      flex: 1,
      renderCell: (params) => {
        return params?.row?.feedback?.length > 15 ? (
          <HtmlTooltip title={params.row.feedback}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.feedback.substr(0, 13) + "..."}
            </Typography>
          </HtmlTooltip>
        ) : (
          <HtmlTooltip title={params.row.feedback}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ fontSize: 13, cursor: "pointer" }}
            >
              {params.row.feedback}
            </Typography>
          </HtmlTooltip>
        );
      },
    },
    {
      field: "give feeback",
      type: "actions",
      flex: 1,
      headerName: "Give feedback",
      getActions: (params) => [
        <IconButton label="" onClick={() => handleFeedback(params)}>
          <ForumIcon />
        </IconButton>,
      ],
    },

    {
      field: "feedback_date",
      headerName: "Feedback Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.feedback_date
          ? moment(params.row.feedback_date).format("DD-MM-YYYY")
          : "",
    },
  ];
  return (
    <>
      <Box sx={{ position: "relative", mt: 4 }}>
        <CustomModal
          open={modalOpen}
          setOpen={setModalOpen}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
        />

        <ModalWrapper
          title="Give Feedback"
          maxWidth={800}
          open={feedbackOpen}
          setOpen={setFeedbackOpen}
        >
          <Grid
            container
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={2}
            marginTop={2}
          >
            <Grid item xs={12} md={8}>
              <CustomTextField
                multiline
                rows={2}
                name="minutesOfMeeting"
                label="Minutes of meeting / Meeting output"
                value={values.minutesOfMeeting}
                handleChange={handleChange}
                checks={checks.minutesOfMeeting}
                errors={errorMessages.minutesOfMeeting}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomDatePicker
                name="feedbackDate"
                label="Feedback Date"
                value={values.feedbackDate}
                handleChangeAdvance={handleChangeAdvance}
                disablePast
                required
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleCreate}
                sx={{ borderRadius: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </ModalWrapper>

        {pathname.toLowerCase() === "/proctorstudentmaster/meeting" ? (
          <Button
            onClick={() => navigate("/MentorStudentMeeting")}
            variant="contained"
            disableElevation
            sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/MentorStudentMeeting")}
            variant="contained"
            disableElevation
            sx={{ position: "absolute", right: 0, top: -57, borderRadius: 2 }}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        )}

        <GridIndex
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => onSelectionModelChange(ids)}
        />
      </Box>
    </>
  );
}
export default ProctorStudentMeetingIndex;
