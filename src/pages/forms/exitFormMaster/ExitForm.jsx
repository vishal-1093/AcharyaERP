import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  bg: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
    padding: 5,
  },
}));

const requiredFields = [];

function ExitForm() {
  const [values, setValues] = useState({ questions: {} });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const classes = useStyles();

  const checks = {};

  const errorMessages = {};

  useEffect(() => {
    if (pathname.toLowerCase() === "/exitformmaster/exitform/new") {
      setCrumbs([
        { name: "ExitFormMaster", link: "/ExitFormMaster/ExitForms" },
        { name: "Exit Form" },
      ]);
    } else {
    }
  }, [pathname]);

  useEffect(() => {
    getQuestionList();
  }, []);

  const getQuestionList = async () => {
    await axios
      .get(`/api/employee/employeeExitFormalityQuestionsAllData`)
      .then((res) => {
        const categoryDetailsTmp = [];
        res.data.data.forEach((obj) => {
          const chk = categoryDetailsTmp.filter(
            (fil) => fil.id === obj.category_details_id
          );
          if (chk.length === 0) {
            categoryDetailsTmp.push({
              id: obj.category_details_id,
              name: obj.category_detail,
            });
          }
        });

        const questionTemp = [];

        categoryDetailsTmp.forEach((obj) => {
          questionTemp.push({
            id: obj.id,
            name: obj.name,
            questions: res.data.data.filter(
              (obj1) => obj1.category_details_id === obj.id
            ),
          });
        });
        setData(questionTemp);

        const test = {};
        res.data.data.forEach((obj) => {
          test[obj.id] = "";
        });
        setValues((prev) => ({
          ...prev,
          questions: test,
        }));
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      questions: { ...prev.questions, [splitName[2]]: e.target.value },
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
      let x = Math.random() * 10;
      let empId = Math.round(x);
      const questionIds = [];
      const answers = [];
      const questionNums = [];
      questionIds.push(Object.keys(values["questions"]));
      questionIds[0].map((obj) => questionNums.push(parseInt(obj)));
      answers.push(Object.values(values["questions"]));
      temp.active = true;
      temp.emp_id = empId;
      temp.eefqid = questionNums;
      temp.answers = answers.toString();

      await axios
        .post(`/api/employee/employeeExitFormalityAnswers`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/ExitFormMaster/ExitForms", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Form Submitted Successfully",
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
    <Box component="form" overflow="hidden">
      <FormWrapper>
        <Grid container justifyContent="center">
          {data.map((obj, i) => {
            return (
              <>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" className={classes.bg}>
                    {obj.name}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  component={Paper}
                  elevation={3}
                  md={8}
                  p={2}
                  mb={1}
                  mt={1}
                >
                  <Grid container rowSpacing={3} columnSpacing={3}>
                    {obj.questions.map((obj2) => {
                      return (
                        <>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2">
                              {obj2.question}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            {obj2.type === "Optional" ? (
                              <CustomRadioButtons
                                name={"questionText" + "-" + i + "-" + obj2.id}
                                value={values.questions[obj2.id]}
                                items={[
                                  { value: "Yes", label: "Yes" },
                                  { value: "No", label: "No" },
                                ]}
                                handleChange={handleChange}
                              />
                            ) : (
                              <CustomTextField
                                inputProps={{
                                  minLength: 1,
                                  maxLength: 100,
                                }}
                                label=""
                                name={"questionText" + "-" + i + "-" + obj2.id}
                                value={values.questions[obj2.id]}
                                handleChange={handleChange}
                                checks={checks.questionText}
                                errors={errorMessages.questionText}
                                required
                              />
                            )}
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                </Grid>
              </>
            );
          })}
          <Grid item xs={12}></Grid>
        </Grid>

        <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
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
              <strong>{"Submit"}</strong>
            )}
          </Button>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default ExitForm;
