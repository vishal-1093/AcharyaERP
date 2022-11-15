import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import useAlert from "../../../hooks/useAlert";
import CustomDateTimePicker from "../../../components/Inputs/CustomDateTimePicker";
import dayjs from "dayjs";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { convertTimeToString } from "../../../utils/DateTimeUtils";
import CustomModal from "../../../components/CustomModal";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  interViewer: "",
  subject: "",
  startDate: null,
  comments: "",
  schedule: true,
};

const requiredFields = ["interViewer", "subject", "startDate"];

const InterView = () => {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [interViewers, setInterViewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [loadingInterviewer, setLoadingInterviewer] = useState(false);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const setCrumbs = useBreadcrumbs();

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    interViewer: [values.interViewer.length > 0],
    subject: [values.subject !== ""],
    startDate: [values.startDate !== null],
  };

  const errorMessages = {
    interViewer: ["This field required"],
    subject: ["This field required"],
    startDate: ["This field required"],
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
    getInterviewer();
    getEmployeeDetails();

    if (pathname.toLowerCase() === "/interview/new/" + id) {
      setIsNew(true);
    } else {
      setIsNew(false);
      getData();
    }
  }, [pathname]);

  const getData = async () => {
    await axios
      .get(`${ApiUrl}/employee/getAllInterviewDeatils/${id}`)
      .then((res) => {
        const data = res.data.data[0];
        setValues({
          interViewer: data.employeeEmails,
          subject: data.position,
          startDate: data.frontend_use_datetime,
          comments: data.comments,
        });
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeDetails = async () => {
    await axios
      .get(`${ApiUrl}/employee/getJobProfileNameAndEmail/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Job Portal", link: "/jobportal" },
          { name: "Call for Interview" },
          { name: res.data.job_id },
          { name: res.data.firstname },
        ]);
        setEmployeeDetails(res.data);
      })
      .catch((err) => console.error(err));
  };

  const getInterviewer = async () => {
    await axios.get(`${ApiUrl}/employee/EmployeeDetails`).then((res) => {
      setInterViewers(
        res.data.data.map((obj) => ({
          value: obj.email,
          label: obj.email,
        }))
      );
    });
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      const date = convertDateToString(dayjs(values.startDate).$d)
        .split("/")
        .join("-");
      const tempTime = convertTimeToString(dayjs(values.startDate).$d).split(
        ":"
      );

      const time =
        tempTime[0] >= 12
          ? date +
            ", " +
            days[new Date(date.split("-").reverse().join("-")).getDay()] +
            " @ " +
            (tempTime[0] % 12) +
            ":" +
            tempTime[1] +
            " PM"
          : date +
            ", " +
            days[new Date(date.split("-").reverse().join("-")).getDay()] +
            " @ " +
            (tempTime[0] % 12) +
            ":" +
            tempTime[1] +
            " AM";

      temp.emails = values.interViewer.toString().split(",");

      temp.interview = {
        active: true,
        job_id: id,
        schedule: true,
        position: values.subject,
        interview_date: time,
        comments: values.comments,
        frontend_use_datetime: values.startDate,
      };
      temp.job_id = id;

      await axios
        .post(`${ApiUrl}/employee/saveInterviewSchedule/${id}`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Data saved successfully",
          });
          setAlertOpen(true);
          navigate("/Interview/Update/" + id, { replace: true });
        })
        .catch((error) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: error.res ? error.res.data.message : "Error",
          });
          setAlertOpen(true);
        });
    }
  };

  const candidateMail = () => {
    const sendtoCandidate = async () => {
      setLoadingCandidate(true);
      await axios
        .post(`${ApiUrl}/employee/emailForInterview/${id}`, {
          emails: [employeeDetails.email],
        })
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Mail sent to candidate Successfully",
            });
          }
          setLoadingCandidate(false);
          setAlertOpen(true);
          navigate("/JobPortal", { replace: true });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    setModalContent({
      title: "",
      message: "Do you want to send mail to Candidate?",
      buttons: [
        { name: "Yes", color: "primary", func: sendtoCandidate },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
  };

  const interviewerMail = () => {
    const sendMail = async () => {
      setLoadingInterviewer(true);
      await axios
        .post(`${ApiUrl}/employee/sendMailToInterviewers/${id}`, {
          emails: values.interViewer.toString().split(","),
        })
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Mail sent to interviewer Successfully",
            });
          }
          setLoadingInterviewer(false);
          setAlertOpen(true);
          navigate("/Interview/Update/" + id, { replace: true });
          getInterviewer();
          getEmployeeDetails();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    setModalContent({
      title: "",
      message: "Do you want to send mail to interviewer?",
      buttons: [
        { name: "Yes", color: "primary", func: sendMail },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
  };
  return (
    <>
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            alignItems="center"
            rowSpacing={4}
            columnSpacing={{ xs: 2, md: 4 }}
          >
            <Grid item xs={12} md={6}>
              <CustomMultipleAutocomplete
                name="interViewer"
                label="InterViewer"
                value={values.interViewer}
                options={interViewers}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.interViewer}
                errors={errorMessages.interViewer}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="subject"
                label="Position"
                value={values.subject}
                handleChange={handleChange}
                checks={checks.subject}
                errors={errorMessages.subject}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomDateTimePicker
                name="startDate"
                label="Interview Date"
                value={values.startDate}
                handleChangeAdvance={handleChangeAdvance}
                required
                disablePast
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                name="comments"
                label="Comments"
                value={values.comments}
                handleChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Button
                style={{ borderRadius: 7 }}
                variant="contained"
                color="primary"
                disabled={
                  loading ||
                  ((employeeDetails.mail_sent_status === 1 ||
                    employeeDetails.mail_sent_to_candidate == 1) &&
                    !isNew)
                }
                onClick={isNew ? handleCreate : handleCreate}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  <strong>Save</strong>
                )}
              </Button>
            </Grid>

            {!isNew ? (
              <>
                <Grid item xs={12}>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={12} md={6} align="right">
                      <Button
                        style={{ borderRadius: 7 }}
                        variant="contained"
                        color="success"
                        onClick={() => interviewerMail()}
                        disabled={employeeDetails.mail_sent_status === 1}
                      >
                        {loadingInterviewer ? (
                          <CircularProgress
                            size={25}
                            color="blue"
                            style={{ margin: "2px 13px" }}
                          />
                        ) : (
                          <strong>Send mail to Interviewer </strong>
                        )}
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Button
                        style={{ borderRadius: 7 }}
                        variant="contained"
                        color="success"
                        onClick={() => candidateMail()}
                        disabled={employeeDetails.mail_sent_status !== 1}
                      >
                        {loadingCandidate ? (
                          <CircularProgress
                            size={25}
                            color="blue"
                            style={{ margin: "2px 13px" }}
                          />
                        ) : (
                          <strong>Send mail to Candidate</strong>
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              ""
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
};

export default InterView;
