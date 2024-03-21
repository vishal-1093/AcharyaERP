import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CustomDateTimePicker from "../../../components/Inputs/CustomDateTimePicker";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import moment from "moment";
import dayjs from "dayjs";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomModal = lazy(() => import("../../../components/CustomModal"));

const initialValues = {
  interViewer: "",
  subject: "",
  startDate: null,
  comments: "",
  schedule: true,
};

const requiredFields = ["interViewer", "subject", "startDate"];

function InterView() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [interViewers, setInterViewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [loadingInterviewer, setLoadingInterviewer] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

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

  useEffect(() => {
    getInterviewer();
    getEmployeeDetails();
    getDesignationOptions();

    if (pathname.toLowerCase() === "/interview/new/" + id) {
      setIsNew(true);
    } else {
      setIsNew(false);
      getData();
    }
  }, [pathname]);

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

  const getDesignationOptions = async () => {
    await axios
      .get(`/api/employee/Designation`)
      .then((res) => {
        const designationData = [];
        res.data.data.forEach((obj) => {
          designationData.push({
            value: obj.designation_id,
            label: obj.designation_name,
          });
        });
        setDesignationOptions(designationData);
      })
      .catch((err) => console.error(err));
  };

  const getData = async () => {
    await axios
      .get(`/api/employee/getAllInterviewDeatils/${id}`)
      .then((res) => {
        const data = res.data.data[0];
        setValues({
          interViewer: data.employeeEmails.split(","),
          subject: data.designation_id,
          startDate: data.frontend_use_datetime,
          comments: data.comments,
        });
      })
      .catch((err) => console.error(err));
  };

  const getEmployeeDetails = async () => {
    await axios
      .get(`/api/employee/getJobProfileNameAndEmail/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Job Portal", link: "/jobportal" },
          { name: res.data.firstname },
          { name: "Call for Interview" },
        ]);

        setEmployeeDetails(res.data);
      })
      .catch((err) => console.error(err));
  };

  const getInterviewer = async () => {
    await axios
      .get(`/api/employee/EmployeeDetails`)
      .then((res) => {
        const interviewerData = [];
        res.data.data.forEach((obj) => {
          interviewerData.push({ value: obj.email, label: obj.email });
        });
        setInterViewers(interviewerData);
      })
      .catch((err) => console.error(err));
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
      const selectedDate = moment(values.startDate).format("DD-MM-YYYY");
      const selectedDay = moment(values.startDate).format("dddd");
      const selectedTime = moment(values.startDate).format("LT");

      setLoading(true);
      const temp = {};
      temp.emails = values.interViewer;
      temp.interview = {
        active: true,
        job_id: id,
        schedule: true,
        designation_id: values.subject,
        interview_date:
          selectedDate + ", " + selectedDay + " @ " + selectedTime,
        comments: values.comments,
        frontend_use_datetime: values.startDate,
      };
      temp.job_id = id;

      await axios
        .post(`/api/employee/saveInterviewSchedule/${id}`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: "Saved successfully !!",
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
        .post(`/api/employee/emailForInterview/${id}`, {
          emails: [employeeDetails.email],
        })
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Mail sent to candidate Successfully !!",
            });
          }
          setLoadingCandidate(false);
          setAlertOpen(true);
          navigate("/JobPortal", { replace: true });
        })
        .catch((err) => {
          console.error(err);
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
        .post(`/api/employee/sendMailToInterviewers/${id}`, {
          emails: values.interViewer,
        })
        .then((res) => {
          if (res.status === 200) {
            setAlertMessage({
              severity: "success",
              message: "Mail sent to interviewer Successfully !!",
            });
          }
          setLoadingInterviewer(false);
          setAlertOpen(true);
          navigate("/Interview/Update/" + id, { replace: true });
          getInterviewer();
          getEmployeeDetails();
        })
        .catch((err) => {
          console.error(err);
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
      {/* Confirm Modal  */}
      <CustomModal
        open={modalOpen}
        setOpen={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
      />

      {/* Form  */}
      <Box p={1}>
        <FormWrapper>
          <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={6}>
              <CustomMultipleAutocomplete
                name="interViewer"
                label="InterViewer"
                value={values.interViewer}
                options={interViewers}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.interViewer}
                errors={errorMessages.interViewer}
                disabled={
                  (employeeDetails.mail_sent_status === 1 ||
                    employeeDetails.mail_sent_to_candidate === 1) &&
                  !isNew
                }
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomAutocomplete
                name="subject"
                label="Position"
                value={values.subject}
                options={designationOptions}
                handleChangeAdvance={handleChangeAdvance}
                checks={checks.subject}
                errors={errorMessages.subject}
                disabled={
                  (employeeDetails.mail_sent_status === 1 ||
                    employeeDetails.mail_sent_to_candidate === 1) &&
                  !isNew
                }
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomDateTimePicker
                name="startDate"
                label="Interview Date"
                value={values.startDate}
                handleChangeAdvance={handleChangeAdvance}
                disabled={
                  (employeeDetails.mail_sent_status === 1 ||
                    employeeDetails.mail_sent_to_candidate === 1) &&
                  !isNew
                }
                minDateTime={
                  isNew || new Date() < new Date(values.startDate)
                    ? dayjs(new Date().toString())
                    : dayjs(new Date(values.startDate).toString())
                }
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="comments"
                label="Comments"
                value={values.comments}
                handleChange={handleChange}
                disabled={
                  (employeeDetails.mail_sent_status === 1 ||
                    employeeDetails.mail_sent_to_candidate === 1) &&
                  !isNew
                }
                multiline
                rows={2}
              />
            </Grid>

            {isNew ||
            (employeeDetails.mail_sent_status !== 1 &&
              employeeDetails.mail_sent_to_candidate !== 1) ? (
              <Grid item xs={12} align="right">
                <Button
                  style={{ borderRadius: 7 }}
                  variant="contained"
                  color="primary"
                  disabled={loading || !requiredFieldsValid()}
                  onClick={isNew ? handleCreate : handleCreate}
                >
                  {loading ? (
                    <CircularProgress
                      size={25}
                      color="blue"
                      style={{ margin: "2px 13px" }}
                    />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Grid>
            ) : (
              <></>
            )}

            {!isNew ? (
              <Grid item xs={12}>
                <Grid container columnSpacing={2}>
                  <Grid item xs={12} md={6} align="right">
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="success"
                      onClick={interviewerMail}
                      disabled={employeeDetails.mail_sent_status === 1}
                    >
                      {loadingInterviewer ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        "Send mail to Interviewer"
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      style={{ borderRadius: 7 }}
                      variant="contained"
                      color="success"
                      onClick={candidateMail}
                      disabled={employeeDetails.mail_sent_status !== 1}
                    >
                      {loadingCandidate ? (
                        <CircularProgress
                          size={25}
                          color="blue"
                          style={{ margin: "2px 13px" }}
                        />
                      ) : (
                        "Send mail to Candidate"
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default InterView;
