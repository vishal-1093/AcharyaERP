import { useState, useEffect } from "react";
import { Grid, Button, Checkbox, CircularProgress, Box } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import axios from "../../../services/Api";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import GridIndex from "../../../components/GridIndex";
import moment from "moment";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programSpeId: null,
  yearsemId: null,
  batchId: "",
  remarks: "",
  intervalTypeId: "",
  programIdForUpdate: null,
  studentId: "",
};
const requiredFields = ["acYearId", "yearsemId", "sectionId", "schoolId"];

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
  6: "Promoted",
};

function SectionAssignmentForm() {
  const [isNew, setIsNew] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [programType, setProgramType] = useState("");
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [programId, setProgramId] = useState(null);
  const [programAssignmentId, setProgramAssignmentId] = useState(null);
  const [sectionAssignmentId, setSectionAssignmentId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [uncheckedStudentIds, setUncheckedStudentIds] = useState([]);

  const { pathname } = useLocation();
  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getAcademicYearOptions();
    getSchoolNameOptions();

    if (
      pathname.toLowerCase() === "/timetablemaster/sectionassignmentform/new"
    ) {
      setIsNew(true);
      setCrumbs([
        {
          name: "TimeTable Master",
          link: "/TimeTableMaster/Section",
        },
        { name: "Section Assignment" },
        { name: "Create" },
      ]);
    } else {
      getSectionAssignmentData();
      setIsNew(false);
    }
  }, []);

  useEffect(() => {
    getProgramSpecialization();
    getSectionData();
  }, [values.schoolId]);

  useEffect(() => {
    getStudentsData();
    getYearSemData();
  }, [
    isNew,
    values.acYearId,
    values.schoolId,
    values.yearsemId,
    programType,
    values.sectionId,
    values.programSpeId,
  ]);

  useEffect(() => {
    setSelectAll(studentDetailsOptions.every((obj) => obj.checked));
  }, [studentDetailsOptions]);

  const checks = {
    programSpeId: [values.programSpeId !== null],
    remarks: [values.remarks !== "", values.remarks.length <= 10],
  };

  const errorMessages = {
    programSpeId: ["This field required"],
    remarks: ["This field required", "Characters length should not exceed 10"],
  };

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
      valueGetter: (value, row) =>
        row?.reporting_date
          ? moment(row?.reporting_date).format("DD-MM-YYYY")
          : "NA",
    },
    {
      field: "current",
      headerName: "Year/Sem",
      flex: 1,
      valueGetter: (value, row) =>
        row?.current_year
          ? row?.current_year + "/" + row?.current_sem
          : "NA",
    },
    {
      field: "eligible_reported_status",
      headerName: "Reported",
      flex: 1,
      valueGetter: (value, row) =>
        row?.eligible_reported_status
          ? ELIGIBLE_REPORTED_STATUS[row?.eligible_reported_status]
          : "",
    },
  ];

  const headerCheckbox = (
    <Checkbox
      checked={selectAll}
      onClick={(e) => handleHeaderCheckboxChange(e)}
    />
  );

  const getSectionAssignmentData = async () => {
    await axios
      .get(`/api/academic/SectionAssignment/${id}`)
      .then(async (res) => {
        const data = res.data.data;
        setValues({
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programSpeId: res.data.data.program_specialization_id,
          yearsemId: res.data.data.current_year_sem,
          sectionId: res.data.data.section_id,
          remarks: res.data.data.remarks,
          programIdForUpdate: res.data.data.program_id,
          studentId: res.data.data.student_ids,
          programAssignmentId: res.data.data.program_assignment_id,
        });
        setSectionAssignmentId(res.data.data.section_assignment_id);

        await axios
          .get(
            `/api/academic/fetchStudentDetailsForUpdate?student_ids=${res.data.data.student_ids}`
          )
          .then((res) => {
            setStudentDetailsOptions(
              res.data.data.map((obj, index) => {
                return obj.student_id
                  ? { ...obj, checked: true, id: index + 1 }
                  : obj;
              })
            );
          })
          .catch((error) => console.error(error));

        setCrumbs([
          { name: "TimeTable Master", link: "/TimeTableMaster/Section" },
          { name: "Section Assignment" },
          { name: "Update" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const getSectionData = async () => {
    if (values.schoolId)
      await axios
        .get(`/api/academic/fetchSectionBySchool/${values.schoolId}`)
        .then((res) => {
          setSectionOptions(
            res.data.data.map((obj) => ({
              value: obj.section_id,
              label: obj.section_name,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getYearSemData = async () => {
    if (!isNew && values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.forEach((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);
            }
          });

          const newYear = [];
          yearsem.forEach((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              setProgramType("Year");
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType("Sem");
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

  const getAcademicYearOptions = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSchoolNameOptions = async () => {
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

  const getProgramSpecialization = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
              program_type_name: obj.program_type_name,
              program_short_name: obj.program_short_name,
              program_name: obj.program_name,
              program_id: obj.program_id,
              number_of_years: obj.number_of_years,
              number_of_semester: obj.number_of_semester,
              program_assignment_id: obj.program_assignment_id,
            }))
          );
        })
        .catch((err) => console.error(err));
  };

  const getStudentsData = async () => {
    try {
      if (
        isNew &&
        values.acYearId &&
        values.schoolId &&
        values.programSpeId &&
        values.yearsemId &&
        programType === "Year"
      ) {
        const studentResponse = await axios.get(
          `/api/student/fetchStudentDetailForSectionAssignment?school_id=${values.schoolId}&program_id=${programId}&program_specialization_id=${values.programSpeId}&current_year=${values.yearsemId}`
        );
        const rowId = studentResponse.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
          checked: false,
        }));
        setStudentDetailsOptions(rowId);
      } else if (
        isNew &&
        values.acYearId &&
        values.schoolId &&
        values.programSpeId &&
        values.yearsemId &&
        programType === "Sem"
      ) {
        const studentResponse = await axios.get(
          `/api/student/fetchStudentDetailForSectionAssignment?school_id=${values.schoolId}&program_id=${programId}&program_specialization_id=${values.programSpeId}&current_sem=${values.yearsemId}`
        );

        const rowId = studentResponse.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
          checked: false,
        }));

        setStudentDetailsOptions(rowId);
      }
    } catch (error) {
      console.log(error);
    }
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

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      const studentsIds = [];

      studentDetailsOptions.map((obj) => {
        if (obj.checked === true) {
          studentsIds.push(obj.student_id);
        }
      });

      setLoading(true);
      const payload = {
        active: true,
        ac_year_id: values.acYearId,
        section_id: values.sectionId,
        current_year_sem: values.yearsemId,
        program_specialization_id: values.programSpeId,
        program_assignment_id: programAssignmentId,
        program_id: programId,
        remarks: values.remarks,
        school_id: values.schoolId,
        student_ids: studentsIds?.toString(),
      };

      await axios
        .post(`/api/academic/SectionAssignment`, payload)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/TimeTableMaster/Section", {
              replace: true,
            });
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

  const handleUpdate = async (e) => {
    if (!requiredFieldsValid()) {
      setAlertMessage({
        severity: "error",
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      const studentsIds = [];

      studentDetailsOptions.map((obj) => {
        if (obj.checked === true) {
          studentsIds.push(obj.student_id);
        }
      });

      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.section_assignment_id = sectionAssignmentId;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = values.programIdForUpdate;
      temp.program_specialization_id = values.programSpeId;
      temp.current_year_sem = values.yearsemId;
      temp.section_id = values.sectionId;
      temp.remarks = values.remarks;
      temp.student_ids = studentsIds?.toString();
      temp.program_assignment_id = values.programAssignmentId;

      if (uncheckedStudentIds.length > 0) {
        await axios
          .put(
            `/api/academic/SectionAssignment/${id}/${uncheckedStudentIds.toString()}`,
            temp
          )
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "Section Assignment Updated",
              });
              navigate("/TimeTableMaster/Section", { replace: true });
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
              message: error.response.data.message,
            });
          });
      } else {
        await axios
          .put(`/api/academic/SectionAssignment/${id}`, temp)
          .then((res) => {
            setLoading(false);
            if (res.status === 200 || res.status === 201) {
              setAlertMessage({
                severity: "success",
                message: "Section Assignment Updated",
              });
              navigate("/SectionMaster/Assign", { replace: true });
            } else {
              setAlertMessage({
                severity: "error",
                message: res.data ? res.data.message : "Error Occured",
              });
            }
            setAlertOpen(true);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            setAlertMessage({
              severity: "error",
              message: error.response.data.message,
            });
          });
      }
    }

    const tempOne = {};
    tempOne.active = true;
    tempOne.section_assignment_id = sectionAssignmentId;
    tempOne.ac_year_id = values.acYearId;
    tempOne.school_id = values.schoolId;
    tempOne.program_id = values.programIdForUpdate;
    tempOne.program_specialization_id = values.programSpeId;
    tempOne.current_year_sem = values.current_year_sem;
    tempOne.section_id = values.sectionId;
    tempOne.remarks = values.remarks;
    tempOne.student_ids = values.studentId;

    await axios
      .post(`/api/academic/sectionAssignmentHistory`, tempOne)
      .then((res) => {
        setAlertMessage({
          severity: "success",
          message: "Section Assignment Updated",
        });
        setAlertOpen(true);
      })
      .catch((error) => {
        setAlertMessage({
          severity: "error",
          message: error.response ? error.response.data.message : "Error",
        });
        setAlertOpen(true);
      });
  };

  return (
    <Box component="form" overflow="hidden">
      <FormWrapper>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          rowSpacing={4}
          columnSpacing={2}
        >
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="sectionId"
              label="Section"
              value={values.sectionId}
              options={sectionOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={!isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              disabled={!isNew}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            {values.yearsemId ? (
              <GridIndex rows={studentDetailsOptions} columns={columns} />
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={12} align="right">
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

export default SectionAssignmentForm;
