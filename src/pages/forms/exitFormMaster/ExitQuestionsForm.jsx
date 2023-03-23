import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";

const initValues = {
  question: "",
  questionType: "",
  answerFormat: "",
};

const requiredFields = ["question", "questionType", "answerFormat"];

function ExitQuestionsForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initValues);
  const [exitQuestionId, setExitQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionTypeOptions, setQuestionTypeOptions] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const checks = {
    question: [
      values.question !== "",
      values.question.trim().split(/ +/).join(" "),
    ],
    questionType: [values.questionType !== ""],
    answerFormat: [values.answerFormat !== ""],
  };

  const errorMessages = {
    question: ["This field required"],
    questionType: ["This field required"],
    answerFormat: ["This field required"],
  };

  useEffect(() => {
    if (pathname.toLowerCase() === "/exitformmaster/exitquestion/new") {
      setIsNew(true);
      setCrumbs([
        { name: "ExitForm Master", link: "/ExitFormMaster/ExitQuestions" },
        { name: "Exit Question" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getExitQuestionsData();
    }
  }, [pathname]);

  const getExitQuestionsData = async () => {
    await axios
      .get(`/api/employee/employeeExitFormalityQuestions/${id}`)
      .then((res) => {
        setValues({
          question: res.data.data.question,
          questionType: res.data.data.category_details_id,
          answerFormat: res.data.data.type,
        });
        setExitQuestionId(res.data.data.eefqid);
        setCrumbs([
          { name: "EmpLeave Master", link: "/ExitFormMaster/ExitQuestions" },
          { name: "Exit Question" },
          { name: "Update" },
          { name: res.data.data.question },
        ]);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getQuestionTypeOptions();
  }, []);

  const getQuestionTypeOptions = async () => {
    await axios
      .get(`/api/categoryTypeDetails`)
      .then((res) => {
        setQuestionTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.category_details_id,
            label: obj.category_detail,
          }))
        );
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
      temp.question = values.question;
      temp.category_details_id = values.questionType;
      temp.type = values.answerFormat;

      await axios
        .post(`/api/employee/employeeExitFormalityQuestions`, temp)
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
          navigate("/ExitFormMaster/ExitQuestions", { replace: true });
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
      setAlertMessage({
        severity: "error",
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.eefqid = exitQuestionId;
      temp.question = values.question;
      temp.category_details_id = values.questionType;
      temp.type = values.answerFormat;

      await axios
        .put(`/api/employee/employeeExitFormalityQuestions/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/ExitFormMaster/ExitQuestions", { replace: true });
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
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="questionType"
              label="Category Type"
              handleChange={handleChange}
              options={questionTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              value={values.questionType}
              checks={checks.questionType}
              errors={errorMessages.questionType}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
            <CustomRadioButtons
              name="answerFormat"
              label="Answer Format"
              value={values.answerFormat}
              items={[
                { value: "TextField", label: "TextField" },
                { value: "Optional", label: "Optional" },
              ]}
              handleChange={handleChange}
              required
            />
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

export default ExitQuestionsForm;
