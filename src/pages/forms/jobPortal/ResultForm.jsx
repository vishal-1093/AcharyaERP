import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import FormWrapper from "../../../components/FormWrapper";
import ApiUrl from "../../../services/Api";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomModal from "../../../components/CustomModal";

const Result = () => {
  const { id } = useParams();
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [values, setValues] = useState({});
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`${ApiUrl}/employee/getAllInterviewerDeatils/${id}`)
      .then((res) => {
        setInterviewDetails(res.data.data);
        const defValues = {
          hr: res.data.data[0].hr_remarks,
        };
        res.data.data.map((obj) => {
          defValues[obj.interviewer_id] = obj.interviewer_comments;
        });
        setValues(defValues);
        setCrumbs([
          { name: "Job Portal", link: "/jobportal" },
          { name: "Interview Log" },
          { name: res.data.data[0].job_id },
          { name: res.data.data[0].firstname },
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

  const submitComments = async (data) => {
    const temp = [];
    temp.push({
      interviewer_id: data.interviewer_id,
      emp_id: data.emp_id,
      interviewer_name: data.interviewer_name,
      job_id: data.job_id,
      interviewer_comments: values[data.interviewer_id],
      email: data.email,
      interview_id: data.interview_id,
      hr_remarks: "",
      hr_date: "",
    });

    await axios
      .put(`${ApiUrl}/employee/Interviewer/${id}`, temp)
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      })
      .catch((err) => console.error(err));
  };

  const hrComments = async () => {
    const temp = [];
    interviewDetails.map((data) => {
      temp.push({
        interviewer_id: data.interviewer_id,
        emp_id: data.emp_id,
        interviewer_name: data.interviewer_name,
        job_id: data.job_id,
        interviewer_comments: data.interviewer_comments,
        email: data.email,
        interview_id: data.interview_id,
        hr_remarks: values.hr,
        hr_date: "",
      });
    });
    await axios
      .put(`${ApiUrl}/employee/Interviewer/${id}`, temp)
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
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

    const result = async () => {
      await axios
        .put(`${ApiUrl}/employee/Interview/${data.interview_id}`, temp)
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
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <Grid container columnSpacing={3} rowSpacing={2}>
                {interviewDetails.length > 0
                  ? interviewDetails.map((inter, i) => {
                      return (
                        <Grid item xs={12} md={4} key={i}>
                          <Card variant="outlined">
                            <CardHeader
                              title={inter.email}
                              titleTypographyProps={{
                                variant: "body1",
                              }}
                            />
                            <CardContent>
                              <CustomTextField
                                name={inter.interviewer_id.toString()}
                                label="Comments"
                                value={
                                  values[inter.interviewer_id.toString()] ?? ""
                                }
                                multiline
                                rows={5}
                                inputProps={{ maxLength: 500 }}
                                handleChange={handleChange}
                              />
                            </CardContent>
                            <CardActions sx={{ justifyContent: "center" }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => submitComments(inter)}
                                disabled={!values[inter.interviewer_id]}
                              >
                                Submit
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })
                  : ""}
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardHeader
                      title="HR Comments"
                      titleTypographyProps={{
                        variant: "body1",
                      }}
                    />
                    <CardContent>
                      <CustomTextField
                        name="hr"
                        label="Comments"
                        value={values.hr ? values.hr : ""}
                        multiline
                        rows={5}
                        handleChange={handleChange}
                        inputProps={{ maxLength: 500 }}
                      />
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => hrComments()}
                        disabled={!values.hr}
                      >
                        Submit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            {interviewDetails.length > 0 ? (
              interviewDetails[0].hr_remarks ? (
                <Grid item xs={12}>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={6} md={6} align="right">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleSelect("true")}
                      >
                        Selected
                      </Button>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleSelect("false")}
                      >
                        Rejected
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
};

export default Result;
