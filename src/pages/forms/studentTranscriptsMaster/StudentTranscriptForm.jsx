import { useState, useEffect } from "react";
import {
  Table,
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  TableCell,
  TableRow,
  Checkbox,
  TableContainer,
  Paper,
  TableBody,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import { makeStyles } from "@mui/styles";

const styles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 40,
    maxWidth: 880,
    marginLeft: "120px",
  },
  bor: {
    border: 1,
  },
}));

const initialValues = {
  isSubmitted: false,
  collectedInstitute: "",
  notRequired: "",
  transcriptId: "",
  lastDate: "",
  StudentId: null,
  locker: "",
};

const requiredFields = [];

function StudentTranscriptForm() {
  const [isNew, setIsNew] = useState(true);
  const [data, setData] = useState();
  const [values, setValues] = useState(initialValues);
  const [StudentId, setStudentId] = useState();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [transcriptDetails, setTranscriptDetails] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const classes = styles();

  const checks = [];

  useEffect(() => {
    getStudentData();
    getTranscriptDetails();
  }, []);

  const getStudentData = async () => {
    await axios
      .get(`/api/student/Student_DetailsAuid/${id}`)
      .then((res) => {
        setStudentData(res.data.data[0]);
        setStudentId(res.data.data.student_id);
      })
      .catch((err) => console.error(err));
  };

  const getTranscriptDetails = async () => {
    await axios
      .get(`/api/student/StudentTranscriptSubmission1/${id}`)
      .then((res) => {
        setTranscriptDetails(res.data.data);

        const test = res.data.data.map((obj, i) => ({
          transcriptId: "",
          lastDate: null,
          submittedStatus: false,
          collectedInstitute: false,
          locker: "",
        }));
        setData((prev) => ({
          ...prev,
          transcript: test,
        }));
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (
      pathname.toLowerCase() ===
      `/StudentTranscriptMaster/DocumentCollection/${id}`
    ) {
      setCrumbs([
        {
          name: "",
          link: "/StudentTranscriptMaster/StudentTranscript",
        },
        { name: "" },
        { name: "View" },
      ]);
    }
  }, [pathname]);

  const handleChangeAdvance = (name, newValue) => {
    const splitName = name.split("-");
    setData((prev) => ({
      ...prev,
      transcript: prev.transcript.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: newValue,
            transcriptId: splitName[2],
          };
        return obj;
      }),
    }));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");

    if (e.target.checked === true) {
      setData((prev) => ({
        ...prev,
        transcript: prev.transcript.map((obj, i) => {
          if (i === parseInt(splitName[1]))
            return {
              ...obj,
              collectedInstitute: true,
            };
          return obj;
        }),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        transcript: prev.transcript.map((obj, i) => {
          if (i === parseInt(splitName[1]))
            return { ...obj, collectedInstitute: true };
          return obj;
        }),
      }));
    }
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleChangeOne = (e) => {
    setData((prev) => ({
      ...prev,
      transcript: prev.transcript.map((obj, i) => {
        return {
          ...obj,
          locker: values.locker,
        };
      }),
    }));

    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelect = (e) => {
    const splitName = e.target.name.split("-");
    if (e.target.checked === true) {
      setData((prev) => ({
        ...prev,
        transcript: prev.transcript.map((obj, i) => {
          if (i === parseInt(splitName[1]))
            return {
              ...obj,
              [splitName[0]]: splitName[2],
              lastDate: null,
              isSubmitted: true,
              collectedInstitute: true,
              locker: true,
            };
          return obj;
        }),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        transcript: prev.transcript.map((obj, i) => {
          if (i === parseInt(splitName[1]))
            return {
              ...obj,
              [splitName[0]]: "",
              isSubmitted: false,
              collectedInstitute: false,
              locker: false,
            };
          return obj;
        }),
      }));
    }
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

  const handleCreate = async () => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);

      const temp = [];
      data.transcript
        .filter((obj) => obj.transcriptId !== "")
        .forEach((ele) => {
          temp.push({
            stu_transcript_id: ele.transcriptId,
            transcript_id: ele.transcriptId,
            student_id: studentData.student_id,
            is_collected: ele.isSubmitted === true ? "yes" : "no",
            will_submit_by: ele.lastDate ? ele.lastDate : null,
            not_applicable: "no",
            collected_by_institute:
              ele.collectedInstitute === true
                ? studentData.school_name_short
                : "",

            transcript_locker_number: ele.locker ? ele.locker : "",
          });
        });

      await axios
        .put(`/api/student/StudentTranscriptSubmission/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/StudentTranscriptMaster/StudentTranscript", {
              replace: true,
            });
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "An error occured",
            });
          }
          setAlertOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response
              ? err.response.data.message
              : "An error occured",
          });
          setAlertOpen(true);
        });
    }
  };

  return (
    <>
      <Box component="form" overflow="hidden" p={1}>
        <FormWrapper>
          <Grid
            container
            justifyContent="center"
            width="80%"
            marginLeft="10%"
            marginBottom={2}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.headerWhite.main,
            }}
          >
            <Typography sx={{ fontSize: "22px" }}>
              Documents Collection
            </Typography>
          </Grid>

          <Grid item xs={12} align="center" marginBottom={1}>
            <Paper elevation={3} style={{ width: "80%" }}>
              <Grid
                container
                alignItems="center"
                rowSpacing={2}
                pl={2}
                pr={2}
                pb={1}
                pt={1}
              >
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2" textAlign="justify">
                    AC Year
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="justify"
                  >
                    {studentData.ac_year}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2" textAlign="justify">
                    AUID
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="justify"
                  >
                    {studentData.auid}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2" textAlign="justify">
                    Student name
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="justify"
                  >
                    {studentData.student_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2" textAlign="justify">
                    Course
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="justify"
                  >
                    {studentData.program_name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2" textAlign="justify">
                    Speciliazation
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="justify"
                  >
                    {studentData.program_specialization_name}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2" textAlign="justify">
                    Admission Category
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="justify"
                  >
                    {studentData.fee_admission_category_type}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid
            container
            justifyContent="center"
            width="80%"
            marginLeft="10%"
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.headerWhite.main,
            }}
          >
            <Typography sx={{ fontSize: "20px" }}>
              Transcript Details
            </Typography>
          </Grid>
          <TableContainer
            component={Paper}
            sx={{ width: "80%", marginLeft: "10%" }}
          >
            <Table size="small">
              <TableCell
                sx={{
                  textAlign: "center",
                  borderRight: 1,
                  borderColor: "grey.300",
                }}
              >
                <b>Transcript</b>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  borderRight: 1,
                  borderColor: "grey.300",
                }}
              >
                <b>Is Submitted</b>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  borderRight: 1,
                  borderColor: "grey.300",
                }}
              >
                <b>Last Date </b>
                <br />
                (dd/mm/yyyy)
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  borderRight: 1,
                  borderColor: "grey.300",
                }}
              >
                <b>Not Required</b>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  borderRight: 1,
                  borderColor: "grey.300",
                }}
              >
                <b>Collected By Institute</b>
              </TableCell>
              <TableBody>
                {transcriptDetails.map((obj, i) => {
                  return (
                    <TableRow className={classes.bg}>
                      <TableCell
                        sx={{
                          textAlign: "justify",
                          borderRight: 1,
                          borderColor: "grey.300",
                          width: "300px",
                        }}
                      >
                        {obj.transcript}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: 1,
                          borderColor: "grey.300",
                          width: "110px",
                        }}
                      >
                        <Checkbox
                          name={
                            "transcriptId" +
                            "-" +
                            i +
                            "-" +
                            obj.stu_transcript_id
                          }
                          checked={data.transcript[i].isSubmitted === true}
                          onChange={handleSelect}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: 1,
                          borderColor: "grey.300",
                        }}
                      >
                        <TableRow key={i}>
                          <CustomDatePicker
                            name={
                              "lastDate" + "-" + i + "-" + obj.stu_transcript_id
                            }
                            label="Last Date"
                            value={data.transcript[i].lastDate}
                            handleChangeAdvance={handleChangeAdvance}
                            disabled={data.transcript[i].isSubmitted === true}
                            helperText=""
                            disablePast
                          />
                        </TableRow>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          borderRight: 1,
                          borderColor: "grey.300",
                        }}
                      >
                        <Checkbox
                          name="notRequired"
                          onChange={(e) => handleChange(e)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Checkbox
                          name={
                            "collectedInstitute" +
                            "-" +
                            i +
                            "-" +
                            obj.stu_transcript_id
                          }
                          onChange={(e) => handleChange(e)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Grid>
              <TableRow>
                <TableCell>
                  <b>Locker Number</b>
                </TableCell>
                <TableCell>
                  <CustomTextField
                    name={"locker"}
                    value={values.locker}
                    handleChange={handleChangeOne}
                    required
                  />
                </TableCell>
              </TableRow>
            </Grid>
          </TableContainer>

          <Grid item xs={12} md={6} textAlign="right" marginTop={2}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreate}
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
        </FormWrapper>
      </Box>
    </>
  );
}

export default StudentTranscriptForm;
