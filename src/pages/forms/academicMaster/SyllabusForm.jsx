import { useState, useEffect, lazy } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
const FormWrapper = lazy(() => import("../../../components/FormWrapper"));
const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initValues = {
  courseName: "",
  syllabusCode: "",
  programSpeId: "",
  syllabusId: "",
  duration: "",
  learnings: "",
  topics: "",
};
const initialValues = {
  courseId: null,
  objectiveUpdate: "",
  hoursUpdate: "",
  learningUpdate: "",
  topicUpdate: "",
  courseObjective: [
    {
      objective: "",
      topic_name: "",
      learning: "",
      hours: "",
    },
  ],
};

const requiredFields = [];

function SyllabusForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState(initValues);
  const [courseObjectiveId, setcourseObjectiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.toLowerCase() === "/coursesubjectivemaster/syllabus/new") {
      setIsNew(true);
      setCrumbs([
        {
          name: "Course Syllabus Master",
          link: "/CourseSubjectiveMaster/Syllabus",
        },
        { name: "Syllabus" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCourseObjectiveData();
    }
  }, [pathname]);

  const checks = {
    objective: [values.description !== ""],
  };

  const getCourseObjectiveData = async () => {
    await axios
      .get(`/api/academic/syllabus/${id}`)
      .then((res) => {
        setData({
          syllabusId: res.data.data.syllabus_id,
          syllabusCode: res.data.data.syllabus_code,
          syllabusPath: res.data.data.syllabus_path,
          duration: res.data.data.duration,
          learning: res.data.data.learning,
          topic_name: res.data.data.topic_name,
        });
        setValues({
          courseId: res.data.data.course_assignment_id,
          objectiveUpdate: res.data.data.syllabus_objective,
          learningUpdate: res.data.data.learning,
          topicUpdate: res.data.data.topic_name,
          hoursUpdate: res.data.data.duration,
        });
        setcourseObjectiveId(res.data.data.syllabus_id);
        setCrumbs([
          {
            name: "CourseSubjectiveMaster",
            link: "/CourseSubjectiveMaster/Syllabus",
          },
          { name: "Syllabus" },
          { name: "Update" },
          { name: res.data.data.syllabus_id },
        ]);
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (e) => {
    const splitName = e.target.name.split("-");

    setValues((prev) => ({
      ...prev,
      courseObjective: prev.courseObjective.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: e.target.value,
          };
        return obj;
      }),
    }));
  };

  const handleChangeOne = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    const splitName = name.split("-");

    setValues((prev) => ({
      ...prev,
      courseObjective: prev.courseObjective.map((obj, i) => {
        if (i === parseInt(splitName[1]))
          return {
            ...obj,
            [splitName[0]]: newValue,
          };
        return obj;
      }),
    }));
    if (name === "courseId") {
      await axios
        .get(`/api/academic/getCoursesConcateWithCodeNameAndYearSem`)
        .then((res) => {
          res.data.data
            .filter((item) => item.course_id === newValue)
            .map((filteredItem) => {
              data.courseName = filteredItem.course_name;
              data.courseCode = filteredItem.course_code;
            });
        })
        .catch((err) => console.error(err));
    }
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const add = () => {
    setValues((prev) => ({
      ...prev,
      ["courseObjective"]: prev["courseObjective"].concat({
        objective: "",
        learning: "",
        topic_name: "",
      }),
    }));
  };
  const remove = (index) => {
    const temp = values.courseObjective;
    temp.pop();
    setValues((prev) => ({
      ...prev,
      ["courseObjective"]: temp,
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
  useEffect(() => {
    getCourse();
  }, [values.courseId]);

  const getCourse = async () => {
    await axios
      .get(`/api/academic/getCoursesConcateWithCodeNameAndYearSem`)
      .then((res) => {
        console.log(res.data);
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.course_assignment_id,
            label: obj.course,
          });
        });
        setCourseOptions(data);
      })
      .catch((error) => console.error(error));
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
      values.courseObjective.forEach((obj) => {
        temp.push({
          active: true,
          course_assignment_id: values.courseId,
          duration: obj.hours,
          syllabus_code: data.courseCode,
          syllabus_objective: obj.objective,
          syllabus_path: data.courseName,
          learning: obj.learning,
          topic_name: obj.topic_name,
        });
      });
      await axios
        .post(`/api/academic/syllabusObjective`, temp)
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
          navigate("/CourseSubjectiveMaster/Syllabus", { replace: true });
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
          console.error(err);
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
      temp.course_objective_id = courseObjectiveId;
      temp.course_assignment_id = values.courseId;
      temp.syllabus_objective = values.objectiveUpdate;
      temp.syllabus_code = data.syllabusCode;
      temp.syllabus_path = data.syllabusPath;
      temp.syllabus_id = data.syllabusId;
      temp.duration = data.duration;
      temp.learning = values.learningUpdate;
      temp.topic_name = values.topicUpdate;
      await axios
        .put(`/api/academic/syllabus/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/CourseSubjectiveMaster/Syllabus", { replace: true });
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
          justifyContent="flex-start"
          columnSpacing={{ xs: 2, md: 6 }}
        >
          <Grid item md={5} alignItems="center">
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={1}></Grid>
          {isNew ? (
            values.courseObjective.map((obj, i) => {
              return (
                <>
                  <Grid item xs={12} md={6} mt={2.5}>
                    <CustomTextField
                      rows={2.5}
                      inputProps={{
                        minLength: 1,
                        maxLength: 500,
                      }}
                      label={"Topic " + Number(i + 1)}
                      name={"topic_name" + "-" + i}
                      value={values.courseObjective[i]["topic_name"]}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} mt={2.5}>
                    <CustomTextField
                      rows={2.5}
                      multiline
                      inputProps={{
                        minLength: 1,
                        maxLength: 500,
                      }}
                      label={"Module " + Number(i + 1)}
                      name={"objective" + "-" + i}
                      value={values.courseObjective[i]["objective"]}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} mt={2.5}>
                    <CustomTextField
                      inputProps={{
                        minLength: 1,
                        maxLength: 300,
                      }}
                      label={"Teaching-Learning Process " + Number(i + 1)}
                      name={"learning" + "-" + i}
                      value={values.courseObjective[i]["learning"]}
                      handleChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} mt={2.5}>
                    <CustomTextField
                      name={"hours" + "-" + i}
                      label="Duration (Hrs)"
                      value={values.courseObjective[i]["hours"]}
                      handleChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              );
            })
          ) : (
            <>
              <Grid item xs={12} md={6} mt={2.5}>
                <CustomTextField
                  inputProps={{
                    minLength: 1,
                    maxLength: 300,
                  }}
                  label={"Topic"}
                  name={"topicUpdate"}
                  value={values.topicUpdate}
                  handleChange={handleChangeOne}
                />
              </Grid>
              <Grid item xs={12} md={8} mt={2.5}>
                <CustomTextField
                  rows={2.5}
                  multiline
                  inputProps={{
                    minLength: 1,
                    maxLength: 500,
                  }}
                  label={"Module"}
                  name={"objectiveUpdate"}
                  value={values.objectiveUpdate}
                  handleChange={handleChangeOne}
                />
              </Grid>
              <Grid item xs={12} md={6} mt={2.5}>
                <CustomTextField
                  inputProps={{
                    minLength: 1,
                    maxLength: 300,
                  }}
                  label={"Teaching-Learning Process"}
                  name={"learningUpdate"}
                  value={values.learningUpdate}
                  handleChange={handleChangeOne}
                />
              </Grid>
              <Grid item xs={12} md={4} mt={2.5}>
                <CustomTextField
                  name="hoursUpdate"
                  label="Duration (Hrs)"
                  value={values.hoursUpdate}
                  handleChangeAdvance={handleChangeAdvance}
                  required
                />
              </Grid>
            </>
          )}
          {isNew ? (
            <Grid item xs={12} mt={2.5} align="right">
              <Button
                variant="contained"
                color="error"
                onClick={remove}
                disabled={values.courseObjective.length === 1}
                style={{ marginRight: "10px" }}
              >
                <RemoveIcon />
              </Button>

              <Button variant="contained" color="success" onClick={add}>
                <AddIcon />
              </Button>
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12} textAlign="right" mt={3}>
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
      </FormWrapper>
    </Box>
  );
}

export default SyllabusForm;
