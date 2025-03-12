import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import useAlert from "../../../hooks/useAlert";
import { GenerateInternalTimeTable } from "./GenerateInternalTimeTable";

const initialValues = {
  acyearId: null,
  schoolId: null,
  programId: null,
  yearSem: null,
  interalTypeId: null,
};

const requiredFields = [
  "acyearId",
  "schoolId",
  "programId",
  "yearSem",
  "interalTypeId",
];

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function InternalsTimeTable() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewPdf, setViewPdf] = useState("");

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    fetchData();
    setCrumbs([
      { name: "Internal Assesment", link: "/internals" },
      { name: "Create" },
    ]);
  }, []);

  useEffect(() => {
    getPrograms();
  }, [values.schoolId]);

  useEffect(() => {
    getYearSems();
  }, [values.programId]);

  const fetchData = async () => {
    try {
      const [acyearRes, schoolResponse, internalResponse, empResponse] =
        await Promise.all([
          axios.get("/api/academic/academic_year"),
          axios.get("/api/institute/school"),
          axios.get("api/academic/InternalTypes"),
          roleShortName !== "SAA"
            ? axios.get(`/api/employee/getEmployeeDataByUserID/${userId}`)
            : null,
        ]);
      const internalResponseData = internalResponse.data.data.filter((obj) => {
        const shortName = obj.internal_short_name?.trim().toLowerCase();
        return shortName !== "assignment" && shortName !== "external";
      });
      const empResponseData = empResponse?.data.data;

      const acyearOptionData = [];
      acyearRes.data.data?.forEach((obj) => {
        acyearOptionData.push({
          value: obj.ac_year_id,
          label: obj.ac_year,
        });
      });

      const schoolOptionData = [];
      schoolResponse.data.data.forEach((obj) => {
        schoolOptionData.push({
          value: obj.school_id,
          label: obj.school_name,
        });
      });

      const internalOptionData = [];
      internalResponseData.forEach((obj) => {
        internalOptionData.push({
          value: obj.internal_master_id,
          label: obj.internal_name,
          shortName: obj.internal_short_name,
        });
      });

      setAcyearOptions(acyearOptionData);
      setSchoolOptions(schoolOptionData);
      setInternalOptions(internalOptionData);
      setValues((prev) => ({
        ...prev,
        ["schoolId"]: empResponseData?.school_id,
      }));
    } catch (err) {
      console.error(err);
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data !!",
      });
      setAlertOpen(true);
    }
  };

  const getPrograms = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;

    try {
      const { data: response } = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecialization/${schoolId}`
      );
      const optionData = [];
      const responseData = response.data;
      response.data.forEach((obj) => {
        optionData.push({
          value: obj.program_specialization_id,
          label: `${obj.program_short_name} - ${obj.program_specialization_name}`,
        });
      });
      const programObject = responseData.reduce((acc, next) => {
        acc[next.program_specialization_id] = next;
        return acc;
      }, {});
      setProgramOptions(optionData);
      setProgramData(programObject);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load the programs data",
      });
      setAlertOpen(true);
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
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const { schoolId, acyearId, interalTypeId, yearSem, programId } = values;
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/academic/getInternalDetailsDataByAllParameters/${schoolId}/${acyearId}/${interalTypeId}/${yearSem}/${programId}`
      );
      const internalData = response.data.data;
      const blob = await GenerateInternalTimeTable(internalData);
      setViewPdf(URL.createObjectURL(blob));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m={4}>
      <FormPaperWrapper>
        <Grid container columnSpacing={4} rowSpacing={2}>
          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="acyearId"
              label="Ac Year"
              value={values.acyearId}
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          {roleShortName === "SAA" && (
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
          )}

          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="programId"
              label="Program Specialization"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          {values.programId in programData && (
            <Grid item xs={12} md={2}>
              <CustomAutocomplete
                name="yearSem"
                label={programData[values.programId].program_type_name}
                value={values.yearSem}
                options={yearSemOptions}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>
          )}

          <Grid item xs={12} md={2}>
            <CustomAutocomplete
              name="interalTypeId"
              label="Internal"
              value={values.interalTypeId}
              options={internalOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !requiredFieldsValid()}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <Typography variant="subtitle2">Submit</Typography>
              )}
            </Button>
          </Grid>

          {viewPdf && (
            <Grid item xs={12}>
              <object
                style={{ marginTop: "20px", width: "100%", height: "800px" }}
                data={viewPdf}
                type="application/pdf"
              >
                <p>
                  Your web browser doesn't have a PDF plugin. Instead you can
                  download the file directly.
                </p>
              </object>
            </Grid>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default InternalsTimeTable;
