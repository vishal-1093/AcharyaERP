import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import FormWrapper from "../../../components/FormWrapper";
import axios from "../../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomModal from "../../../components/CustomModal";
import useAlert from "../../../hooks/useAlert";

function Result() {
  const { id } = useParams();
  const [interviewDetails, setInterviewDetails] = useState([]);
  const [values, setValues] = useState({ hr: "" });
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);

  const navigate = useNavigate();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`/api/employee/getAllInterviewerDeatils/${id}`)
      .then((res) => {
        setInterviewDetails(res.data.data);

        const defValues = {
          hr: res.data.data[0].hr_remarks ? res.data.data[0].hr_remarks : "",
        };
        res.data.data.map((obj) => {
          defValues[obj.interviewer_id] = obj.interviewer_comments
            ? obj.interviewer_comments
            : "";
          obj.interviewer_comments
            ? setCommentStatus(false)
            : setCommentStatus(true);
        });
        setValues(defValues);
        setCrumbs([
          { name: "Job Portal", link: "/jobportal" },
          { name: res.data.data[0].job_id },
          { name: res.data.data[0].firstname },
          { name: "Interview Log" },
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

  const checkComments = () => {
    interviewDetails.forEach((obj) => {
      return values[obj.interviewer_id] != "";
    });
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
            message: "Comments saved successfully",
          });
          setAlertOpen(true);
          navigate("/ResultForm/" + id, { replace: true });
          getData();
        }
      })
      .catch((err) => console.error(err));
  };

  const hrComments = async () => {
    const temp = interviewDetails.map((obj) => {
      return { ...obj, hr_remarks: values.hr };
    });

    await axios
      .put(`/api/employee/Interviewer/${id}`, temp)
      .then((res) => {
        if (res.status === 200) {
          setAlertMessage({
            severity: "success",
            message: "Comments saved successfully",
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
                {interviewDetails.length > 0 ? (
                  interviewDetails.map((inter, i) => {
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
                              value={values[inter.interviewer_id.toString()]}
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
                ) : (
                  <></>
                )}
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
                        value={values.hr}
                        multiline
                        rows={5}
                        handleChange={handleChange}
                        inputProps={{ maxLength: 500 }}
                        disabled={commentStatus}
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
                <></>
              )
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
