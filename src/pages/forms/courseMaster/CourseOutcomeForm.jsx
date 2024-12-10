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
const CustomSelect = lazy(() =>
  import("../../../components/Inputs/CustomSelect")
);

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);

const initValues = {
  courseName: "",
  courseCode: "",
};
const toxonomyLists = [
  {
    label: "Create - Produce new or original work",
    value: "Create - Produce new or original work",
  },
  {
    label: "Evaluate - Justify a stand or decision",
    value: "Evaluate - Justify a stand or decision",
  },
  {
    label: "Analyse - Draw connections among ideas",
    value: "Analyse - Draw connections among ideas",
  },
  {
    label: "Apply - Use information in new situation",
    value: "Apply - Use information in new situation",
  },
  {
    label: "Understand - Explain ideas or concepts",
    value: "Understand - Explain ideas or concepts",
  },
  {
    label: "Remember - Recall facts & basic concepts",
    value: "Remember - Recall facts and basic concepts",
  },
];
const initialValues = {
  courseId: null,
  toxonomyList: toxonomyLists,
  courseNameUpdate: "",
  courseCodeUpdate: "",
  outcomeUpdate: "",
  courseObjective: [
    {
      objective: "",
      toxonomy: "",
      toxonomy_details: "",
    },
  ],
};

const requiredFields = [];

function CourseOutcomeForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [data, setData] = useState(initValues);
  const [courseOutcomeId, setcourseOutcomeId] = useState(null);
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
    if (
      pathname.toLowerCase() === "/coursesubjectivemaster/courseoutcome/new"
    ) {
      setIsNew(true);
      setCrumbs([
        {
          name: "Course Syllabus Master",
          link: "/CourseSubjectiveMaster/Outcome",
        },
        { name: "Course Outcome " },
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

  const getCourseObjectiveData = async () => {
    await axios
      .get(`/api/academic/getCourseOutComeDetails/${id}`)
      .then((res) => {
        const temp = [];

        res.data.data.map((obj) => {
          temp.push({
            objective: obj.course_outcome_objective,
            course_outcome_id: obj.id,
            toxonomy: obj.toxonomy,
            toxonomy_details: obj.toxonomy_details,
          });
        });

        setValues({ courseId: Number(id), courseObjective: temp });
        setcourseOutcomeId(res.data.data.course_outcome_id);
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
        } else {
          setCrumbs([
            {
              name: "Course Syllabus Master",
              link: "/CourseSubjectiveMaster/Outcome",
            },
            { name: "Course Outcome" },
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

  const handleChangeToxonomy = (event, index) => {
    getToxonomy_details(event, index);
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
            .filter((item) => item.course_assignment_id === newValue)
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

  const getToxonomy_details = async (event, index) => {
    let { name, value } = event.target;
    const onChangeReqVal = JSON.parse(JSON.stringify(values.courseObjective));
    onChangeReqVal[index][name] = value;
    try {
      const res = await axios.get(
        `api/academic/getToxonomyDetails?toxonomy=${value}`
      );
      if (res.status == 200) {
        if (!!res.data.data) {
          onChangeReqVal[index]["toxonomy_details"] = res.data.data;
          setValues((prev) => ({
            ...prev,
            courseObjective: onChangeReqVal,
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response.data
          ? error.response.data.message
          : "An error occured!!",
      });
      setAlertOpen(true);
    }
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
        temp.push({
          course_assignment_id: values.courseId,
          active: true,
          course_outcome_objective: obj.objective,
          toxonomy: obj.toxonomy,
          toxonomy_details: obj.toxonomy_details,
          course_outcome_code: "CO" + Number(i + 1),
          course_name: data.courseName,
        });
      });

      await axios
        .post(`/api/academic/courseOutCome`, temp)
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
          navigate("/CourseSubjectiveMaster/Outcome", { replace: true });
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
        temp.push({
          course_assignment_id: values.courseId,
          active: true,
          course_outcome_id: obj.course_outcome_id,
          course_outcome_objective: obj.objective,
          course_outcome_code: "CO" + Number(i + 1),
          course_name: data.courseName,
          toxonomy: obj.toxonomy,
          toxonomy_details: obj.toxonomy_details,
        });
      });

      await axios
        .put(`/api/academic/courseOutComes/${id}`, temp)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Form Updated Successfully",
            });
            if (state.toLowerCase() === "/courseassignmentemployeeindex") {
              navigate("/courseassignmentemployeeindex", { replace: true });

            } else {
              navigate("/CourseSubjectiveMaster/Outcome", { replace: true });
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
        <Grid container alignItems="center" justifyContent="flex-start" gap={4}>
          <Grid item md={4}>
            <CustomAutocomplete
              name="courseId"
              label="CourseCode-Branch-Year/Sem"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          {values.courseObjective.map((obj, i) => {
            return (
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                gap={4}
                key={i}
              >
                <Grid item xs={12} md={4} mt={2.5}>
                  <CustomTextField
                    rows={2}
                    multiline
                    inputProps={{
                      minLength: 1,
                      maxLength: 500,
                    }}
                    label={"C0" + Number(i + 1)}
                    name={"objective" + "-" + i}
                    value={obj.objective}
                    handleChange={handleChange}
                  />
                </Grid>
                <Grid item md={4}>
                  <CustomSelect
                    name="toxonomy"
                    label="Taxonomy"
                    value={obj.toxonomy || ""}
                    items={toxonomyLists || []}
                    handleChange={(e) => handleChangeToxonomy(e, i)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={3} align="right">
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
              </Grid>
            );
          })}

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

export default CourseOutcomeForm;
