import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import FormPaperWrapper from "../../../components/FormPaperWrapper";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import { useNavigate } from "react-router-dom";

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
    backgroundColor: theme.palette.auzColor.main,
    color: theme.palette.headerWhite.main,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    textAlign: "center",
    padding: 10,
  },
}));

const roleName = JSON.parse(localStorage.getItem("AcharyaErpUser"))?.roleName;

function InternalAssesmentForm() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [internalsData, setInternalsData] = useState([]);
  const [programType, setProgramType] = useState("");
  const [timeSlotOptions, setTimeslotOptions] = useState([]);
  const [errorColor, setErrorColor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

  const checks = {};
  const errorMessages = {};

  values?.rowData?.forEach((obj, i) => {
    checks["minMarks" + i] = [/^[0-9]+$/.test(values.rowData[i].minMarks)];
    errorMessages["minMarks" + i] = [
      "Invalid marks",
      "Min marks should be less than max marks",
    ];
    checks["maxMarks" + i] = [/^[0-9]+$/.test(values.rowData[i].maxMarks)];
    errorMessages["maxMarks" + i] = [
      "Invalid marks",
      "Max marks should be greater than min marks",
    ];
  });

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
      const [acyearRes, schoolResponse, internalResponse] = await Promise.all([
        axios.get(`/api/academic/academic_year`),
        axios.get("/api/institute/school"),
        axios.get("api/academic/InternalTypes"),
      ]);
      const internalResponseData = internalResponse.data.data;

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
        });
      });

      setAcyearOptions(acyearOptionData);
      setSchoolOptions(schoolOptionData);
      setInternalOptions(internalOptionData);
      setInternalsData(internalResponseData);
    } catch (err) {
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

  console.log("programData :>> ", programData[values.programId]);

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
        console.log("i :>> ", i);
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

  const handleChangeInternal = (e) => {
    const splitName = e.target.name.split("-");
    setValues((prev) => ({
      ...prev,
      rowData: prev.rowData.map((obj, i) => {
        if (obj.courseAssignmentId === Number(splitName[1])) {
          const temp = { ...obj };
          temp[splitName[0]] = e.target.value;
          return temp;
        }
        return obj;
      }),
    }));

    if (errorColor.includes(Number(splitName[1])) === true) {
      const getIndex = errorColor.indexOf(Number(splitName[1]));
      errorColor.splice(getIndex, 1);
    }
  };

  const handleChangeAdvanceInternal = (name, newValue) => {
    const splitName = name.split("-");
    setValues((prev) => ({
      ...prev,
      rowData: prev.rowData.map((obj, i) => {
        if (obj.courseAssignmentId === Number(splitName[1])) {
          const temp = { ...obj };
          temp[splitName[0]] = newValue;
          return temp;
        }
        return obj;
      }),
    }));

    if (errorColor.includes(Number(splitName[1])) === true) {
      const getIndex = errorColor.indexOf(Number(splitName[1]));
      errorColor.splice(getIndex, 1);
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

  const getTimeSlots = async () => {
    const { schoolId } = values;
    if (!schoolId) return null;
    try {
      const response = await axios.get(
        `/api/academic/getTimeSlotsForInternals/${schoolId}`
      );
      const optionData = [];
      response.data.data.forEach((obj) => {
        optionData.push({
          value: obj.time_slots_id,
          label: obj.timeSlots,
        });
      });
      setTimeslotOptions(optionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the Time Slots",
      });
      setAlertOpen(true);
    }
  };

  const handleSubmit = async () => {
    const { schoolId, acyearId, interalTypeId, yearSem, programId } = values;
    try {
      setSubmitLoading(true);
      getTimeSlots();
      const response = await axios.get(
        `/api/academic/getInternalDetailsDataByAllParameters/${schoolId}/${acyearId}/${interalTypeId}/${yearSem}/${programId}`
      );
      const internalData = response.data.data;
      const internalsIds = {};
      internalData.forEach((obj) => {
        const {
          min_marks,
          max_marks,
          date_of_exam,
          time_slots_id,
          timeSlots,
          id,
          course_assignment_id,
        } = obj;
        const tempObj = {
          min_marks,
          max_marks,
          date_of_exam,
          time_slots_id,
          timeSlots,
          id,
        };
        internalsIds[course_assignment_id] = tempObj;
      });

      const yearSemString =
        programData.programId.toLowerCase() === "yearly"
          ? "&current_year=" + values.yearSem
          : "&current_sem=" + values.yearSem;
      const coursesResponse = await axios.get(
        `/api/academic/getCoursesForInternalsFromTimeTable?school_id=${values.schoolId}&program_specialization_id=${values.programId}&ac_year_id=${values.acyearId}${yearSemString}`
      );
      const coursesData = coursesResponse.data.data;
      const validateData = [];
      coursesData.forEach((obj) => {
        const { course_assignment_id, course_with_coursecode } = obj;
        const tempObj = {};
        tempObj.courseAssignmentId = course_assignment_id;
        tempObj.course = course_with_coursecode;
        const { minMarks, maxMarks, date, timeSlot, timeSlots, id } =
          internalsIds[course_assignment_id];
        if (course_assignment_id in internalsIds) {
          tempObj.minMarks = minMarks;
          tempObj.maxMarks = maxMarks;
          tempObj.date = date;
          tempObj.timeSlot = timeSlot;
          tempObj.timeSlots = timeSlots;
          tempObj.id = id;
          tempObj.readOnly = true;
        } else {
          tempObj.minMarks = "";
          tempObj.maxMarks = "";
          tempObj.date = null;
          tempObj.timeSlot = null;
          tempObj.readOnly = false;
        }
        validateData.push(tempObj);
        setValues((prev) => ({
          ...prev,
          ["rowData"]: validateData,
        }));
      });
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  const validateData = () => {
    const temp = [];
    const enteredTemp = [];
    const colorTemp = [];
    values.rowData.forEach((obj) => {
      const tempArray = [];
      ["minMarks", "maxMarks"].forEach((item) => {
        const value = obj[item] === "" ? false : true;
        tempArray.push(value);
      });

      ["date", "timeSlot"].forEach((item) => {
        const value = obj[item] === null ? false : true;
        tempArray.push(value);
      });
      const count = tempArray.filter((fil) => fil === false).length;
      const enteredCount = tempArray.filter((fil) => fil === true).length;
      if (count > 0 && count < 4) {
        temp.push(true);
        if (colorTemp.includes(obj.courseAssignmentId) === false) {
          colorTemp.push(obj.courseAssignmentId);
        }
      } else {
        if (colorTemp.includes(obj.courseAssignmentId) === true) {
          const getIndex = colorTemp.indexOf(obj.courseAssignmentId);
          colorTemp.splice(getIndex, 1);
        }
        temp.push(false);
      }

      if (enteredCount > 0) {
        enteredTemp.push(true);
      } else {
        enteredTemp.push(false);
      }
    });

    const data = {
      status: temp.includes(true) === true ? false : true,
      data: enteredTemp,
      colorIds: colorTemp,
    };
    return data;
  };

  const handleCreate = async () => {
    if (!validateData().status) {
      setAlertMessage({
        severity: "error",
        message: "Please fill all the fields of selected course !!",
      });
      setAlertOpen(true);
      setErrorColor(validateData().colorIds);

      return false;
    } else {
      const postData = [];
      const putData = [];
      const colorTemp = [];
      const ids = [];
      let status = 0;

      const filterData = programData.filter(
        (obj) => obj.program_specialization_id === values.programId
      );

      const getInternalName = internalsData.filter(
        (obj) => obj.internal_master_id === values.interalTypeId
      );

      values.rowData.forEach((obj) => {
        if (Number(obj.minMarks) > Number(obj.maxMarks)) {
          setAlertMessage({
            severity: "error",
            message: "Min marks should be less than the max marks !!",
          });
          setAlertOpen(true);
          if (colorTemp.includes(obj.courseAssignmentId) === false) {
            colorTemp.push(obj.courseAssignmentId);
          }
          return false;
        } else if (colorTemp.includes(obj.courseAssignmentId) === true) {
          const getIndex = colorTemp.indexOf(obj.courseAssignmentId);
          colorTemp.splice(getIndex, 1);
        }

        if (Number(obj.maxMarks) < Number(obj.minMarks)) {
          setAlertMessage({
            severity: "error",
            message: "Max marks should be greater than the min marks !!",
          });
          setAlertOpen(true);
          if (colorTemp.includes(obj.courseAssignmentId) === false) {
            colorTemp.push(obj.courseAssignmentId);
          }
          return false;
        } else if (colorTemp.includes(obj.courseAssignmentId) === true) {
          const getIndex = colorTemp.indexOf(obj.courseAssignmentId);
          colorTemp.splice(getIndex, 1);
        }
        setErrorColor(colorTemp);

        if (
          obj.minMarks !== "" &&
          obj.maxMarks !== "" &&
          obj.date !== null &&
          obj.timeSlot !== null
        ) {
          if (obj.readOnly === true) {
            putData.push({
              internal_master_id: values.interalTypeId,
              internal_name: getInternalName[0].internal_name,
              ac_year_id: values.acyearId,
              internal_short_name: getInternalName[0].internal_short_name,
              school_id: values.schoolId,
              program_id: filterData[0].program_id,
              program_specialization_id: values.programId,
              remarks: "",
              year_sem: values.yearSem,
              active: true,
              date_of_exam: obj.date,
              time_slots_id: obj.timeSlot,
              week_day: moment(obj.date).format("dddd"),
              min_marks: obj.minMarks,
              max_marks: obj.maxMarks,
              course_assignment_id: obj.courseAssignmentId,
            });
            ids.push(obj.id);
          } else {
            postData.push({
              internal_master_id: values.interalTypeId,
              internal_name: getInternalName[0].internal_name,
              ac_year_id: values.acyearId,
              internal_short_name: getInternalName[0].internal_short_name,
              school_id: values.schoolId,
              program_id: filterData[0].program_id,
              program_specialization_id: values.programId,
              remarks: "",
              year_sem: values.yearSem,
              active: true,
              date_of_exam: obj.date,
              time_slots_id: obj.timeSlot,
              week_day: moment(obj.date).format("dddd"),
              min_marks: obj.minMarks,
              max_marks: obj.maxMarks,
              course_assignment_id: obj.courseAssignmentId,
            });
          }
        }
      });

      if (postData.length > 0) {
        setLoading(true);
        await axios
          .post("/api/academic/internalSessionAssignment1", postData)
          .then((res) => {
            if (res.status) {
              status = 1;
            }
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
            setLoading(false);
          });
      }

      if (putData.length > 0) {
        setLoading(true);
        await axios
          .put(
            `/api/academic/internalSessionAssignment1/${ids.toString()}`,
            putData
          )
          .then((res) => {
            status = 1;
          })
          .catch((err) => {
            setAlertMessage({
              severity: "error",
              message: err.response
                ? err.response.data.message
                : "An error occured",
            });
            setAlertOpen(true);
            setLoading(false);
          });
      }

      if (status === 1) {
        setAlertMessage({
          severity: "success",
          message: "Internal assesment created successfully !!",
        });
        setAlertOpen(true);
        setLoading(false);
        navigate("/InternalAssignmentIndex", { replace: true });
      }
    }
  };

  return (
    <Box m={4}>
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

          {values.programId in programData && (
            <Grid item xs={12} md={2.4}>
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
              disabled={submitLoading || !requiredFieldsValid()}
            >
              {submitLoading ? (
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

          {values?.rowData?.length > 0 ? (
            <>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <StyledTableHeadCell>Sl No</StyledTableHeadCell>
                        <StyledTableHeadCell>Course</StyledTableHeadCell>
                        <StyledTableHeadCell>Min Marks</StyledTableHeadCell>
                        <StyledTableHeadCell>Max Marks</StyledTableHeadCell>
                        <StyledTableHeadCell>Exam Date</StyledTableHeadCell>
                        <StyledTableHeadCell>Time Slot</StyledTableHeadCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {values?.rowData?.map((obj, i) => {
                        return (
                          <TableRow
                            key={i}
                            sx={{
                              backgroundColor:
                                errorColor.includes(obj.courseAssignmentId) ===
                                true
                                  ? "error.light"
                                  : "transparent",
                            }}
                          >
                            <TableCell>
                              <Typography variant="subtitle2">
                                {i + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {obj.course}
                              </Typography>
                            </TableCell>
                            {/* && roleName !== "Super Admin" */}
                            {obj.readOnly && roleName !== "Super Admin" ? (
                              <>
                                <TableCell>
                                  <Typography>{obj.minMarks}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{obj.maxMarks}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>
                                    {moment(obj.date).format("DD-MM-YYYY")}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography>{obj.timeSlots}</Typography>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell sx={{ width: "8% !important" }}>
                                  <CustomTextField
                                    name={
                                      "minMarks" + "-" + obj.courseAssignmentId
                                    }
                                    value={obj.minMarks}
                                    handleChange={handleChangeInternal}
                                    checks={checks["minMarks" + i]}
                                    errors={errorMessages["minMarks" + i]}
                                  />
                                </TableCell>
                                <TableCell sx={{ width: "8% !important" }}>
                                  <CustomTextField
                                    name={
                                      "maxMarks" + "-" + obj.courseAssignmentId
                                    }
                                    value={obj.maxMarks}
                                    handleChange={handleChangeInternal}
                                    checks={checks["maxMarks" + i]}
                                    errors={errorMessages["maxMarks" + i]}
                                  />
                                </TableCell>
                                <TableCell sx={{ width: "10% !important" }}>
                                  <CustomDatePicker
                                    name={"date" + "-" + obj.courseAssignmentId}
                                    value={obj.date ? obj.date : null}
                                    handleChangeAdvance={
                                      handleChangeAdvanceInternal
                                    }
                                    helperText=""
                                  />
                                </TableCell>
                                <TableCell sx={{ width: "15% !important" }}>
                                  <CustomAutocomplete
                                    name={
                                      "timeSlot" + "-" + obj.courseAssignmentId
                                    }
                                    value={obj.timeSlot}
                                    options={timeSlotOptions}
                                    handleChangeAdvance={
                                      handleChangeAdvanceInternal
                                    }
                                  />
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} align="right">
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading || !validateData().data.includes(true)}
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
            </>
          ) : (
            <></>
          )}
        </Grid>
      </FormPaperWrapper>
    </Box>
  );
}

export default InternalAssesmentForm;
