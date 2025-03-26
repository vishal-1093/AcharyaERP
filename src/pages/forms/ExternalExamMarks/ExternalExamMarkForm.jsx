import { useState, lazy, useEffect } from "react";
import { Grid, Box, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs.js";
import axios from "../../../services/Api.js";
import useAlert from "../../../hooks/useAlert.js";
import FormWrapper from "../../../components/FormWrapper.jsx";

const CustomTextField = lazy(() =>
  import("../../../components/Inputs/CustomTextField")
);
const CustomDatePicker = lazy(() =>
  import("../../../components/Inputs/CustomDatePicker")
);
const CustomAutocomplete = lazy(() =>
  import("../../../components/Inputs/CustomAutocomplete.jsx")
);

const semLists = [
  { label: "1/1", value: "1/1" },
  { label: "1/2", value: "1/2" },
  { label: "2/3", value: "2/3" },
  { label: "2/4", value: "2/4" },
  { label: "3/5", value: "3/5" },
  { label: "3/6", value: "3/6" },
  { label: "4/7", value: "4/7" },
  { label: "4/8", value: "4/8" },
  { label: "5/9", value: "5/9" },
  { label: "5/10", value: "5/10" },
  { label: "6/11", value: "6/11" },
  { label: "6/12", value: "6/12" },
];

const yearLists = [
  { label: "1/0", value: "1/0" },
  { label: "2/0", value: "2/0" },
  { label: "3/0", value: "3/0" },
  { label: "4/0", value: "4/0" },
  { label: "5/0", value: "5/0" },
  { label: "6/0", value: "6/0" },
  { label: "7/0", value: "7/0" },
  { label: "8/0", value: "8/0" },
  { label: "9/0", value: "9/0" },
  { label: "10/0", value: "10/0" },
];

const initialState = {
  acYearList: [],
  acYearId: "",
  programSpecializationList: [],
  programSpecilizationId: "",
  programAssignmentId: null,
  dateOfExam: "",
  yearOrSemId: "",
  YearSemList: [],
  subjectList: [],
  subjectId: "",
  maxMark: "",
  minMark: "",
  loading: false,
  interalTypeId: null,
};

const ExternalExamMarkForm = () => {
  const [
    {
      acYearList,
      acYearId,
      programSpecializationList,
      programSpecilizationId,
      dateOfExam,
      yearOrSemId,
      YearSemList,
      subjectList,
      subjectId,
      maxMark,
      minMark,
      programAssignmentId,
      loading,
      interalTypeId,
    },
    setState,
  ] = useState(initialState);
  const [internalOptions, setInternalOptions] = useState([]);

  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();

  useEffect(() => {
    setCrumbs([
      { name: "External Exam Mark", link: "/External-exam-mark" },
      { name: "Create" },
    ]);
    getAcademicYearData();
    getProgrammeAndSpecializationData();
    getInternalOptions();
    if (!!location.state) {
      let { ac_year_id, program_assignment_id, current_sem } = location.state;
      getSubjectData(ac_year_id, program_assignment_id, current_sem);
      setState((prevState) => ({
        ...prevState,
        acYearId: location.state?.ac_year_id,
        programSpecilizationId: location.state?.program_specialization_id,
        dateOfExam: location.state?.date_of_exam,
        yearOrSemId: `${location.state?.current_year}/${location.state?.current_sem}`,
        subjectId: location.state?.course_assignment_id,
        maxMark: location.state?.external_max_marks,
        minMark: location.state?.external_min_marks,
        interalTypeId: location.state?.internal_master_id,
      }));
    }
  }, []);

  const getAcademicYearData = async () => {
    try {
      const res = await axios.get(`api/academic/academic_year`);
      if (res.status == 200 || res.status == 201) {
        if (res?.data?.data.length > 0) {
          setState((prevState) => ({
            ...prevState,
            acYearList: res.data.data.map((el) => ({
              label: el.ac_year,
              value: el.ac_year_id,
            })),
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getProgrammeAndSpecializationData = async () => {
    try {
      const res = await axios.get(
        `/api/academic/fetchAllProgramsWithSpecializationBasedOnAcYear`
      );
      if (res?.status == 200 || res.status == 201) {
        if (res?.data?.data?.length > 0) {
          const lists = res.data.data.map((el) => ({
            label: el.specialization_with_program,
            value: el.program_specialization_id,
            number_of_semester: el.number_of_semester,
            number_of_years: el.number_of_years,
            program_type_name: el.program_type_name,
            program_assignment_id: el.program_assignment_id,
            program_id: el.program_id,
            school_id: el.school_id,
          }));
          if (!!location.state) {
            getNoOfYears(lists, location.state?.program_specialization_id);
          }
          setState((prevState) => ({
            ...prevState,
            programSpecializationList: lists,
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
    }
  };

  const getSubjectData = async (
    academicYear_Id,
    program_assignment_id,
    currentSem
  ) => {
    try {
      const res = await axios.get(
        `/api/student/getCourseAssignmentDetails/${academicYear_Id}/${program_assignment_id}/${currentSem}`
      );
      if (res.status == 200 || res.status == 201) {
        if (res?.data?.data?.length > 0) {
          setState((prevState) => ({
            ...prevState,
            subjectList: res.data.data.map((el) => ({
              ...el,
              label: el.courseName,
              value: el.course_assignment_id,
            })),
          }));
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured in subject !!",
      });
      setAlertOpen(true);
    }
  };

  const handleProgramSpecialization = () => {
    setState((prevState) => ({
      ...prevState,
      programSpecializationList: [],
      programSpecializationId: null,
    }));
  };

  const getNoOfYears = (list, value) => {
    let data = [];
    const program_assignment_id = list.find(
      (el) => el.value == value
    )?.program_assignment_id;
    const programType = list.find((el) => el.value == value)?.program_type_name;
    if (programType == "Yearly") {
      const noOfYear = list.find((el) => el.value == value)?.number_of_years;
      data = yearLists.slice(0, noOfYear);
    } else {
      const noOfSem = list.find((el) => el.value == value)?.number_of_semester;
      data = semLists.slice(0, noOfSem);
    }
    if (data.length > 0) {
      setState((prevState) => ({
        ...prevState,
        YearSemList: data,
        programAssignmentId: program_assignment_id,
      }));
    }
  };

  const getInternalOptions = async () => {
    try {
      const internalResponse = await axios.get("api/academic/InternalTypes");
      const internalResponseData = internalResponse.data.data.filter((obj) => {
        const shortName = obj.internal_short_name?.trim().toLowerCase();
        return shortName !== "ia1" && shortName !== "ia2";
      });
      const internalOptionData = [];
      internalResponseData.forEach((obj) => {
        internalOptionData.push({
          value: obj.internal_master_id,
          label: obj.internal_name,
          shortName: obj.internal_short_name,
        });
      });
      setInternalOptions(internalOptionData);
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message || "Failed to load Internal Types !!",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    if (name == "acYearId") {
      handleProgramSpecialization();
      getProgrammeAndSpecializationData();
    }
    if (name == "programSpecilizationId") {
      getNoOfYears(programSpecializationList, newValue);
    }
    if (name == "yearOrSemId") {
      const [_, currentSem] = newValue?.split("/").map(Number);
      getSubjectData(acYearId, programAssignmentId, currentSem);
    }
    setState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setLoading = (val) => {
    setState((prevState) => ({
      ...prevState,
      loading: val,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const internalLabels = internalOptions.find(
        (obj) => obj.value === interalTypeId
      );
      const programLabels = programSpecializationList.find(
        (obj) => obj.value === programSpecilizationId
      );
      const [currentYear, currentSem] = yearOrSemId?.split("/").map(Number);
      let payload = {
        internal_master_id: interalTypeId,
        internal_name: internalLabels?.label,
        internal_short_name: internalLabels?.shortName,
        program_id: programLabels?.program_id,
        remarks: null,
        exam_time: null,
        time_slots_id: null,
        week_day: null,
        min_marks: null,
        max_marks: null,
        course_assignment_id: subjectId,
        year_sem: null,
        ac_year_id: acYearId,
        program_specialization_id: programSpecilizationId,
        date_of_exam: dateOfExam,
        external_min_marks: Number(minMark),
        external_max_marks: Number(maxMark),
        percentage: null,
        current_year: currentYear,
        current_sem: currentSem,
        active: true,
        school_id: programLabels?.school_id,
      };
      if (!!location.state) {
        payload["internal_session_id"] = location.state.id;
        const res = await axios.put(
          `/api/academic/updateExternalMark/${location.state.id}`,
          payload
        );
        if ((res.status = 200 || res.status == 201)) {
          actionAfterResponse();
        } else {
          setLoading(false);
        }
      } else {
        const res = await axios.post(`api/academic/createExternalMarks`, [
          payload,
        ]);
        if ((res.status = 200 || res.status == 201)) {
          actionAfterResponse();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error.response
          ? error.response.data.message
          : "An error occured !!",
      });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  const actionAfterResponse = () => {
    setLoading(false);
    navigate("/external-exam-mark", {
      replace: true,
    });
    setAlertMessage({
      severity: "success",
      message: `Exam mark ${
        !!location.state ? "updated" : "created"
      } successfully !!`,
    });
    setAlertOpen(true);
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, md: 4 }}>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="interalTypeId"
              label="Internal"
              value={interalTypeId}
              options={internalOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="acYearId"
              label="Academic Year"
              value={acYearId || ""}
              options={acYearList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="programSpecilizationId"
              label="Program & Specilization"
              value={programSpecilizationId || ""}
              options={programSpecializationList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="yearOrSemId"
              label="Year/Sem"
              value={yearOrSemId || ""}
              options={YearSemList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomDatePicker
              name="dateOfExam"
              label="Exam Date"
              value={dateOfExam || ""}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomAutocomplete
              name="subjectId"
              label="Subject"
              value={subjectId || ""}
              options={subjectList || []}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="maxMark"
              label="Maximum Mark"
              value={maxMark || ""}
              handleChange={handleChange}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField
              name="minMark"
              label="Minimum Mark"
              value={minMark || ""}
              handleChange={handleChange}
              type="number"
              required
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "end", alignItems: "end" }}
          >
            <Button
              style={{ borderRadius: 7 }}
              variant="contained"
              color="primary"
              // disabled={
              //   loading ||
              //   !acYearId ||
              //   !programSpecilizationId ||
              //   !yearOrSemId ||
              //   !dateOfExam ||
              //   !maxMark ||
              //   !minMark
              // }
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="blue"
                  style={{ margin: "2px 13px" }}
                />
              ) : (
                <strong>{"Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
};

export default ExternalExamMarkForm;
