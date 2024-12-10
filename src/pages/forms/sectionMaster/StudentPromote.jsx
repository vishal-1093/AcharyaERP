import { useState, useEffect } from "react";
import { Grid, Button, CircularProgress, Box, Checkbox } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import moment from "moment";
import GridIndex from "../../../components/GridIndex";

const initialValues = {
  acYearIdOne: null,
  acYearId: null,
  schoolId: null,
  programIdForUpdate: null,
  programSpeId: null,
  yearsemId: null,
  sectionId: null,
  remarks: "",
  studentId: "",
};

const requiredFields = [
  "acYearId",
  "schoolId",
  "programSpeId",
  "yearsemId",
  "sectionId",
];

const ELIGIBLE_REPORTED_STATUS = {
  1: "No status",
  2: "Not Eligible",
  3: "Eligible",
  4: "Not Reported",
  5: "Pass Out",
};

function StudentPromote() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [studentDetailsOptions, setStudentDetailsOptions] = useState([]);
  const [programType, setProgramType] = useState("Sem");
  const [programId, setProgramId] = useState(null);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);
  const [uncheckedStudentIds, setUncheckedStudentIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const checks = {};

  useEffect(() => {
    getSchool();
    getAcademicYear();
    getSectionAssignmentData();
    if (pathname.toLowerCase() === `/sectionmaster/promote/${id}`) {
      setIsNew(true);
      setCrumbs([
        { name: "Time table Master", link: "/TimetableMaster/Section" },
        { name: "Section Assignment" },
      ]);
    } else {
      setIsNew(false);
    }
  }, []);

  useEffect(() => {
    getProgramSpeData();
    getYearSemForUpdate();
    getSectionData();
  }, [
    values.acYearId,
    values.schoolId,
    values.programSpeId,
    values.yearsemId,
    programType,
  ]);

  useEffect(() => {
    setSelectAll(studentDetailsOptions.every((obj) => obj.checked));
  }, [studentDetailsOptions]);

  const getSchool = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        setSchoolOptions(
          res.data.data.map((obj) => ({
            value: obj.school_id,
            label: obj.school_name_short,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getAcademicYear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
        return res.data.data;
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
          setProgramSpeOptions(
            res.data.data.map((obj) => ({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            }))
          );
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

  const getYearSemForUpdate = async () => {
    if (values.schoolId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const yearsem = [];
          res.data.data.filter((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);
              setProgramId(obj.program_id);
              setProgramAssignmentId(obj.program_assignment_id);
            }
          });

          const newYear = [];
          yearsem.map((obj) => {
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

  const getSectionAssignmentData = async () => {
    await axios
      .get(`/api/academic/studentDetailsForPromoting/${id}`)
      .then((res) => {
        const rowId = res.data.data.map((obj, index) => ({
          ...obj,
          id: index + 1,
          checked: false,
        }));
        setStudentDetailsOptions(rowId);
        setValues((prev) => ({
          ...prev,
          acYearId: res?.data?.data?.[0]?.ac_year_id,
          yearsemId: res?.data?.data?.[0]?.current_sem
            ? res?.data?.data?.[0]?.current_sem
            : res?.data?.data?.[0]?.current_year,
        }));
      });
    await axios
      .get(`/api/academic/SectionAssignment/${id}`)
      .then((res) => {
        setValues((prev) => ({
          ...prev,
          schoolId: res.data.data.school_id,
          programSpeId: res.data.data.program_specialization_id,
          sectionId: res.data.data.section_id,
          remarks: res.data.data.remarks,
          programIdForUpdate: res.data.data.program_id,
        }));

        setCrumbs([
          { name: "Time table Master", link: "/TimetableMaster/Section" },
          { name: "Section Assignment" },
          { name: "Promote" },
        ]);
      })
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      field: "isSelected",
      headerName: "Checkbox Selection",
      flex: 1,
      sortable: false,
      renderHeader: () => (
        <FormGroup>
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
      valueGetter: (params) => params.row.usn ?? "NA",
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
      headerName: "Reported",
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

  const handleRemarks = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeAdvance = async (name, newValue) => {
    if (name === "programSpeId") {
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
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

      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_id = programId.toString();
      temp.program_specialization_id = values.programSpeId;
      temp.current_year_sem = values.yearsemId;
      temp.section_id = values.sectionId;
      temp.remarks = values.remarks;
      temp.student_ids = studentsIds?.toString();
      temp.program_assignment_id = programAssigmentId;

      await axios
        .post(`/api/academic/SectionAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/TimetableMaster/Section", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Promoted",
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
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
              handleChangeAdvance={handleChangeAdvance}
              disabled={isNew}
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
              disabled={isNew}
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
              disabled={isNew}
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
              disabled={isNew}
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
              disabled={isNew}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleRemarks}
              disabled={isNew}
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

export default StudentPromote;
