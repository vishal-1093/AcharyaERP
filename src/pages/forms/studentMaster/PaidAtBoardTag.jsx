import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import moment from "moment";
import CustomTextField from "../../../components/Inputs/CustomTextField";

const initialValues = {
  amount: "",
  boardId: null,
  acYearId: null,
  schoolId: null,
  programId: null,
  receivedYear: null,
  feeTemplateId: null,
  neftNo: "",
  bulkNo: "",
  remarks: "",
};

const requiredFields = [];

function PaidAtBoardTag() {
  const [values, setValues] = useState(initialValues);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [programSpeOptions, setProgramSpeOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [boardOptions, setBoardOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [programId, setProgramId] = useState(null);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAlertMessage, setAlertOpen } = useAlert();
  const setCrumbs = useBreadcrumbs();

  const checks = {
    fileName: [
      values.fileName,
      values.fileName && values.fileName.name.endsWith(".csv"),
    ],
  };

  const errorMessages = {
    fileName: ["This field is required", "Please upload a CSV File"],
  };

  useEffect(() => {
    getBoardData();
    getAcademicYearData();
    getSchoolData();
    setCrumbs([{ name: "Paid At Board" }]);
  }, [pathname]);

  useEffect(() => {
    getProgramSpeData();
  }, [
    values.acYearId,
    values.schoolId,
    programId,
    values.programSpeId,
    values.yearsemId,
    values.courseId,
  ]);

  const getAcademicYearData = async () => {
    await axios
      .get(`/api/academic/academic_year`)
      .then((res) => {
        setAcYearOptions(
          res.data.data.map((obj) => ({
            value: obj.ac_year_id,
            label: obj.ac_year,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getSchoolData = async () => {
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

  const getBoardData = async () => {
    await axios
      .get(`/api/student/Board`)
      .then((res) => {
        setBoardOptions(
          res.data.data.map((obj) => ({
            value: obj.board_unique_id,
            label: obj.board_unique_name,
          }))
        );
      })
      .catch((err) => console.error(err));
  };

  const getProgramSpeData = async () => {
    if (values.acYearId && values.schoolId)
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

          const yearsem = [];
          res.data.data.forEach((obj) => {
            if (obj.program_specialization_id === values.programSpeId) {
              yearsem.push(obj);
            }
          });

          const newYear = [];
          yearsem.forEach((obj) => {
            if (obj.program_type_name.toLowerCase() === "yearly") {
              for (let i = 1; i <= obj.number_of_years; i++) {
                newYear.push({ value: i, label: "Year" + "-" + i });
              }
            }
            if (obj.program_type_name.toLowerCase() === "semester") {
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

  const handleChangeAdvance = async (name, newValue) => {
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        message: "Please fill all required fields",
      });
      setAlertOpen(true);
    } else {
      navigate(`/paid-at-board-index`);
    }
  };

  return (
    <Box component="form" overflow="hidden" p={1}>
      <FormWrapper>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-start"
          rowSpacing={2.8}
          columnSpacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="acYearId"
              label="AC Year"
              value={values.acYearId}
              options={acYearOptions}
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
              name="boardId"
              label="Board"
              value={values.boardId}
              options={boardOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="feeTemplateId"
              label="Fee template"
              value={values.feeTemplateId}
              options={programSpeOptions}
              handleChangeAdvance={handleChangeAdvance}
              required
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomAutocomplete
              name="receivedYear"
              label="Received Year"
              value={values.receivedYear}
              options={acYearOptions}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>
          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="neftNo"
              label="Neft No."
              value={values.neftNo}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="bulkNo"
              label="Bulk Receipt No."
              value={values.bulkNo}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              name="amount"
              label="Amount"
              value={values.amount}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={2.4}>
            <CustomTextField
              rows={2}
              multiline
              name="remarks"
              label="Remarks"
              value={values.remarks}
              handleChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} align="right">
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
                <strong>{"Submit"}</strong>
              )}
            </Button>
          </Grid>
        </Grid>
      </FormWrapper>
    </Box>
  );
}

export default PaidAtBoardTag;
