import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTimePicker from "../../../components/Inputs/CustomTimePicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

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

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    textAlign: "center",
  },
}));

function InternalAssignmentForm() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [programType, setProgramType] = useState([]);

  const setCrumbs = useBreadcrumbs();

  const checks = {};

  const errorMessages = {};

  useEffect(() => {
    setCrumbs([{ name: "Internal Assesment" }]);
    getAcyears();
    getSchools();
    getPrograms();
    getInternals();
  }, []);

  useEffect(() => {
    getPrograms();
  }, [values.acyearId, values.schoolId]);

  useEffect(() => {
    getYearSems();
  }, [values.programId]);

  const getAcyears = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.ac_year_id,
            label: obj.ac_year,
          });
        });
        setAcyearOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getSchools = async () => {
    await axios
      .get(`/api/institute/school`)
      .then((res) => {
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.school_id,
            label: obj.school_name_short,
          });
        });
        setSchoolOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const getPrograms = async () => {
    if (values.schoolId && values.acyearId)
      await axios
        .get(
          `/api/academic/fetchAllProgramsWithSpecialization/${values.schoolId}`
        )
        .then((res) => {
          const optionData = [];
          res.data.data.forEach((obj) => {
            optionData.push({
              value: obj.program_specialization_id,
              label: obj.specialization_with_program,
            });
          });
          setProgramOptions(optionData);
          setProgramData(res.data.data);
        })
        .catch((err) => console.error(err));
  };

  const getYearSems = () => {
    if (values.programId) {
      const filterData = programData.filter(
        (obj) => obj.program_specialization_id === values.programId
      );

      if (filterData.length > 0) {
        const data = filterData[0];
        let maxYearSem = "";
        let type = "";
        if (data.number_of_semester > data.number_of_years) {
          maxYearSem = data.number_of_semester;
          type = "Sem";
        } else {
          maxYearSem = data.number_of_years;
          type = "Year";
        }

        const optionData = [];
        for (let i = 1; i <= maxYearSem; i++) {
          optionData.push({
            value: i,
            label: type + " " + i,
          });
        }
        setYearSemOptions(optionData);
        setProgramType(data.program_type_name);
      }
    }
  };

  const getInternals = async () => {
    await axios
      .get("api/academic/InternalTypes")
      .then((res) => {
        console.log("res.data.data", res.data.data);
        const optionData = [];
        res.data.data.forEach((obj) => {
          optionData.push({
            value: obj.internal_master_id,
            label: obj.internal_name,
          });
        });
        setInternalOptions(optionData);
      })
      .catch((err) => console.error(err));
  };

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
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

  const handleSubmit = async () => {
    const yearSemString =
      programType === "Yearly"
        ? "&current_year=" + values.yearSem
        : "&current_sem=" + values.yearSem;

    await axios
      .get(
        `/api/academic/getCoursesForInternalsFromTimeTable?school_id=${values.schoolId}&program_specialization_id=${values.programId}&ac_year_id=${values.acyearId}${yearSemString}`
      )
      .then((res) => {
        console.log("res.data.data", res.data.data);
      })
      .catch((err) => console.error());
  };

  return (
    <Box>
      <FormPaperWrapper>
        <Grid container columnSpacing={3} rowSpacing={3}>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="acyearId"
              label="Ac Year"
              value={values.acyearId}
              options={acyearOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="schoolId"
              label="School"
              value={values.schoolId}
              options={schoolOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="programId"
              label="Program Specialization"
              value={values.programId}
              options={programOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="yearSem"
              label="Year/Sem"
              value={values.yearSem}
              options={yearSemOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
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
              disabled={!requiredFieldsValid()}
            >
              GO
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell>Sl No</StyledTableHeadCell>
                    <StyledTableHeadCell>Course</StyledTableHeadCell>
                    <StyledTableHeadCell>Min Marks</StyledTableHeadCell>
                    <StyledTableHeadCell>Max Marks</StyledTableHeadCell>
                    <StyledTableHeadCell>Date</StyledTableHeadCell>
                    <StyledTableHeadCell>Time Slot</StyledTableHeadCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>
                      Artificial Intelligence and Machine Learning Engineering
                    </TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>125</TableCell>
                    <TableCell>
                      15-05-2024
                      {/* <IconButton>
                        <CalendarMonthIcon />
                      </IconButton> */}
                    </TableCell>
                    <TableCell>
                      {/* <IconButton>
                        <AccessAlarmIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default InternalAssignmentForm;
