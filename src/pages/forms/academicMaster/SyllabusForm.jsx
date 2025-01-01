import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

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
  const location = useLocation();
  const state = location?.state;

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
      setCrumbs([
        {
          name: "CourseSubjectiveMaster",
          link: "/CourseSubjectiveMaster/Syllabus",
        },
        { name: "Syllabus" },
        { name: "Update" },
        // { name: res.data.data.syllabus_id },
      ]);
      getCourseObjectiveData();
    }
  }, [pathname]);

  const checks = {
    objective: [values.description !== ""],
  };

  const errorMessages = {
    objective: ["This field required"],
  };

  const getCourseObjectiveData = async () => {
    await axios
      .get(`/api/academic/getSyllabusDetails/${id}`)
      .then((res) => {
        const temp = [];
        if (res?.data?.data?.length === 0) {
          setValues((prev) => ({
            ...prev,
            courseId: Number(id),
          }));
        } else {
          res?.data?.data?.map((obj) => {
            temp.push({
              objective: obj.syllabus_objective,
              topic_name: obj.topic_name,
              learning: obj.learning,
              hours: obj.duration,
              syllabus_id: obj.id,
            });
          });

          setValues({ courseId: Number(id), courseObjective: temp });
        }
        setcourseObjectiveId(res.data.data.syllabus_id);
        if (state.toLowerCase() === "/courseassignmentemployeeindex") {
          setCrumbs([
            {
              name: "My Course",
              link: "/courseassignmentemployeeindex",
            },
            { name: "Course Syllabus" },
            { name: "Update" },
            { name: res.data.data.course_objective_id },
          ]);
        }
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
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_assignment_id,
            label: obj.course,
          }))
        );
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
      values.courseObjective.forEach((obj, i) => {
        const inc = i + 1;
        temp.push({
          active: true,
          module: "Module" + " - " + inc,
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

      const temp = [];
      values.courseObjective.forEach((obj, i) => {
        const inc = i + 1;
        temp.push({
          active: true,
          module: "Module" + " - " + inc,
          syllabus_id: obj.syllabus_id,
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
        .put(`/api/academic/syllabus/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            if (state.toLowerCase() === "/courseassignmentemployeeindex") {
              navigate("/courseassignmentemployeeindex", { replace: true });
            } else {
              navigate("/CourseSubjectiveMaster/Syllabus", { replace: true });
            }
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
          columnSpacing={2}
          rowSpacing={2}
        >
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={8}></Grid>
          {values.courseObjective.map((obj, i) => {
            return (
              <>
                <Grid item xs={12} md={6} key={i}>
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
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    rows={2.5}
                    multiline
                    inputProps={{
                      minLength: 1,
                      maxLength: 500,
                    }}
                    label={"Topics"}
                    name={"topic_name" + "-" + i}
                    value={values.courseObjective[i]["topic_name"]}
                    handleChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
          })}

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
