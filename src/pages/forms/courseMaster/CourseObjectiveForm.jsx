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
  courseCode: "",
};
const initialValues = {
  courseId: null,
  objectiveUpdate: "",
  courseObjective: [
    {
      objective: "",
    },
  ],
};

const requiredFields = ["courseId", "courseObjective"];

function CourseObjectiveForm() {
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
    if (
      pathname.toLowerCase() === "/coursesubjectivemaster/courseobjective/new"
    ) {
      setIsNew(true);
      setCrumbs([
        {
          name: "CourseSubjectiveMaster",
          link: "/CourseSubjectiveMaster/Objective",
        },
        { name: "Course Objective " },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCourseObjectiveData();
    }
  }, [pathname]);

  const checks = {
    courseObjective: [values.courseObjective !== ""],
  };

  const errorMessages = {
    courseObjective: ["This field required"],
  };

  const getCourseObjectiveData = async () => {
    await axios
      .get(`/api/academic/courseObjective/${id}`)
      .then((res) => {
        setValues({
          courseId: res.data.data.course_id,
          objectiveUpdate: res.data.data.course_objective,
        });
        setcourseObjectiveId(res.data.data.course_objective_id);
        setCrumbs([
          {
            name: "CourseSubjectiveMaster",
            link: "/CourseSubjectiveMaster/Objective",
          },
          { name: "Course Objective" },
          { name: "Update" },
          { name: res.data.data.course_objective_id },
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
            value: obj.course_id,
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
      values.courseObjective.forEach((obj) => {
        temp.push({
          course_id: values.courseId,
          active: true,
          course_objective: obj.objective,
          course_code: data.courseCode,
          course_name: data.courseName,
        });
      });
      await axios
        .post(`/api/academic/courseObjective`, temp)
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
          navigate("/CourseSubjectiveMaster/Objective", { replace: true });
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
      temp.course_id = values.courseId;
      temp.course_objective = values.objectiveUpdate;

      await axios
        .put(`/api/academic/courseObjectives/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            navigate("/CourseSubjectiveMaster/Objective", { replace: true });
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
        <Grid container alignItems="center" justifyContent="flex-start">
          <Grid item md={4} alignItems="center">
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
          <Grid item xs={12} md={0}></Grid>
          {isNew ? (
            values.courseObjective.map((obj, i) => {
              return (
                <>
                  <Grid item xs={12} md={8} mt={2.5}>
                    <CustomTextField
                      rows={2.5}
                      multiline
                      inputProps={{
                        minLength: 1,
                        maxLength: 500,
                      }}
                      label="Objective"
                      name={"objective" + "-" + i}
                      value={values.courseObjective[i]["objective"]}
                      handleChange={handleChange}
                    />
                  </Grid>
                </>
              );
            })
          ) : (
            <Grid item xs={12} md={6} mt={2.5}>
              <CustomTextField
                rows={2.5}
                multiline
                inputProps={{
                  minLength: 1,
                  maxLength: 500,
                }}
                label="Objective"
                name={"objectiveUpdate"}
                value={values.objectiveUpdate}
                handleChange={handleChangeOne}
              />
            </Grid>
          )}
          {isNew ? (
            <Grid item xs={12} align="right">
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

export default CourseObjectiveForm;
