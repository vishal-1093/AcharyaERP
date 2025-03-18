import { useState, useEffect, lazy } from "react";
import { Grid, Button, CircularProgress, Box, Checkbox } from "@mui/material";
import moment from "moment";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import GridIndex from "../../../components/GridIndex";

const FormWrapper = lazy(() => import("../../../components/FormWrapper"));

const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete")
);
const schoolID = JSON.parse(sessionStorage.getItem("userData"))?.school_id;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

const initialValues = {
  schoolId: null,
  programIdForUpdate: null,
  programSpeId: null,
  yearsemId: null,
  courseId: null,
  remarks: "",
  studentId: "",
};

const requiredFields = ["schoolId", "programSpeId", "yearsemId"];

function CourseStudentAssignment() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [sectionAssignmentId, setSectionAssignmentId] = useState(null);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [programType, setProgramType] = useState("Sem");
  const [programId, setProgramId] = useState(null);
  const [uncheckedStudentIds, setUncheckedStudentIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [programAssignmentId, setProgramAssignmentId] = useState(null);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {};

  useEffect(() => {
    getAcademicyear();
    getSchoolData();
    if (roleShortName !== "SAA") {
      setValues((prev) => ({
        ...prev,
        schoolId: schoolID,
      }));
    }
    if (pathname.toLowerCase() === "/coursemaster/student/new") {
      setIsNew(true);
      setCrumbs([
        { name: "Course Master", link: "/Courseassignmentstudentindex" },
        { name: "Course  Assignment" },
      ]);
    } else {
      setIsNew(false);
      getCourseStudentAssignmentData();
    }
  }, []);

  useEffect(() => {
    getProgramSpeData();
    getStudentsData();
    getCourseDetails();
  }, [
    values.acYearId,
    values.schoolId,
    values.courseId,
    values.programSpeId,
    values.yearsemId,
    programType,
  ]);

  useEffect(() => {
    setSelectAll(studentDetailsOptions.every((obj) => obj.checked));
  }, [studentDetailsOptions]);

  const columns = [
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      sortable: false,
      renderHeader: () => (
        <FormGroup>
          {" "}
          <FormControlLabel control={headerCheckbox} />
        </FormGroup>
      ),
      renderCell: (params) => (
        <Checkbox
          sx={{ padding: 0 }}
          checked={params.row.checked}
          onChange={handleCheckboxChange(params.row.student_id)}
        />
      ),
    },
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
    },
    {
      field: "auid",
      headerName: "AUID",
      flex: 1,
    },
    {
      field: "usn",
      headerName: "USN",
      flex: 1,
    },
    {
      field: "reporting_date",
      headerName: "Reported Date",
      flex: 1,
      valueGetter: (params) =>
        params.row.reporting_date
          ? moment(params.row.reporting_date).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "current",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (params) =>
        params.row.current_year
          ? params.row.current_year + "/" + params.row.current_sem
          : "NA",
    },
    {
      field: "eligible_reported_status",
      headerName: "Status",
      flex: 1,
      valueGetter: (params) =>
        params.row.eligible_reported_status
          ? ELIGIBLE_REPORTED_STATUS[params.row.eligible_reported_status]
          : "",
    },
  ];

  const headerCheckbox = (
    <Checkbox
      checked={selectAll}
      onClick={(e) => handleHeaderCheckboxChange(e)}
    />
  );

  const getSchoolData = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.school_id,
            label: obj.school_name,
          });
        });
        setSchoolOptions(data);
      })
      .catch((error) => console.error(error));
  };

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const data = [];
        res.data.data.forEach((obj) => {
          data.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
          });
        });
        setAcademicYearOptions(data);
      })
      .catch((error) => console.error(error));
  };

  const getProgramSpeData = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
              program_type_name: obj.program_type_name,
              program_short_name: obj.program_short_name,
              program_name: obj.program_name,
              program_id: obj.program_id,
              number_of_years: obj.number_of_years,
              number_of_semester: obj.number_of_semester,
              program_assignment_id: obj.program_assignment_id,
            });
          });
          setProgramSpeOptions(data);
        })
        .catch((err) => console.error(err));
  };

  const getCourseDetails = async () => {
    if (values.schoolId && values.programSpeId && values.yearsemId)
      await axios
        .get(
          `/api/academic/courseDetailsForStudentsAssignment/${values.programSpeId}/${values.yearsemId}/${values.schoolId}`
        )
        .then((res) => {
          const data = [];
          res.data.data.forEach((obj) => {
            data.push({
              value: obj.course_assignment_id,
              label: obj.course_name_with_code,
            });
          });
          setCourseOptions(data);
        })
        .catch((error) => console.error(error));
  };

  const getStudentsData = async () => {
    try {
      if (
        isNew &&
        values.schoolId &&
        values.programSpeId &&
        values.yearsemId &&
        values.courseId &&
        programType === "Year"
      ) {
        const studentResponse = await axios.get(
          `/api/academic/getStudentDetailsForCourseAssignment?course_assignment_id=${values.courseId}&program_specialization_id=${values.programSpeId}&current_year=${values.yearsemId}`
        );
        const rowId =
          studentResponse.data.data.course_unassigned_student_details_on_year.map(
            (obj, index) => ({
              ...obj,
              id: index + 1,
              checked: false,
            })
          );
        setStudentDetailsOptions(rowId);
      } else if (
        isNew &&
        values.schoolId &&
        values.programSpeId &&
        values.yearsemId &&
        values.courseId &&
        programType === "Sem"
      ) {
        const studentResponse = await axios.get(
          `/api/academic/getStudentDetailsForCourseAssignment?course_assignment_id=${values.courseId}&program_specialization_id=${values.programSpeId}&current_sem=${values.yearsemId}`
        );

        const rowId =
          studentResponse.data.data.course_unassigned_student_details_on_sem.map(
            (obj, index) => ({
              ...obj,
              id: index + 1,
              checked: false,
            })
          );

        setStudentDetailsOptions(rowId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckboxChange = (id) => (event) => {
    const isChecked = event.target.checked;

    // Update studentDetailsOptions
    const studentUpdatedList = studentDetailsOptions.map((obj) =>
      obj.student_id === id ? { ...obj, checked: isChecked } : obj
    );
    setStudentDetailsOptions(studentUpdatedList);

    // Add or remove student_id from uncheckedStudentIds based on checkbox state
    if (!isChecked) {
      setUncheckedStudentIds((prevIds) => [...prevIds, id]); // Add to unchecked list if unchecked
    } else {
      setUncheckedStudentIds((prevIds) =>
        prevIds.filter((studentId) => studentId !== id)
      ); // Remove from unchecked list if checked
    }
  };

  // Handle header checkbox (select all or deselect all)
  const handleHeaderCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    // Update all students' checked state
    const allStudentsUpdated = studentDetailsOptions.map((obj) => ({
      ...obj,
      checked: isChecked,
    }));
    setStudentDetailsOptions(allStudentsUpdated);

    // If header checkbox is checked, clear the unchecked list
    if (isChecked) {
      setUncheckedStudentIds([]); // Clear the list when all are selected
    } else {
      // If header checkbox is unchecked, populate the list with all student_ids
      setUncheckedStudentIds(
        studentDetailsOptions.map((student) => student.student_id)
      );
    }
  };

  const getStudentDetailsDataOne = async () => {
    await axios
      .get(
        `/api/student/fetchAllStudentDetailForSectionAssignmentForUpdate/${values.acYearId}/${values.schoolId}/${values.programIdForUpdate}/${values.programSpeId}/${values.yearsemId}/${values.sectionId}`
      )
      .then((res) => {
        setStudentDetailsOptions(
          res.data.data.map((obj) => {
            return obj.section_id ? { ...obj, isChecked: true } : obj;
          })
        );
      })
      .catch((err) => console.error(err));
  };

  const getCourseStudentAssignmentData = async () => {
    await axios
      .get(`/api/academic/courseStudentAssignment/${id}`)
      .then((res) => {
        setValues({
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programSpeId: res.data.data.program_specialization_id,
          yearsemId: res.data.data.current_year_sem,
          courseId: res.data.data.course_id,
          remarks: res.data.data.remarks,
          programIdForUpdate: res.data.data.program_id,
          studentId: res.data.data.student_ids,
        });
        setSectionAssignmentId(res.data.data.section_assignment_id);
        setCrumbs([
          { name: "Course Master", link: "/CourseMaster/Student" },
          { name: "Course Assignment" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const getAllselectedSpecialization = (newValue, name) => {
    const specializationSelected = programSpeOptions.find(
      (obj) => obj.value === newValue
    );

    setProgramId(specializationSelected.program_id);
    setProgramAssignmentId(specializationSelected.program_assignment_id);

    if (specializationSelected.program_type_name.toLowerCase() === "yearly") {
      setProgramType("Year");

      const newYear = [];
      for (let i = 1; i <= specializationSelected.number_of_years; i++) {
        newYear.push({ value: i, label: "Year" + "-" + i });
      }

      setYearSemOptions(
        newYear.map((obj) => ({
          value: obj.value,
          label: obj.label,
        }))
      );
    } else if (
      specializationSelected.program_type_name.toLowerCase() === "semester"
    ) {
      setProgramType("Sem");

      const newYear = [];
      for (let i = 1; i <= specializationSelected.number_of_semester; i++) {
        newYear.push({ value: i, label: "Sem" + "-" + i });
      }
      setYearSemOptions(
        newYear.map((obj) => ({
          value: obj.value,
          label: obj.label,
        }))
      );
    }

    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name === "programSpeId") {
      getAllselectedSpecialization(newValue, name);
    } else {
      setValues((prev) => ({ ...prev, [name]: newValue }));
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
        message: "please fill all fields",
      });
      setAlertOpen(true);
    } else {
      const studentsIds = [];

      studentDetailsOptions.map((obj) => {
        if (obj.checked === true) {
          studentsIds.push(obj.student_id);
        }
      });

      const temp = {};
      temp.active = true;
      temp.course_assignment_id = values.courseId;
      temp.student_id = studentsIds;

      await axios
        .post(`/api/academic/courseStudentAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/Courseassignmentstudentindex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Course Assigned",
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

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          {roleShortName === "SAA" ? (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={!isNew}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={schoolOptions}
                handleChangeAdvance={handleChangeAdvance}
                disabled={true}
                required
              />
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programSpeId"
              label="Program Major"
              value={values.programSpeId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="yearsemId"
              label="Year/Sem"
              value={values.yearsemId}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
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
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={8}>
            {values.yearsemId ? (
              <>
                <GridIndex rows={studentDetailsOptions} columns={columns} />
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" textAlign="right">
          <Grid item xs={12} md={2} mt={4}>
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
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default CourseStudentAssignment;
