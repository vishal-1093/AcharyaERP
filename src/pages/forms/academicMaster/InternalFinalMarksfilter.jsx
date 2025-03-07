import { lazy, useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, Grid } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";

const InternalFinalMarksReport = lazy(() =>
  import("./InternalFinalMarksReport")
);

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
  internalId: null,
};

const requiredFields = ["acyearId", "programId", "yearSem"];

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;
const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

function InternalFinalMarksfilter() {
  const [values, setValues] = useState(initialValues);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getYearSems();
  }, [values.programId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empResponse, acyearRes, internalResponse] = await Promise.all([
        axios.get(`/api/employee/getEmployeeDataByUserID/${userId}`),
        axios.get("/api/academic/academic_year"),
        axios.get("api/academic/InternalTypes"),
      ]);
      const empResponseData = empResponse.data.data;
      const schoolId = empResponseData.school_id;
      const deptId = empResponseData.dept_id;
      if (roleShortName === "PRN" && !schoolId) {
        throw new Error(
          "School ID not found! Please check the ID and try again !!"
        );
      }
      if (roleShortName === "HOD" && !deptId) {
        throw new Error(
          "Department ID not found! Please check the ID and try again !!"
        );
      }

      const programRes = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      let responseData = programRes.data.data;

      if (roleShortName === "HOD") {
        responseData.filter((obj) => obj.dept_id === deptId);
      }
      responseData.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});

      const acyearOptionData = [];
      const filterAcyear = acyearRes.data.data.filter(
        (obj) => obj.ac_year_id > 5
      );
      filterAcyear?.forEach((obj) => {
        acyearOptionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });
      const internalResponseData = internalResponse.data.data;
      const internalOptionData = [];
      internalResponseData.forEach((obj) => {
        internalOptionData.push({
          value: obj.internal_short_name,
          label: obj.internal_name,
        });
      });
      const latestAcYearId = acyearOptionData.reduce((acc, next) => {
        return next.value > acc.value ? next : acc;
      }, acyearOptionData[0]);
      setAcyearOptions(acyearOptionData);
      setProgramOptions(optionData);
      setProgramData(programObject);
      setInternalOptions(internalOptionData);
      setValues((prev) => ({
        ...prev,
        acyearId: latestAcYearId.value,
        ...(roleShortName === "PRN" && { schoolId }),
        ...(roleShortName === "HOD" && { deptId }),
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const getYearSems = () => {
    const { programId } = values;
    if (!programId) return null;

    if (programId in programData) {
      const {
        program_type_name: programType,
        number_of_semester: sems,
        number_of_years: years,
      } = programData[programId];

      let totalYearSem, type;

      if (programType?.toLowerCase() === "semester") {
        totalYearSem = sems;
        type = "Sem";
      } else {
        totalYearSem = years;
        type = "Year";
      }

      const optionData = [];
      for (let i = 1; i <= totalYearSem; i++) {
        optionData.push({
          value: i,
          label: `${type} ${i}`,
        });
      }
      setYearSemOptions(optionData);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { acyearId, programId, yearSem } = values;
    // if (!acyearId || !programId) return null;
    try {
      setLoading(true);
      let currentYear;
      let currentSem;
      if (
        programData[programId]?.program_type_name?.toLowerCase() === "semester"
      ) {
        currentYear = Math.round(yearSem / 2);
        currentSem = yearSem;
      } else {
        currentYear = yearSem;
        currentSem = 0;
      }
      let url = "/api/student/fetchFromStudentMarksWithFilteredData?page=0";
      const response = await axios.get(
        "https://acerp.acharyaerptech.in/api/student/fetchFromStudentMarksWithFilteredData?page=0&page_size=10000&sort=created_date&ac_year_id=6&school_id=2&program_specialization_id=70"
      );
      const responseData = response.data.data.Paginated_data.content;
      const courses = responseData.reduce((acc, next) => {
        acc[next.course_assignment_id] = {
          name: next.course_short_name,
          code: next.course_code,
        };
        return acc;
      }, {});
      const internals = ["IA1", "IA2"];
      const uniqueRows = Array.from(
        new Map(responseData.map((item) => [item.student_id, item])).values()
      );
      const marksData = {};
      uniqueRows.forEach((obj) => {
        Object.keys(courses).forEach((item) => {
          internals.forEach((inter) => {
            const value = responseData.find(
              (chk) =>
                chk.student_id === obj.student_id &&
                chk.course_assignment_id === Number(item)
            );
            if (value) {
              marksData[`${obj.student_id}-${item}-${inter}`] = Number(
                value.marks_obtained_internal
              );
            }
          });
        });
      });
      setData({ courses, internals, marksData, uniqueRows });
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ margin: { xs: 1, md: 2 } }}>
      <FormPaperWrapper>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="acyearId"
              label="Ac Year"
              value={values.acyearId}
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programId"
              label="Program Specialization"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          {values.programId in programData && (
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="yearSem"
                label={programData[values.programId].program_type_name}
                value={values.yearSem}
                options={yearSemOptions}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>
          )}
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="internalId"
              label="Internal"
              value={values.internalId}
              options={internalOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleSubmit}
              //   disabled={!requiredFieldsValid()}
            >
              GO
            </Button>
          </Grid>

          {Object.values(data).length > 0 && (
            <Grid item xs={12}>
              <InternalFinalMarksReport data={data} />
            </Grid>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default InternalFinalMarksfilter;
