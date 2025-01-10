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
import DeleteIcon from "@mui/icons-material/Delete";
import ModalWrapper from "../../../components/ModalWrapper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    border: "1px solid rgba(224, 224, 224, 1)",
  },
}));

const roleShortName = JSON.parse(
  sessionStorage.getItem("AcharyaErpUser")
)?.roleShortName;

const userId = JSON.parse(sessionStorage.getItem("AcharyaErpUser"))?.userId;

function InternalAssesmentForm() {
  const [values, setValues] = useState(initialValues);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [acyearOptions, setAcyearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [internalOptions, setInternalOptions] = useState([]);
  const [timeSlotOptions, setTimeslotOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const setCrumbs = useBreadcrumbs();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const navigate = useNavigate();

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

  console.log("values", values);
  const fetchData = async () => {
    try {
      const [acyearRes, schoolResponse, internalResponse, empResponse] =
        await Promise.all([
          axios.get(`/api/academic/academic_year`),
          axios.get("/api/institute/school"),
          axios.get("api/academic/InternalTypes"),
          roleShortName !== "SAA"
            ? axios.get(`/api/employee/getEmployeeDataByUserID/${userId}`)
            : null,
        ]);
      const internalResponseData = internalResponse.data.data;
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

  const filteredRows = values?.rowData?.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeInternal = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    const [field, index] = name.split("-");
    const parsedIndex = parseInt(index, 10);

    setValues((prev) => ({
      ...prev,
      rowData: prev.rowData.map((obj) =>
        obj.courseAssignmentId === parsedIndex
          ? {
              ...obj,
              [field]:
                field === "minMarks" && value > obj.maxMarks
                  ? obj.maxMarks
                  : value,
            }
          : obj
      ),
    }));
  };

  const handleChangeAdvanceInternal = (name, newValue) => {
    const [key, id] = name.split("-");
    const courseAssignmentId = Number(id);

    setValues((prev) => ({
      ...prev,
      rowData: prev.rowData.map((obj) =>
        obj.courseAssignmentId === courseAssignmentId
          ? { ...obj, [key]: newValue }
          : obj
      ),
    }));
  };

  const handleCopy = (id) => {
    setValues((prev) => ({
      ...prev,
      rowData: prev.rowData.map((obj, index, arr) => {
        if (obj.courseAssignmentId === id) {
          const prevRow = arr[index - 1];
          if (prevRow) {
            return {
              ...obj,
              minMarks: prevRow.minMarks,
              maxMarks: prevRow.maxMarks,
              maxMarks: prevRow.maxMarks,
              date: prevRow.date,
              timeSlotId: prevRow.timeSlotId,
            };
          }
        }
        return obj;
      }),
    }));
  };

  const requiredFieldsValid = () => {
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!values[field]) return false;
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
          min_marks: minMarks,
          max_marks: maxMarks,
          date_of_exam: examDate,
          time_slots_id: timeSlotId,
          timeSlots: timeSlot,
          id,
          course_assignment_id: courseAssignmentId,
        } = obj;
        const tempObj = {
          minMarks,
          maxMarks,
          examDate,
          timeSlotId,
          timeSlot,
          id,
        };
        internalsIds[courseAssignmentId] = tempObj;
      });

      const yearSemString =
        programData.programId?.toLowerCase() === "yearly"
          ? "&current_year=" + values.yearSem
          : "&current_sem=" + values.yearSem;
      const coursesResponse = await axios.get(
        `/api/academic/getCoursesForInternalsFromTimeTable?school_id=${values.schoolId}&program_specialization_id=${values.programId}&ac_year_id=${values.acyearId}${yearSemString}`
      );
      const coursesData = coursesResponse.data.data;

      if (coursesData.length === 0) {
        setAlertMessage({
          severity: "error",
          message: "No Records Found.",
        });
        setAlertOpen(true);
        return;
      }
      const validateData = [];
      coursesData.forEach((obj) => {
        const {
          course_assignment_id: courseAssignmentId,
          course_with_coursecode: courseCode,
        } = obj;
        const tempObj = {};
        tempObj.courseAssignmentId = courseAssignmentId;
        tempObj.course = courseCode;

        if (courseAssignmentId in internalsIds) {
          const { minMarks, maxMarks, examDate, timeSlotId, timeSlot, id } =
            internalsIds[courseAssignmentId];
          tempObj.minMarks = minMarks;
          tempObj.maxMarks = maxMarks;
          tempObj.date = examDate;
          tempObj.timeSlotId = timeSlotId;
          tempObj.timeSlots = timeSlot;
          tempObj.id = id;
          tempObj.readOnly = true;
        } else {
          tempObj.minMarks = "";
          tempObj.maxMarks = "";
          tempObj.date = null;
          tempObj.timeSlotId = null;
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

  const isAllFilled = values?.rowData?.every(
    (obj) =>
      obj.minMarks !== "" &&
      obj.maxMarks !== "" &&
      obj.date !== null &&
      obj.timeSlotId !== null
  );

  const handleCreate = async () => {
    try {
      setLoading(true);
      const { interalTypeId, rowData, acyearId, schoolId, programId, yearSem } =
        values;
      const internalLabels = internalOptions.find(
        (obj) => obj.value === interalTypeId
      );
      const postData = [];
      const putData = [];
      const ids = [];
      rowData.forEach((obj) => {
        const { date, minMarks, maxMarks, courseAssignmentId, timeSlotId, id } =
          obj;
        const key = programData[programId];
        const programTypeName = key.program_type_name?.toLowerCase();
        const postObj = {
          ac_year_id: acyearId,
          school_id: schoolId,
          program_id: key.program_id,
          program_specialization_id: programId,
          year_sem: yearSem,
          current_year:
            programTypeName === "semester" ? Math.ceil(yearSem / 2) : yearSem,
          current_sem: programTypeName === "semester" ? yearSem : 0,
          active: true,
          date_of_exam: moment(date).format("DD-MM-YYYY"),
          time_slots_id: timeSlotId,
          week_day: moment(date).format("dddd"),
          min_marks: minMarks,
          max_marks: maxMarks,
          course_assignment_id: courseAssignmentId,
          internal_master_id: interalTypeId,
          internal_name: internalLabels?.label,
          internal_short_name: internalLabels?.shortName,
        };

        if (id) {
          postObj.internal_session_id = id;
          ids.push(id);
          putData.push(postObj);
        } else {
          postData.push(postObj);
        }
      });

      const requests = [];

      if (postData.length > 0) {
        requests.push(
          axios.post("/api/academic/internalSessionAssignment1", postData)
        );
      }

      if (putData.length > 0) {
        requests.push(
          axios.put(
            `/api/academic/internalSessionAssignment1/${ids.toString()}`,
            putData
          )
        );
      }

      if (requests.length > 0) {
        await Promise.all(requests);
        setAlertMessage({
          severity: "success",
          message: "Internals has been created successfully !!",
        });
        setAlertOpen(true);
        navigate("/internals");
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Something went wrong !!",
      });
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourses = (id) => {
    const { rowData } = values;
    const addData = rowData.filter((obj) => obj.courseAssignmentId === id);
    const removeData = rowData.filter((obj) => obj.courseAssignmentId !== id);

    setValues((prev) => ({
      ...prev,
      ["rowData"]: removeData,
    }));
    setDeletedCourses((prev) => [...prev, ...addData]);
  };

  const handleAddCourses = (id) => {
    const { rowData } = values;
    const addData = deletedCourses.filter(
      (obj) => obj.courseAssignmentId === id
    );
    const removeData = deletedCourses.filter(
      (obj) => obj.courseAssignmentId !== id
    );

    setValues((prev) => ({
      ...prev,
      ["rowData"]: [...rowData, ...addData],
    }));
    setDeletedCourses((prev) => removeData);
    if (removeData.length === 0) {
      setModalOpen(false);
    }
  };

  const handleViewCourse = () => {
    setModalOpen(true);
  };

  const DisplayTableCell = ({ label }) => (
    <StyledTableCellBody>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
    </StyledTableCellBody>
  );

  return (
    <>
      <ModalWrapper
        open={modalOpen}
        setOpen={setModalOpen}
        maxWidth={800}
        title="Deleted Courses"
      >
        {deletedCourses.length > 0 && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell sx={{ width: "10%" }}>
                    Sl No
                  </StyledTableHeadCell>
                  <StyledTableHeadCell>Course</StyledTableHeadCell>
                  <StyledTableHeadCell sx={{ width: "3%" }} />
                </TableRow>
              </TableHead>

              <TableBody>
                {deletedCourses.map((obj, i) => {
                  return (
                    <TableRow key={i}>
                      <DisplayTableCell label={i + 1} />
                      <DisplayTableCell label={obj.course} />
                      <StyledTableCellBody>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() =>
                            handleAddCourses(obj.courseAssignmentId)
                          }
                        >
                          Add
                        </Button>
                      </StyledTableCellBody>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </ModalWrapper>

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

            {deletedCourses.length > 0 && (
              <Grid item xs={12} align="right" mt={2}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleViewCourse}
                >
                  Deleted Courses
                </Button>
              </Grid>
            )}

            {values?.rowData?.length > 0 && (
              <>
                <Grid item xs={12} mt={2} align="right">
                  <Box sx={{ width: "20%" }}>
                    <CustomTextField
                      label="Search..."
                      value={searchText}
                      handleChange={handleChange}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableHeadCell sx={{ width: "5%" }}>
                            Sl No
                          </StyledTableHeadCell>
                          <StyledTableHeadCell>Course</StyledTableHeadCell>
                          <StyledTableHeadCell sx={{ width: "10%" }}>
                            Max Marks
                          </StyledTableHeadCell>
                          <StyledTableHeadCell sx={{ width: "10%" }}>
                            Min Marks
                          </StyledTableHeadCell>
                          <StyledTableHeadCell sx={{ width: "10%" }}>
                            Exam Date
                          </StyledTableHeadCell>
                          <StyledTableHeadCell sx={{ width: "15%" }}>
                            Time Slot
                          </StyledTableHeadCell>
                          <StyledTableHeadCell sx={{ width: "3%" }} />
                          <StyledTableHeadCell sx={{ width: "3%" }} />
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {filteredRows?.map((obj, i) => {
                          return (
                            <TableRow key={i}>
                              <DisplayTableCell label={i + 1} />
                              <DisplayTableCell label={obj.course} />

                              {obj.readOnly ? (
                                <>
                                  <DisplayTableCell label={obj.maxMarks} />
                                  <DisplayTableCell label={obj.minMarks} />
                                  <DisplayTableCell
                                    label={moment(obj.date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  />
                                  <DisplayTableCell label={obj.timeSlots} />
                                </>
                              ) : (
                                <>
                                  <StyledTableCellBody sx={{ width: "10%" }}>
                                    <CustomTextField
                                      name={`maxMarks-${obj.courseAssignmentId}`}
                                      value={obj.maxMarks}
                                      handleChange={handleChangeInternal}
                                    />
                                  </StyledTableCellBody>
                                  <StyledTableCellBody sx={{ width: "10%" }}>
                                    <CustomTextField
                                      name={`minMarks-${obj.courseAssignmentId}`}
                                      value={obj.minMarks}
                                      handleChange={handleChangeInternal}
                                      disabled={obj.maxMarks === ""}
                                    />
                                  </StyledTableCellBody>
                                  <StyledTableCellBody>
                                    <CustomDatePicker
                                      name={`date-${obj.courseAssignmentId}`}
                                      value={obj.date ? obj.date : null}
                                      handleChangeAdvance={
                                        handleChangeAdvanceInternal
                                      }
                                      helperText=""
                                    />
                                  </StyledTableCellBody>
                                  <StyledTableCellBody>
                                    <CustomAutocomplete
                                      name={`timeSlotId-${obj.courseAssignmentId}`}
                                      value={obj.timeSlotId}
                                      options={timeSlotOptions}
                                      handleChangeAdvance={
                                        handleChangeAdvanceInternal
                                      }
                                    />
                                  </StyledTableCellBody>
                                  <StyledTableCellBody>
                                    <IconButton
                                      onClick={() =>
                                        handleDeleteCourses(
                                          obj.courseAssignmentId
                                        )
                                      }
                                      sx={{ padding: 0 }}
                                    >
                                      <DeleteIcon color="error" />
                                    </IconButton>
                                  </StyledTableCellBody>
                                  <StyledTableCellBody>
                                    {i > 0 && (
                                      <Typography
                                        variant="subtitle2"
                                        color="primary"
                                        onClick={() =>
                                          handleCopy(obj.courseAssignmentId)
                                        }
                                        sx={{ padding: 0, cursor: "pointer" }}
                                      >
                                        Copy
                                      </Typography>
                                    )}
                                  </StyledTableCellBody>
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
                    disabled={loading || !isAllFilled}
                  >
                    {loading ? (
                      <CircularProgress
                        size={25}
                        color="blue"
                        style={{ margin: "2px 13px" }}
                      />
                    ) : (
                      <Typography variant="subtitle2">Create</Typography>
                    )}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </FormPaperWrapper>
      </Box>
    </>
  );
}

export default InternalAssesmentForm;
