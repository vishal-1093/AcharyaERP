import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomMultipleAutocomplete from "../../../components/Inputs/CustomMultipleAutocomplete";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CheckboxAutocomplete from "../../../components/Inputs/CheckboxAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const initValues = {
  question: "",
  schoolId: [],
};

const requiredFields = ["question", "schoolId"];

function StudentFeedbackForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [feedbackId, setFeedbackId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [SchoolNameOptions, setSchoolNameOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    question: [values.question !== ""],
    schoolId: isNew ? [values.schoolId.length > 0] : [],
  };

  const errorMessages = {
    question: ["This field required"],
    schoolId: isNew ? ["This field is required"] : [],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/studentfeedbackmaster/feedback/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "StudentFeedback Master",
          link: "/StudentFeedbackMaster/Questions",
        },
        { name: "Feedback" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getFeedbackData();
    }
  }, [pathname]);

  const getFeedbackData = async () => {
    await axios
      .get(`/api/academic/feedbackQuestions/${id}`)
      .then((res) => {
        setValues({
          question: res.data.data.feedback_questions,
          schoolId: res.data.data.school_id,
        });
        setFeedbackId(res.data.data.feedback_id);
        setCrumbs([
          {
            name: "StudentFeedback Master",
            link: "/StudentFeedbackMaster/Questions",
          },
          { name: "Feedback" },
          { name: "Update" },
          { name: res.data.data.feedback_questions },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const getSchoolNameOptions = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolNameOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    getSchoolNameOptions();
  }, []);

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
  const handleSelectAll = (name, options) => {
    setValues((prev) => ({
      ...prev,
      [name]: options.map((obj) => obj.value),
    }));
  };
  const handleSelectNone = (name) => {
    setValues((prev) => ({ ...prev, [name]: [] }));
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
      const temp = {};
      temp.active = true;
      temp.feedback_questions = values.question;
      temp.school_id = values.schoolId;

      await axios
        .post(`/api/academic/feedbackQuestions`, temp)
        .then((res) => {
          setLoading(false);
          setAlertMessage({
            severity: "success",
            message: res.data.message,
          });
          setAlertOpen(true);
          setAlertMessage({
            severity: "success",
            message: "Form Submitted Successfully",
          });
          navigate("/StudentFeedbackMaster/Questions", { replace: true });
        })
        .catch((err) => {
          setLoading(false);
          setAlertMessage({
            severity: "error",
            message: err.response.data
              ? err.response.data.message
              : "Error submitting",
          });
          setAlertOpen(true);
        });
    }
  };

  const handleUpdate = async () => {
    if (!requiredFieldsValid()) {
      console.log(checks);
      console.log(values.schoolId.length);
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.feedback_id = feedbackId;
      temp.feedback_questions = values.question;
      temp.school_id = values.schoolId;

      await axios
        .put(`/api/academic/feedbackQuestions/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/StudentFeedbackMaster/Questions", { replace: true });
          } else {
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: res.data.message,
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
    }
  };
  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          rowSpacing={4}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={6}>
            <CustomTextField
              name="question"
              label="Question"
              value={values.question}
              handleChange={handleChange}
              checks={checks.question}
              errors={errorMessages.question}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            {isNew ? (
              <CheckboxAutocomplete
                name="schoolId"
                label="School"
                options={SchoolNameOptions}
                value={values.schoolId}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                checks={checks.schoolId}
                errors={errorMessages.schoolId}
                required
              />
            ) : (
              <CustomAutocomplete
                name="schoolId"
                label="School"
                options={SchoolNameOptions}
                value={values.schoolId}
                handleChangeAdvance={handleChangeAdvance}
                handleSelectAll={handleSelectAll}
                handleSelectNone={handleSelectNone}
                required
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              textAlign="right"
            >
              <Grid item xs={4} md={2}>
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
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default StudentFeedbackForm;
