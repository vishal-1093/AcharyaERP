import { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAlert from "../../../hooks/useAlert";
import FormWrapper from "../../../components/FormWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programSpeId: null,
  deptId: null,
  courseId: null,
  courseCategoryId: null,
  courseTypeId: null,
  yearSemId: null,
  programAssignmentIdOne: null,
  programIdForUpdate: null,
  lecture: 0,
  tutorial: 0,
  practical: 0,
  totalCredit: "",
  durationHrs: 0,
  cieMarks: "",
  seeMarks: "",
  coursePriceInr: "",
  coursePriceUsd: "",
  remarks: "",
};
const requiredFields = [
  "acYearId",
  "schoolId",
  "programSpeId",
  "deptId",
  "courseId",
  "courseCategoryId",
  "courseTypeId",

  "yearSemId",
  "lecture",
  "totalCredit",
  "durationHrs",
  "cieMarks",
  "seeMarks",
];

function CourseAssignment() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [courseAssignmentId, setCourseAssignmentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programId, setProgramId] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseCategoryOptions, setCourseCategoryOptions] = useState([]);
  const [courseCategoryCode, setCourseCategoryCode] = useState([]);
  const [courseTypeOptions, setCourseTypeOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programAssignmentId, setProgramAssignmentId] = useState(null);
  const [programSpeShortNameOptions, setProgramSpeShortNameOptions] = useState(
    []
  );

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {
    lecture: [values.lecture !== "", /^[0-9]{1,100}$/.test(values.lecture)],

    durationHrs: [
      values.durationHrs !== "",
      /^[0-9]{1,100}$/.test(values.durationHrs),
    ],
    cieMarks: [values.cieMarks !== "", /^[0-9]{1,100}$/.test(values.cieMarks)],
    seeMarks: [values.seeMarks !== "", /^[0-9]{1,100}$/.test(values.seeMarks)],
    coursePriceInr: [/^[0-9]{1,100}$/.test(values.coursePriceInr)],
    coursePriceUsd: [/^[0-9]{1,100}$/.test(values.coursePriceUsd)],
    totalCredit: [
      values.totalCredit !== "",
      /^[0-9.]{1,100}$/.test(values.totalCredit),
    ],
  };

  const errorMessages = {
    lecture: ["This field is required", "Enter only numbers"],

    durationHrs: ["This field is required", "Enter only numbers"],
    cieMarks: ["This field is required", "Enter only numbers"],
    seeMarks: ["This field is required", "Enter only numbers"],
    coursePriceInr: ["Enter only numbers"],
    coursePriceUsd: ["Enter only numbers"],
    totalCredit: ["This field is required", "Enter only numbers"],
  };

  useEffect(() => {
    getAcademicYearData();
    getSchoolData();
    getCourseData();
    getCourseCategoryData();
    getCourseTypeData();
    if (pathname.toLowerCase() === "/courseassignment") {
      setIsNew(true);
      setCrumbs([
        { name: "Course Master", link: "/CourseassignmentIndex" },
        { name: "Course Assignment" },
        { name: "Create" },
      ]);
    } else {
      setIsNew(false);
      getCourseAssignmentData();
    }
  }, [pathname]);

  useEffect(() => {
    getProgramSpeData();
    getDepartmentData();
    getYearSemData();
    getYearSemForUpdate();
  }, [
    values.acYearId,
    values.schoolId,
    programId,
    values.deptId,
    values.programSpeId,
  ]);

  useEffect(() => {
    durationTotal();
  }, [values.lecture, values.tutorial, values.practical]);

  const getAcademicYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getDepartmentData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/fetchdept1/${values.schoolId}`)
        .then((res) => {
          setDepartmentOptions(
            res.data.data.map((obj) => ({
              value: obj.dept_id,
              label: obj.dept_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeShortNameOptions(res.data.data);
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getYearSemForUpdate = async () => {
    if (!isNew)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);

              setProgramAssignmentId(obj.program_assignment_id);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              for (let i = 1; i <= obj.number_of_semester; i++) {
                newYear.push({ value: i, label: "Sem" + "-" + i });
              }
            }
          });

          setYearSemOptions(
            newYear.map((obj) => ({
              value: obj.value,
              label: obj.label,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getCourseCategoryData = async () => {
    await axios
      .get(`/api/academic/CourseCategory`)
      .then((res) => {
        setCourseCategoryCode(res.data.data);
        setCourseCategoryOptions(
          res.data.data.map((obj) => ({
            value: obj.course_category_id,
            label: obj.course_category_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCourseData = async () => {
    await axios
      .get(`/api/academic/Course`)
      .then((res) => {
        setCourseOptions(
          res.data.data.map((obj) => ({
            value: obj.course_id,
            label: obj.course_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getCourseTypeData = async () => {
    await axios
      .get(`/api/academic/CourseType`)
      .then((res) => {
        setCourseTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.course_type_id,
            label: obj.course_type_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getYearSemData = async (id) => {
    if (values.programSpeId)
      await axios
        .get(
          `/api/academic/FetchAcademicProgram/${values.acYearId}/${
            isNew ? programId : values.programIdForUpdate
          }/${values.schoolId}`
        )
        .then((res) => {})
        .catch((err) => console.error(err));
  };

  const durationTotal = () => {
    setValues((prev) => {
      return {
        ...prev,
        durationHrs:
          Number(values.lecture) +
          Number(values.tutorial) +
          Number(values.practical),
      };
    });
  };

  const getCourseAssignmentData = async () => {
    await axios
      .get(`/api/academic/CourseAssignment/${id}`)
      .then((res) => {
        const data = res.data.data[0];

        setValues({
          acYearId: data.ac_year_id,
          cieMarks: data.cie_marks,
          courseCategoryId: data.course_category_id,
          courseId: data.course_id,
          coursePriceInr: data.course_price,
          coursePriceUsd: data.course_price_usd,
          courseTypeId: data.course_type_id,
          deptId: data.dept_id,
          durationHrs: data.duration,
          lecture: data.lecture,
          practical: data.practical,
          programSpeId: data.program_specialization_id,
          programAssignmentIdOne: data.program_assignment_id,
          programIdForUpdate: data.program_id,
          schoolId: data.school_id,
          seeMarks: data.see_marks,
          totalCredit: data.total_credit,
          tutorial: data.tutorial,
          yearSemId: parseInt(data.year_sem),
          remarks: data.remarks,
        });
        setCourseAssignmentId(data.course_assignment_id);
        setCrumbs([
          { name: "Course Master", link: "/CourseassignmentIndex" },
          { name: "Course Assignment" },
          { name: "Update" },
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

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          res.data.data.filter((val) => {
            if (val.program_specialization_id === newValue) {
              setProgramId(val.program_id);
              setProgramAssignmentId(val.program_assignment_id);
            }
            const yearsem = [];
            res.data.data.filter((obj) => {
              if (obj.program_specialization_id === newValue) {
                yearsem.push(obj);
                setProgramId(obj.program_id);
                setProgramAssignmentId(obj.program_assignment_id);
              }
            });

            const newYear = [];
            yearsem.map((obj) => {
              if (obj.program_type_name.toLowerCase() === "yearly") {
                setProgramId(obj.program_id);
                setProgramAssignmentId(obj.program_assignment_id);

                for (let i = 1; i <= obj.number_of_years; i++) {
                  newYear.push({ value: i, label: "Year" + "-" + i });
                }
              }
              if (obj.program_type_name.toLowerCase() === "semester") {
                for (let i = 1; i <= obj.number_of_semester; i++) {
                  newYear.push({ value: i, label: "Sem" + "-" + i });
                }
              }
            });

            setYearSemOptions(
              newYear.map((obj) => ({
                value: obj.value,
                label: obj.label,
              }))
            );
          });
        })
        .catch((err) => console.error(err));
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: newValue,
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

  const handleCreate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.school_name_short = schoolOptions
        .filter((val) => val.value === values.schoolId)
        .map((obj) => {
          return obj.label;
        })
        .toString();
      temp.ac_year = acYearOptions
        .filter((val) => val.value === values.acYearId)
        .map((obj) => {
          return obj.label;
        })
        .toString();

      temp.program_specialization_short_name = programSpeShortNameOptions
        .filter((val) => val.program_specialization_id === values.programSpeId)
        .map((obj) => {
          return obj.program_specialization_short_name;
        })
        .toString();

      temp.program_short_name = programSpeShortNameOptions
        .filter((val) => val.program_specialization_id === values.programSpeId)
        .map((obj) => {
          return obj.program_short_name;
        })
        .toString();

      temp.course_type_name = courseTypeOptions
        .filter((val) => val.value === values.courseTypeId)
        .map((obj) => {
          return obj.label;
        })
        .toString();

      temp.course_category_code = courseCategoryCode
        .filter((val) => val.course_category_id === values.courseCategoryId)
        .map((obj) => {
          return obj.course_category_code;
        })
        .toString();

      temp.program_id = programId.toString();
      temp.dept_id = values.deptId;
      temp.program_specialization_id = values.programSpeId;
      temp.course_id = values.courseId;
      temp.course_category_id = values.courseCategoryId;
      temp.course_type_id = values.courseTypeId;

      temp.program_assignment_id = programAssignmentId;
      temp.year_sem = values.yearSemId;
      temp.lecture = values.lecture;
      temp.tutorial = values.tutorial;
      temp.practical = values.practical;
      temp.total_credit = values.totalCredit;
      temp.duration = values.durationHrs;
      temp.cie_marks = values.cieMarks;
      temp.see_marks = values.seeMarks;
      temp.course_price = values.coursePriceInr;
      temp.course_price_usd = values.coursePriceUsd;
      temp.remarks = values.remarks;

      await axios
        .post(`/api/academic/CourseAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/CourseassignmentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Course  Assigned",
            });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.course_assignment_id = courseAssignmentId;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programIdForUpdate;
      temp.dept_id = values.deptId;
      temp.program_specialization_id = values.programSpeId;
      temp.program_assignment_id = values.programAssignmentIdOne
        ? values.programAssignmentIdOne
        : programAssignmentId;
      temp.course_id = values.courseId;
      temp.course_category_id = values.courseCategoryId;
      temp.course_type_id = values.courseTypeId;

      temp.year_sem = values.yearSemId;
      temp.lecture = values.lecture;
      temp.tutorial = values.tutorial;
      temp.practical = values.practical;
      temp.total_credit = values.totalCredit;
      temp.duration = values.durationHrs;
      temp.cie_marks = values.cieMarks;
      temp.see_marks = values.seeMarks;
      temp.course_price = values.coursePriceInr;
      temp.course_price_usd = values.coursePriceUsd;
      temp.remarks = values.remarks;

      temp.school_name_short = schoolOptions
        .filter((val) => val.value === values.schoolId)
        .map((obj) => {
          return obj.label;
        })
        .toString();
      temp.ac_year = acYearOptions
        .filter((val) => val.value === values.acYearId)
        .map((obj) => {
          return obj.label;
        })
        .toString();

      temp.program_specialization_short_name = programSpeShortNameOptions
        .filter((val) => val.program_specialization_id === values.programSpeId)
        .map((obj) => {
          return obj.program_specialization_short_name;
        })
        .toString();

      temp.program_short_name = programSpeShortNameOptions
        .filter((val) => val.program_specialization_id === values.programSpeId)
        .map((obj) => {
          return obj.program_short_name;
        })
        .toString();

      temp.course_type_name = courseTypeOptions
        .filter((val) => val.course_type_id === values.courseTypeId)
        .map((obj) => {
          return obj.course_type_name;
        })
        .toString();

      temp.course_category_code = courseCategoryCode
        .filter((val) => val.course_category_id === values.courseCategoryId)
        .map((obj) => {
          return obj.course_category_code;
        })
        .toString();

      await axios
        .put(`/api/academic/CourseAssignment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Updated",
            });
            navigate("/CourseassignmentIndex", { replace: true });
          } else {
            setAlertMessage({
              severity: "error",
              message: res.data ? res.data.message : "Error Occured",
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
          justifyContent="flex-end"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="deptId"
              label="Program Owner"
              value={values.deptId}
              options={departmentOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="courseId"
              label="Course"
              value={values.courseId}
              options={courseOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="courseCategoryId"
              label="Course Category"
              value={values.courseCategoryId}
              options={courseCategoryOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="courseTypeId"
              label="Course Type"
              value={values.courseTypeId}
              options={courseTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearSemId"
              label="Year/Sem"
              value={values.yearSemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="lecture"
              label="Lecture(Hours per week)"
              value={values.lecture}
              handleChange={handleChange}
              checks={checks.lecture}
              errors={errorMessages.lecture}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="tutorial"
              label="Tutorial"
              value={values.tutorial}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="practical"
              label="Practical"
              value={values.practical}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="durationHrs"
              label="Duration(HRS)"
              value={values.durationHrs}
              handleChange={handleChange}
              checks={checks.durationHrs}
              errors={errorMessages.durationHrs}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="totalCredit"
              label="Total Credit"
              value={values.totalCredit}
              checks={checks.totalCredit}
              errors={errorMessages.totalCredit}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              name="cieMarks"
              label="CIE Marks"
              value={values.cieMarks}
              handleChange={handleChange}
              checks={checks.cieMarks}
              errors={errorMessages.cieMarks}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomTextField
              name="seeMarks"
              label="SEE Marks"
              value={values.seeMarks}
              handleChange={handleChange}
              checks={checks.seeMarks}
              errors={errorMessages.seeMarks}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              multiline
              rows={2}
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item textAlign="right">
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

export default CourseAssignment;
