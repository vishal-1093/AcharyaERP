import { useState, useEffect, lazy } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import useAlert from "../../../hooks/useAlert";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomModal = lazy(() => import("../../../components/CustomModal"));
const CustomFileInput = lazy(() =>
  import("../../../components/Inputs/CustomFileInput")
);

const initialVales = {
  hr: "",
  document: null,
  marks: "",
};

const requiredFields = ["document", "marks"];

function Result() {
  const [values, setValues] = useState(initialVales);
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [jobProfileData, setJobProfileData] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const checks = {
    document: [
      values.document,
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
    marks: [/^[0-9]+$/.test(values.marks)],
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
    marks: ["Invalid Marks"],
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/getAllInterviewerDeatils/${id}`)
      .then((res) => {
        setCrumbs([
          { name: "Job Portal", link: "/jobportal" },
          { name: res.data.data[0].firstname },
          { name: "Interview Log" },
        ]);

        setValues((prev) => ({
          ...prev,
          ["hr"]: res.data.data[0].hr_remarks
            ? res.data.data[0].hr_remarks
            : "",
        }));

        res.data.data.forEach((obj) => {
          setValues((prev) => ({
            ...prev,
            [obj.interviewer_id]: obj.interviewer_comments
              ? obj.interviewer_comments
              : "",
          }));
          obj.interviewer_comments
            ? setCommentStatus(false)
            : setCommentStatus(true);
        });

        setInterviewDetails(res.data.data);

        if (res.data.data[0].hr_remarks) {
          axios
            .get(`/api/employee/getJobProfileById/${id}`)
            .then((res) => {
              setJobProfileData(res.data.data);
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
        }
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitComments = async (data) => {
    const newData = new Object(data);
    newData.interviewer_comments = values[data.interviewer_id];
    const temp = [];
    temp.push(newData);

    await axios
      .put(`/api/employee/Interviewer/${id}`, temp)
      .then((res) => {
        if (res.status === 200) {
          setAlertMessage({
            severity: "success",
            message: " Interviewer comments saved successfully !!",
          });
          setAlertOpen(true);
          navigate("/ResultForm/" + id, { replace: true });
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  const hrComments = async () => {
    const hrCommentData = [];
    interviewDetails.forEach((obj) => {
      const updateHrRemarks = { ...obj };
      updateHrRemarks.hr_remarks = values.hr;
      hrCommentData.push(updateHrRemarks);
    });

    await axios
      .put(`/api/employee/Interviewer/${id}`, hrCommentData)
      .then((res) => {
        if (res.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "HR comments saved successfully !!",
          });
          setAlertOpen(true);
          navigate("/ResultForm/" + id, { replace: true });
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  const handleSelect = (val) => {
    const data = interviewDetails[0];
    const temp = {};
    temp.interview_id = data.interview_id;
    temp.comments = data.comments;
    temp.interview_date = data.interview_date;
    temp.job_id = data.job_id;
    temp.created_by = data.created_by;
    temp.schedule = data.schedule;
    temp.active = data.active;
    temp.created_username = data.created_username;
    temp.approve = val;
    temp.frontend_use_datetime = data.frontend_use_datetime;

    const result = async () => {
      await axios
        .put(`/api/employee/Interview/${data.interview_id}`, temp)
        .then((res) => {
          if (res.status === 200) {
            navigate("/JobPortal", { replace: true });
          }
        })
        .catch((err) => console.error(err));
    };

    const msg =
      val === "true" ? "Do you want to select?" : "Do you want to reject?";
    setModalContent({
      title: "",
      message: msg,
      buttons: [
        { name: "Yes", color: "primary", func: result },
        { name: "No", color: "primary", func: () => {} },
      ],
    });
    setModalOpen(true);
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };
  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
    }));
  };
  console.log(jobProfileData);
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

  const handleDocument = async () => {
    if (values.document !== null) {
      const dataArray = new FormData();
      dataArray.append("file", values.document);
      dataArray.append("interviewer_id", id);

      await axios
        .post(`/api/employee/HrFeedbackUploadFile`, dataArray)
        .then((res) => {
          if (res.data.success === true) {
            const jobProfileTemp = { ...jobProfileData };
            jobProfileTemp.marks_scored = values.marks;

            axios
              .put(`/api/employee/JobProfile/${id}`, jobProfileTemp)
              .then((putRes) => {
                console.log(putRes);
              })
              .catch((err) => console.error(err));
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
    }

    if (values.marks !== "") {
      const jobProfileTemp = { ...jobProfileData };
      jobProfileTemp.marks_scored = values.marks;

      await axios
        .put(`/api/employee/JobProfile/${id}`, jobProfileTemp)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.error(err));
    }
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

      <Box p={1}>
        <FormWrapper>
          <Grid container columnSpacing={4} rowSpacing={4}>
            {interviewDetails?.map((obj, i) => {
              return (
                <Grid item xs={12} md={4} key={i}>
                  <Card elevation={3}>
                    <CardHeader
                      title={obj.email}
                      titleTypographyProps={{ variant: "subtitle2" }}
                      sx={{
                        backgroundColor: "primary.main",
                        color: "headerWhite.main",
                        padding: 1,
                      }}
                    />
                    <CardContent>
                      <CustomTextField
                        name={obj.interviewer_id.toString()}
                        label="Comments"
                        value={values[obj.interviewer_id.toString()]}
                        handleChange={handleChange}
                        multiline
                        rows={5}
                        inputProps={{ maxLength: 500 }}
                      />
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => submitComments(obj)}
                        disabled={!values[obj.interviewer_id]}
                      >
                        Submit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}

            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardHeader
                  title="HR Comments"
                  titleTypographyProps={{
                    variant: "subtitle2",
                  }}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "headerWhite.main",
                    padding: 1,
                  }}
                />
                <CardContent>
                  <CustomTextField
                    name="hr"
                    label="Comments"
                    value={values.hr}
                    handleChange={handleChange}
                    multiline
                    rows={5}
                    inputProps={{ maxLength: 500 }}
                    disabled={commentStatus}
                  />
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={hrComments}
                    disabled={!values.hr}
                  >
                    Submit
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {interviewDetails.length > 0 && interviewDetails[0].hr_remarks ? (
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardHeader
                    title="Feedback"
                    titleTypographyProps={{
                      variant: "subtitle2",
                    }}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "headerWhite.main",
                      padding: 1,
                    }}
                  />
                  <CardContent>
                    <Grid container rowSpacing={4}>
                      <Grid item xs={12}>
                        <CustomFileInput
                          name="document"
                          label="Feedback Document"
                          file={values.document}
                          handleFileDrop={handleFileDrop}
                          handleFileRemove={handleFileRemove}
                          checks={checks.document}
                          errors={errorMessages.document}
                          helperText="PDF - smaller than 2 MB"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <CustomTextField
                          name="marks"
                          label="Total Marks Scored"
                          value={values.marks}
                          handleChange={handleChange}
                          checks={checks.marks}
                          errors={errorMessages.marks}
                          required
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "right" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleDocument}
                      disabled={feedbackLoading || !requiredFieldsValid()}
                    >
                      Submit
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ) : (
              <></>
            )}

            {interviewDetails.length > 0 &&
            interviewDetails[0].hr_remarks &&
            jobProfileData.marks_scored !== null ? (
              <Grid item xs={12} align="right">
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleSelect("true")}
                  >
                    Selected
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleSelect("false")}
                  >
                    Rejected
                  </Button>
                </Stack>
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

export default Result;
