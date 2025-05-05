import { useEffect, useState } from "react";
import axios from "../../../services/Api";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import CustomAutocomplete from "../../../components/Inputs/CustomAutocomplete";
import CustomTextField from "../../../components/Inputs/CustomTextField";
import moment from "moment";
import useAlert from "../../../hooks/useAlert";
import CustomRadioButtons from "../../../components/Inputs/CustomRadioButtons";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomFileInput from "../../../components/Inputs/CustomFileInput";
import FormWrapper from "../../../components/FormWrapper";
import { useLocation, useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.headerWhite.main,
  },
}));

const initialVoucherData = {
  interSchoolId: null,
  interBankId: null,
  interBankData: [],
  debit: "",
};

const initialValues = {
  schoolId: null,
  date: moment().format("DD-MM-YYYY"),
  bankId: null,
  chequeNo: "",
  payTo: "",
  deptId: null,
  isOnline: "yes",
  voucherData: [initialVoucherData],
  schoolData1: [],
  schoolData2: [],
  deptData: [],
  bankData: [],
  remarks: "",
  document: "",
};

const onlineOptions = [
  {
    value: "yes",
    label: "Yes",
  },
  {
    value: "no",
    label: "No",
  },
];

const requiredFields = ["schoolId", "bankId", "payTo", "remarks", "document"];

function FundTransfer() {
  const [values, setValues] = useState(initialValues);
  const [totalDebit, setTotalDebit] = useState(0);
  const [rowValid, setRowValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setAlertMessage, setAlertOpen } = useAlert();
  const location = useLocation();
  const { school_id } = location?.state;
  const setCrumbs = useBreadcrumbs();
  const navigate = useNavigate();

  const maxLength = 150;

  const getRemainingCharacters = (field) => maxLength - values[field].length;

  const checks = {
    document: [
      values.document !== "",
      values.document && values.document.name.endsWith(".pdf"),
      values.document && values.document.size < 2000000,
    ],
  };

  const errorMessages = {
    document: [
      "This field is required",
      "Please upload a PDF",
      "Maximum size 2 MB",
    ],
  };

  useEffect(() => {
    getData();
    setCrumbs([{ name: "Fund Transfer", link: "/accounts-voucher" }]);
  }, []);

  useEffect(() => {
    getDeptData();
  }, [values.schoolId]);

  useEffect(() => {
    const hasVendorId = values.voucherData.every(
      (obj) => obj.interSchoolId && obj.interBankId
    );

    setRowValid(hasVendorId);

    const calculateTotalDebit = () => {
      const total = values.voucherData.reduce((sum, voucher) => {
        const debit = parseFloat(voucher.debit) || 0;
        return sum + debit;
      }, 0);
      setTotalDebit(total);
    };

    calculateTotalDebit();
  }, [values.voucherData]);

  const getData = async () => {
    try {
      const [schoolResponse1] = await Promise.all([
        axios.get(`/api/institute/school`),
      ]);

      const schoolData1 = [];
      const schoolData2 = [];

      schoolResponse1.data.data.forEach((obj) => {
        schoolData1.push({
          label: obj.school_name,
          value: obj.school_id,
        });
      });

      schoolResponse1.data.data.forEach((obj) => {
        schoolData2.push({
          label: obj.school_name_short,
          value: obj.school_id,
        });
      });

      setValues((prev) => ({
        ...prev,
        ["schoolId"]: school_id,
        ["schoolData1"]: schoolData1,
        ["schoolData2"]: schoolData2,
      }));
    } catch (error) {
      setAlertMessage({
        severity: "error",
        message: error?.response?.data?.message || "Error Occured",
      });
      setAlertOpen(true);
    }
  };

  const getDeptData = async () => {
    const { schoolId } = values;
    if (!schoolId) return;

    try {
      const [deptResponse, bankResponse] = await Promise.all([
        axios.get(`/api/fetchdept1/${schoolId}`),
        axios.get(`/api/finance/bankDetailsBasedOnSchoolId/${schoolId}`),
      ]);
      const deptOptionData = [];
      const bankOptionData = [];
      deptResponse?.data?.data?.forEach((obj) => {
        deptOptionData.push({
          value: obj.dept_id,
          label: obj.dept_name,
        });
      });

      bankResponse?.data?.data.forEach((obj) => {
        bankOptionData.push({
          value: obj.id,
          label: obj.bank_name,
        });
      });

      setValues((prev) => ({
        ...prev,
        ["deptData"]: deptOptionData,
        ["bankData"]: bankOptionData,
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load the data",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvance = (name, newValue) => {
    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length > maxLength) return;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeAdvanceVoucher = async (name, newValue) => {
    const [field, index] = name.split("-");

    let url;

    try {
      url = `/api/finance/bankDetailsBasedOnSchoolId/${newValue}`;

      const { data: response } = await axios.get(`${url}`);

      const bankData = [];
      response?.data?.forEach((obj) => {
        bankData.push({
          value: obj.id,
          label: obj.bank_name,
        });
      });

      setValues((prev) => ({
        ...prev,
        voucherData: prev.voucherData.map((obj, i) => {
          if (i === parseInt(index))
            return { ...obj, [field]: newValue, ["interBankData"]: bankData };
          return obj;
        }),
      }));
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message: err.response?.data?.message || "Failed to load data",
      });
      setAlertOpen(true);
    }
  };

  const handleChangeAdvanceBank = (name, newValue) => {
    const [field, index] = name.split("-");

    setValues((prev) => ({
      ...prev,
      voucherData: prev.voucherData.map((obj, i) => {
        if (i === parseInt(index)) return { ...obj, [field]: newValue };
        return obj;
      }),
    }));
  };

  const handleChangeDebit = (e) => {
    const { name, value } = e.target;
    const [field, index] = name.split("-");
    const parsedIndex = parseInt(index);
    if (!/^\d*$/.test(value)) return;
    setValues((prev) => ({
      ...prev,
      voucherData: prev.voucherData.map((obj, i) => {
        if (i === parsedIndex)
          return {
            ...obj,
            [field]: value,
          };
        return obj;
      }),
    }));
  };

  const add = () => {
    setValues((prev) => ({
      ...prev,
      voucherData: [...prev.voucherData, { ...initialVoucherData }],
    }));
  };

  const remove = () => {
    setValues((prev) => ({
      ...prev,
      voucherData: prev.voucherData.slice(0, -1),
    }));
  };

  const handleFileDrop = (name, newFile) => {
    if (newFile)
      setValues((prev) => ({
        ...prev,
        [name]: newFile,
      }));
  };

  const handleFileRemove = (name) => {
    setValues((prev) => ({
      ...prev,
      [name]: null,
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

  const handleCreate = async () => {
    const {
      voucherData,
      schoolId,
      date,
      bankId,
      remarks,
      chequeNo,
      payTo,
      isOnline,
      deptId,
      document,
    } = values;

    const postData = [];

    voucherData.forEach((obj) => {
      postData.push({
        school_id: schoolId,
        date: date,
        bank_id: bankId,
        active: true,
        remarks,
        cheque_dd_no: chequeNo,
        debit: obj.debit,
        debit_total: totalDebit,
        inter_school_id: obj.interSchoolId,
        inter_bank_id: obj.interBankId,
        pay_to: payTo,
        online: isOnline === "yes" ? 1 : 0,
        payment_mode: 5,
        dept_id: deptId,
        type: "FUND-TRANSFER",
      });
    });

    setLoading(true);

    try {
      const interSchoolValid = values.voucherData.every(
        (obj) => obj.interSchoolId && obj.interBankId && obj.debit
      );

      if (!interSchoolValid) {
        setAlertMessage({
          severity: "error",
          message: "Please select the Inter Bank & Inter School & Debit",
        });
        setAlertOpen(true);
        setLoading(false);
        return;
      }

      const { data: response } = await axios.post(
        "/api/finance/draftPaymentVoucher",
        postData
      );

      if (!response.success) {
        setAlertMessage({
          severity: "error",
          message: "Unable to create the payment voucher.",
        });
        setAlertOpen(true);
        setLoading(false);
        return;
      }
      const responseData = response.data[0];

      const dataArray = new FormData();
      dataArray.append("file", document);
      dataArray.append("voucher_no", responseData.voucher_no);
      const { data: documentResponse } = await axios.post(
        "/api/finance/draftPaymentVoucherUploadFile",
        dataArray
      );
      if (documentResponse.success) {
        setAlertMessage({
          severity: "success",
          message: "Payment voucher has been created successfully.",
        });
        setAlertOpen(true);
        setValues(initialValues);
        navigate("/draft-payment-voucher-verify");
        setLoading(false);
      }
    } catch (err) {
      setAlertMessage({
        severity: "error",
        message:
          err.response?.data?.message ||
          "Unable to create the payment voucher.",
      });
      setAlertOpen(true);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{ margin: { xs: "20px 0px 0px 0px", md: "15px 15px 0px 15px" } }}
      >
        <FormWrapper>
          <Grid container rowSpacing={4} columnSpacing={2}>
            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="schoolId"
                label="School"
                value={values.schoolId}
                options={values.schoolData1}
                disabled={school_id}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                name="date"
                label="Date"
                value={values.date}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomAutocomplete
                name="bankId"
                label="Bank"
                value={values.bankId}
                options={values.bankData}
                handleChangeAdvance={handleChangeAdvance}
                required
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                name="chequeNo"
                label="Cheque No."
                value={values.chequeNo}
                handleChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                name="payTo"
                label="Pay To"
                value={values.payTo}
                handleChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <CustomAutocomplete
                name="deptId"
                label="Department"
                value={values.deptId}
                options={values?.deptData}
                handleChangeAdvance={handleChangeAdvance}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <CustomRadioButtons
                name="isOnline"
                label="Is Online"
                value={values.isOnline}
                items={onlineOptions}
                handleChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper} elevation={3}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Inter School *</StyledTableCell>
                      <StyledTableCell>Inter Bank *</StyledTableCell>
                      <StyledTableCell>Debit *</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {values?.voucherData?.map((obj, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <CustomAutocomplete
                            name={`interSchoolId-${i}`}
                            value={obj.interSchoolId}
                            options={values?.schoolData2}
                            handleChangeAdvance={handleChangeAdvanceVoucher}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <CustomAutocomplete
                            name={`interBankId-${i}`}
                            value={obj.interBankId}
                            options={obj?.interBankData}
                            handleChangeAdvance={handleChangeAdvanceBank}
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <CustomTextField
                            name={`debit-${i}`}
                            value={obj.debit}
                            inputProps={{
                              style: { textAlign: "right" },
                            }}
                            handleChange={handleChangeDebit}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2">Total</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Typography variant="subtitle2">
                          {totalDebit}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "right" }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={add}
                >
                  <AddIcon />
                </Button>
                {values.voucherData?.length > 1 && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={remove}
                  >
                    <RemoveIcon />
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                name="remarks"
                label="Remarks"
                value={values.remarks}
                handleChange={handleChange}
                helperText={`Remaining characters : ${getRemainingCharacters(
                  "remarks"
                )}`}
                multiline
              />
            </Grid>

            <Grid item xs={12} md={6} align="center">
              <CustomFileInput
                name="document"
                label="Document"
                helperText="PDF - smaller than 2 MB"
                file={values.document}
                handleFileDrop={handleFileDrop}
                handleFileRemove={handleFileRemove}
                checks={checks.document}
                errors={errorMessages.document}
              />
            </Grid>

            <Grid item xs={12} align="right">
              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={loading || !requiredFieldsValid() || !rowValid}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    color="blue"
                    style={{ margin: "2px 13px" }}
                  />
                ) : (
                  "Create"
                )}
              </Button>
            </Grid>
          </Grid>
        </FormWrapper>
      </Box>
    </>
  );
}

export default FundTransfer;
