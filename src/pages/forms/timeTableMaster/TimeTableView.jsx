import { useState, useEffect } from "react";
import { Grid, Button, Box } from "@mui/material";
import axios from "../../../services/Api";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import FormWrapper from "../../../components/FormWrapper";
import dayjs from "dayjs";
import { convertDateToString } from "../../../utils/DateTimeUtils";
import { useNavigate } from "react-router-dom";

const initialValues = {
  acYearId: null,
  schoolId: null,
  programSpeId: null,
  yearsemId: null,
  sectionId: null,
  viewTypeId: null,
  fromDate: null,
};

function TimeTableView() {
  const [values, setValues] = useState(initialValues);

  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);

  const [programType, setProgramType] = useState(null);
  const [programId, setProgramId] = useState(null);
  const [programAssigmentId, setProgramAssignmentId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getAcademicyear();
    getSchool();
  }, []);

  useEffect(() => {
    getProgramSpeData();
    getSectionData();
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
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
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
              setProgramType(1);
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
              setProgramType(2);
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

  const handleCreate = async (e) => {
    const date = convertDateToString(dayjs(values.fromDate).$d)
      .split("/")
      .reverse()
      .join("-");
    if (values.viewTypeId === 1) {
      navigate(
        `/TimeTableViewDateWise/${values.acYearId}/${values.schoolId}/${programId}/${values.programSpeId}/${values.yearsemId}/${values.sectionId}/${date}/${programType}`
      );
    } else if (values.viewTypeId === 2) {
      navigate(
        `/TimeTableViewWeekWise/${values.acYearId}/${values.schoolId}/${programId}/${values.programSpeId}/${values.yearsemId}/${values.sectionId}/${date}/${programType}`
      );
    } else {
      navigate(
        `/TableTimeViewMonthWise/${values.acYearId}/${values.schoolId}/${programId}/${values.programSpeId}/${values.yearsemId}/${values.sectionId}/${date}/${programType}`
      );
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
            <CustomAutocomplete
              name="sectionId"
              label="Section"
              value={values.sectionId}
              options={sectionOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomAutocomplete
              name="viewTypeId"
              label="View Type"
              value={values.viewTypeId}
              options={[
                { value: 1, label: "Date Wise" },
                { value: 2, label: "Week Wise" },
                { value: 3, label: "Month Wise" },
              ]}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomDatePicker
              name="fromDate"
              label="From Date"
              value={values.fromDate}
              helperText=""
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" textAlign="right">
          <Grid item xs={12} md={2} mt={4}>
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              <strong>{"Submit"}</strong>
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default TimeTableView;
