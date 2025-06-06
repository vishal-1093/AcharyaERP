import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import FormWrapper from "../../../components/FormWrapper";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import axios from "../../../services/Api";
import useAlert from "../../../hooks/useAlert";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import CustomDatePicker from "../../../components/Inputs/CustomDatePicker";

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
  receivedDate: null,
};

const requiredFields = [];

const years = [
  { label: 1, value: 1 },
  { label: 2, value: 2 },
  { label: 3, value: 3 },
  { label: 4, value: 4 },
  { label: 5, value: 5 },
  { label: 6, value: 6 },
  { label: 7, value: 7 },
  { label: 8, value: 8 },
];

function PaidAtBoardTag() {
  const [values, setValues] = useState(initialValues);
  const [acYearOptions, setAcYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [yearSemOptions, setYearSemOptions] = useState([]);
  const [feetemplateOptions, setFeetemplateOptions] = useState([]);
  const [boardOptions, setBoardOptions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    getAcademicYearData();
    getSchoolData();
    setCrumbs([{ name: "Paid At Board" }]);
  }, [pathname]);

  useEffect(() => {
    getFeetemplateData();
    getBoardData();
  }, [values.acYearId, values.schoolId, values.feeTemplateId]);

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
    if (values.feeTemplateId)
      try {
        const getBoardResponse = await axios.get(
          `/api/finance/boardAssignedToFeeTemplate/${values.feeTemplateId}`
        );

        const data = [];

        getBoardResponse.data.data.forEach((ele) => {
          data.push({
            label: ele.board_unique_name,
            value: ele.board_unique_id,
          });
        });

        setBoardOptions(data);
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
        setAlertOpen(true);
      }
  };

  const getFeetemplateData = async () => {
    if (values.acYearId && values.schoolId)
      try {
        const getTemplateResponse = await axios.get(
          `/api/finance/feeTemplateByAcYearAndSchool/${values.acYearId}/${values.schoolId}`
        );

        const data = [];

        getTemplateResponse.data.data.forEach((ele) => {
          data.push({
            label: `${ele.fee_template_name} - ${ele.fee_template_id}`,
            value: ele.fee_template_id,
          });
        });

        setFeetemplateOptions(data);
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
        setAlertOpen(true);
      }
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
      const payload = {
        receivedYear: values.receivedYear,
        acYearId: values.acYearId,
        boardId: values.boardId,
        yearSem: values.receivedYear,
        neftNo: values.neftNo,
        amount: Number(values.amount),
        bulkReceiptNo: values.bulkNo,
        remarks: values.remarks,
        paidByStudent: true,
        receivedDate: values.receivedDate,
        schoolId: values.schoolId,
        taggedAmount: 0,
        lockStatus: false,
        feeTemplateId: values.feeTemplateId,
        remainingBalance: Number(values.amount),
        active: true,
      };

      try {
        const [response] = await Promise.all([
          axios.post(`/api/finance/boardReceivedAmount`, payload),
        ]);
        if (!response.data.success) {
          throw new Error();
        }

        setAlertMessage({
          severity: "success",
          message: "Created Successfully",
        });
        setAlertOpen(true);
        navigate(`/paid-at-board-index`);
      } catch (error) {
        setAlertMessage({
          severity: "error",
          message: error.response.data.message,
        });
        setAlertOpen(true);
      }
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
              name="feeTemplateId"
              label="Fee template"
              value={values.feeTemplateId}
              options={feetemplateOptions}
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
              name="receivedYear"
              label="Received Year"
              value={values.receivedYear}
              options={years}
              handleChangeAdvance={handleChangeAdvance}
            />
          </Grid>

          <Grid item xs={12} md={2.4} mt={2}>
            <CustomDatePicker
              name="receivedDate"
              label="Receipt Date"
              value={values.receivedDate}
              handleChangeAdvance={handleChangeAdvance}
              checks={checks.receivedDate}
              errors={errorMessages.receivedDate}
              required
              maxDate={values.completeDate}
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
