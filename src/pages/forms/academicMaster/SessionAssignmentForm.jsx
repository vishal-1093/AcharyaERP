import { useState, useEffect } from "react";
import { Grid, Button, CircularProgress, Box } from "@mui/material";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import axios from "../../../services/Api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import FormWrapper from "../../../components/FormWrapper";

const initialValues = {
  internalId: null,
  internalName: "",
  fromDate: null,
  toDate: null,
  acYearId: null,
  schoolId: null,
  programIdForUpdate: null,
  programSpeId: null,
  yearsemId: null,
  remarks: "",
  studentId: "",
};

const requiredFields = ["acYearId", "schoolId", "programSpeId", "yearsemId"];

function SessionAssignmentForm() {
  const [isNew, setIsNew] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [sessionAssignmentId, setSessionAssignmentId] = useState(null);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [internalTypeOptions, setInternalTypeOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);

  const [yearSemOptions, setYearSemOptions] = useState([]);

  const [programType, setProgramType] = useState("Sem");
  const [programId, setProgramId] = useState(null);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);

  const { id } = useParams();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  const navigate = useNavigate();

  const checks = {
    fromDate: [values.fromDate !== null],
    toDate: [values.toDate !== null],
  };

  const errorMessages = {
    fromDate: ["This field is required"],
    toDate: ["This field is required"],
  };

  useEffect(() => {
    getAcademicyear();
    getInternalTypes();
    getSchool();
    if (pathname.toLowerCase() === "/sessionassignmentform") {
      setIsNew(true);
    } else {
      setIsNew(false);
      getSessionAssginmentData();
    }
  }, []);

  useEffect(() => {
    getProgramSpeData();
    getYearSemForUpdate();
  }, [
    values.acYearId,
    values.schoolId,
    values.programSpeId,
    values.yearsemId,
    programType,
  ]);

  const getAcademicyear = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcademicYearOptions(
          res.data.data
            .filter((val) => {
              return val.current_year <= 2023 && val.current_year > 2019;
            })
            .map((obj) => ({
              value: obj.ac_year_id,
              label: obj.ac_year,
            }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getInternalTypes = async () => {
    await axios
      .get(`/api/academic/InternalTypes`)
      .then((res) => {
        setInternalTypeOptions(
          res.data.data.map((obj) => ({
            value: obj.internal_master_id,
            label: obj.internal_name,
          }))
        );
      })
      .catch((error) => console.error(error));
  };

  const getSchool = async () => {
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

  const getSessionAssginmentData = async () => {
    await axios
      .get(`/api/academic/internalSessionAssignment/${id}`)
      .then((res) => {
        setValues({
          internalId: res.data.data.internal_master_id,
          fromDate: res.data.data.from_date,
          toDate: res.data.data.to_date,
          acYearId: res.data.data.ac_year_id,
          schoolId: res.data.data.school_id,
          programSpeId: res.data.data.program_specialization_id,
          yearsemId: res.data.data.year_sem,
          sectionId: res.data.data.section_id,
          remarks: res.data.data.remarks,
          programIdForUpdate: res.data.data.program_id,
          internalName: res.data.data.internal_name,
        });
        setSessionAssignmentId(res.data.data.internal_id);
      })
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
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
              setProgramId(obj.program_id);
              setProgramAssignmentId(obj.program_assignment_id);
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
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.internal_master_id = values.internalId;
      temp.internal_name = internalTypeOptions
        .filter((obj) => obj.value === values.internalId)
        .map((val) => val.label)
        .toString();
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_specialization_id = values.programSpeId;
      temp.program_id = programId;
      temp.program_assignment_id = programAssigmentId;
      temp.year_sem = values.yearsemId;
      temp.remarks = values.remarks;

      await axios
        .post(`/api/academic/internalSessionAssignment`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            navigate("/SessionAssignmentIndex", { replace: true });
            setAlertMessage({
              severity: "success",
              message: "Session Assignment Created",
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
        message: "Please fill required fields",
      });
      setAlertOpen(true);
    } else {
      setLoading(true);
      const temp = {};
      temp.active = true;
      temp.internal_id = sessionAssignmentId;
      temp.internal_master_id = values.internalId;
      temp.internal_name = values.internalName
        ? values.internalName
        : internalTypeOptions
            .filter((obj) => obj.value === values.internalId)
            .map((val) => val.value)
            .toString();
      temp.from_date = values.fromDate;
      temp.to_date = values.toDate;
      temp.ac_year_id = values.acYearId;
      temp.school_id = values.schoolId;
      temp.program_specialization_id = values.programSpeId;
      temp.program_id = programId ? programId : values.programIdForUpdate;
      temp.program_assignment_id = programAssigmentId;
      temp.year_sem = values.yearsemId;
      temp.remarks = values.remarks;

      await axios
        .put(`/api/academic/internalSessionAssignment/${id}`, temp)
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 201) {
            setAlertMessage({
              severity: "success",
              message: "Session Assignment Updated",
            });
            navigate("/SessionAssignmentIndex", { replace: true });
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
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="internalId"
              label="Session"
              value={values.internalId}
              options={internalTypeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3} mt={2.5}>
            <CustomDatePicker
              name="fromDate"
              label="From Date"
              value={values.fromDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.fromDate}
              errors={errorMessages.fromDate}
              required
              disablePast
            />
          </Grid>
          <Grid item xs={12} md={3} mt={2.5}>
            <CustomDatePicker
              name="toDate"
              label="To Date"
              value={values.toDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.toDate}
              errors={errorMessages.toDate}
              minDate={values.fromDate}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={values.acYearId}
              options={academicYearOptions}
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
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" textAlign="right">
          <Grid item xs={12} md={2} mt={4}>
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

export default SessionAssignmentForm;
